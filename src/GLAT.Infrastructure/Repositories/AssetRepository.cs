using GLAT.Domain.Entities;
using GLAT.Domain.Enums;
using GLAT.Domain.Interfaces;
using GLAT.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GLAT.Infrastructure.Repositories;

public class AssetRepository(AppDbContext db) : IAssetRepository
{
    public async Task<(IEnumerable<Asset> Items, int TotalCount)> GetAllAsync(
        int page, int pageSize, AssetType? type = null, AssetStatus? status = null)
    {
        var query = db.Assets.AsNoTracking().AsQueryable();

        if (type.HasValue)
            query = query.Where(a => a.Type == type.Value);
        if (status.HasValue)
            query = query.Where(a => a.Status == status.Value);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderBy(a => a.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<Asset?> GetByIdAsync(Guid id)
    {
        return await db.Assets.FindAsync(id);
    }

    public async Task<Asset> CreateAsync(Asset asset)
    {
        db.Assets.Add(asset);
        await db.SaveChangesAsync();
        return asset;
    }

    public async Task UpdateAsync(Asset asset)
    {
        db.Assets.Update(asset);
        await db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var asset = await db.Assets.FindAsync(id);
        if (asset is not null)
        {
            db.Assets.Remove(asset);
            await db.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await db.Assets.AnyAsync(a => a.Id == id);
    }
}
