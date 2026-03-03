namespace GLAT.Domain.Entities;

public class SensorStatus
{
    public Guid AssetId { get; private set; }
    public double HealthScore { get; private set; }
    public List<string> Alerts { get; private set; } = [];
    public DateTimeOffset CalculatedAt { get; private set; }

    private SensorStatus() { }

    public static SensorStatus Create(Guid assetId, double healthScore, List<string> alerts)
    {
        if (healthScore is < 0 or > 100)
            throw new ArgumentOutOfRangeException(nameof(healthScore));

        return new SensorStatus
        {
            AssetId = assetId,
            HealthScore = healthScore,
            Alerts = alerts,
            CalculatedAt = DateTimeOffset.UtcNow
        };
    }
}
