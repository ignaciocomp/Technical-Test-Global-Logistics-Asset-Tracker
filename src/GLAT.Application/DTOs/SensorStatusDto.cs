namespace GLAT.Application.DTOs;

public record SensorStatusDto(
    Guid AssetId,
    double HealthScore,
    List<string> Alerts,
    DateTimeOffset CalculatedAt);
