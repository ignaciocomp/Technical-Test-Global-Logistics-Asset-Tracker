using GLAT.Domain.Entities;
using GLAT.Domain.Enums;

namespace GLAT.Domain.Interfaces;

public interface IAssetRepository
{
    Task<(IEnumerable<Asset> Items, int TotalCount)> GetAllAsync(
        int page, int pageSize, AssetType? type = null, AssetStatus? status = null);
    Task<Asset?> GetByIdAsync(Guid id);
    Task<Asset> CreateAsync(Asset asset);
    Task UpdateAsync(Asset asset);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
}
