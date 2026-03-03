using GLAT.Domain.Entities;
using GLAT.Domain.Interfaces;
using GLAT.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GLAT.Infrastructure.Repositories;

public class TelemetryRepository(AppDbContext db) : ITelemetryRepository
{
    public async Task AddAsync(TelemetryLog log)
    {
        db.TelemetryLogs.Add(log);
        await db.SaveChangesAsync();
    }

    public async Task<(IEnumerable<TelemetryLog> Items, int TotalCount)> GetByAssetIdAsync(
        Guid assetId, int page, int pageSize)
    {
        var query = db.TelemetryLogs
            .AsNoTracking()
            .Where(t => t.AssetId == assetId);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(t => t.Timestamp)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<TelemetryLog?> GetLatestByAssetIdAsync(Guid assetId)
    {
        return await db.TelemetryLogs
            .AsNoTracking()
            .Where(t => t.AssetId == assetId)
            .OrderByDescending(t => t.Timestamp)
            .FirstOrDefaultAsync();
    }
}
