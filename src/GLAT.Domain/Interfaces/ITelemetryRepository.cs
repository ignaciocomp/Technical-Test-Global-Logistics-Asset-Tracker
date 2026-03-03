using GLAT.Domain.Entities;

namespace GLAT.Domain.Interfaces;

public interface ITelemetryRepository
{
    Task AddAsync(TelemetryLog log);
    Task<(IEnumerable<TelemetryLog> Items, int TotalCount)> GetByAssetIdAsync(
        Guid assetId, int page, int pageSize);
    Task<TelemetryLog?> GetLatestByAssetIdAsync(Guid assetId);
}
