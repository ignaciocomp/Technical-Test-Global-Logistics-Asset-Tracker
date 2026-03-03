using GLAT.Application.Common.Exceptions;
using GLAT.Application.DTOs;
using GLAT.Application.Interfaces;
using GLAT.Application.Mapping;
using GLAT.Domain.Entities;
using GLAT.Domain.Interfaces;
using MediatR;

namespace GLAT.Application.Features.Telemetry;

public record AddTelemetryCommand(Guid AssetId, CreateTelemetryRequest Body) : IRequest<TelemetryLogDto>;

public class AddTelemetryHandler(
    IAssetRepository assetRepo,
    ITelemetryRepository telemetryRepo) : IRequestHandler<AddTelemetryCommand, TelemetryLogDto>
{
    public async Task<TelemetryLogDto> Handle(AddTelemetryCommand request, CancellationToken ct)
    {
        if (!await assetRepo.ExistsAsync(request.AssetId))
            throw new NotFoundException("Asset", request.AssetId);

        var s = request.Body.Sensors;
        var readings = SensorReadings.Create(s.Temperature, s.Pressure, s.Vibration);
        var log = TelemetryLog.Create(request.AssetId, readings);

        await telemetryRepo.AddAsync(log);
        return log.ToDto();
    }
}
