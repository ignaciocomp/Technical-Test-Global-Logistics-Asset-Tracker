namespace GLAT.Domain.Entities;

public class TelemetryLog
{
    public Guid Id { get; private set; }
    public Guid AssetId { get; private set; }
    public DateTimeOffset Timestamp { get; private set; }
    public SensorReadings Sensors { get; private set; } = null!;

    private TelemetryLog() { }

    public static TelemetryLog Create(Guid assetId, SensorReadings sensors)
    {
        if (assetId == Guid.Empty)
            throw new ArgumentException("Asset ID is required.", nameof(assetId));

        return new TelemetryLog
        {
            Id = Guid.NewGuid(),
            AssetId = assetId,
            Timestamp = DateTimeOffset.UtcNow,
            Sensors = sensors
        };
    }
}
