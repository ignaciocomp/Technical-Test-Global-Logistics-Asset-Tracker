using GLAT.Domain.Enums;

namespace GLAT.Domain.Entities;

public class Asset
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public AssetType Type { get; private set; }
    public AssetStatus Status { get; private set; }
    public Location Location { get; private set; } = null!;
    public DateTimeOffset LastUpdated { get; private set; }

    private readonly List<TelemetryLog> _telemetryLogs = [];
    public IReadOnlyCollection<TelemetryLog> TelemetryLogs => _telemetryLogs.AsReadOnly();

    private Asset() { }

    public static Asset Create(string name, AssetType type, AssetStatus status, Location location)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name is required.", nameof(name));

        return new Asset
        {
            Id = Guid.NewGuid(),
            Name = name.Trim(),
            Type = type,
            Status = status,
            Location = location,
            LastUpdated = DateTimeOffset.UtcNow
        };
    }

    public void Update(string? name, AssetStatus? status, Location? location)
    {
        if (name is not null)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name cannot be empty.", nameof(name));
            Name = name.Trim();
        }

        if (status.HasValue)
            Status = status.Value;

        if (location is not null)
            Location = location;

        LastUpdated = DateTimeOffset.UtcNow;
    }
}
