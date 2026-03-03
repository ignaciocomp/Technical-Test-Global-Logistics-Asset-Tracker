using GLAT.Application.DTOs;
using GLAT.Domain.Entities;

namespace GLAT.Application.Mapping;

public static class AssetMapper
{
    public static AssetDto ToDto(this Asset asset)
    {
        return new AssetDto(
            asset.Id,
            asset.Name,
            asset.Type.ToString().ToLowerInvariant(),
            asset.Status.ToString().ToLowerInvariant(),
            new LocationDto(asset.Location.Latitude, asset.Location.Longitude),
            asset.LastUpdated);
    }

    public static TelemetryLogDto ToDto(this TelemetryLog log)
    {
        return new TelemetryLogDto(
            log.Id,
            log.AssetId,
            log.Timestamp,
            new SensorsDto(log.Sensors.Temperature, log.Sensors.Pressure, log.Sensors.Vibration));
    }
}
