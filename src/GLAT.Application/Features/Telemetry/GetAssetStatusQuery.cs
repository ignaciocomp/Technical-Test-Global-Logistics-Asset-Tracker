using GLAT.Application.Common.Exceptions;
using GLAT.Application.DTOs;
using GLAT.Application.Interfaces;
using GLAT.Domain.Interfaces;
using MediatR;

namespace GLAT.Application.Features.Telemetry;

public record GetAssetStatusQuery(Guid AssetId) : IRequest<SensorStatusDto>;

public class GetAssetStatusHandler(
    IAssetRepository assetRepo,
    ITelemetryRepository telemetryRepo,
    IHealthScoreService healthScoreService) : IRequestHandler<GetAssetStatusQuery, SensorStatusDto>
{
    public async Task<SensorStatusDto> Handle(GetAssetStatusQuery request, CancellationToken ct)
    {
        if (!await assetRepo.ExistsAsync(request.AssetId))
            throw new NotFoundException("Asset", request.AssetId);

        var latest = await telemetryRepo.GetLatestByAssetIdAsync(request.AssetId)
            ?? throw new NotFoundException("TelemetryLog", request.AssetId);

        var s = latest.Sensors;
        var score = healthScoreService.CalculateHealthScore(s.Temperature, s.Pressure, s.Vibration);

        var alerts = new List<string>();
        if (s.Temperature > 80) alerts.Add("High temperature");
        if (s.Temperature < -20) alerts.Add("Low temperature");
        if (s.Pressure > 150) alerts.Add("High pressure");
        if (s.Pressure < 20) alerts.Add("Low pressure");
        if (s.Vibration > 70) alerts.Add("Excessive vibration");
        if (score < 50) alerts.Add("Critical health score");

        return new SensorStatusDto(request.AssetId, score, alerts, DateTimeOffset.UtcNow);
    }
}
