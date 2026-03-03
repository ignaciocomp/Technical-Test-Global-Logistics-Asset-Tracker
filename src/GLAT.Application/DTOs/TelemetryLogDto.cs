namespace GLAT.Application.DTOs;

public record TelemetryLogDto(
    Guid Id,
    Guid AssetId,
    DateTimeOffset Timestamp,
    SensorsDto Sensors);
