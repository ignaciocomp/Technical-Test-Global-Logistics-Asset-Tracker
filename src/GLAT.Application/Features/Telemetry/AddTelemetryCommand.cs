using GLAT.Application.Common.Exceptions;
using GLAT.Application.DTOs;
using GLAT.Application.Interfaces;
using GLAT.Domain.Entities;
using GLAT.Domain.Interfaces;
using MediatR;

namespace GLAT.Application.Features.Telemetry;

public record AddTelemetryCommand(Guid AssetId, CreateTelemetryRequest Body) : IRequest<SensorStatusDto>;

public class AddTelemetryHandler(
    IAssetRepository assetRepo,
    ITelemetryRepository telemetryRepo,
    IHealthScoreService healthScoreService) : IRequestHandler<AddTelemetryCommand, SensorStatusDto>
{
    public async Task<SensorStatusDto> Handle(AddTelemetryCommand request, CancellationToken ct)
    {
        if (!await assetRepo.ExistsAsync(request.AssetId))
            throw new NotFoundException("Asset", request.AssetId);

        var s = request.Body.Sensors;
        var readings = SensorReadings.Create(s.Temperature, s.Pressure, s.Vibration);
        var log = TelemetryLog.Create(request.AssetId, readings);

        await telemetryRepo.AddAsync(log);

        var score = healthScoreService.CalculateHealthScore(s.Temperature, s.Pressure, s.Vibration);
        var alerts = AlertEvaluator.Evaluate(s.Temperature, s.Pressure, s.Vibration, score);

        return new SensorStatusDto(request.AssetId, score, alerts, DateTimeOffset.UtcNow);
    }
}
