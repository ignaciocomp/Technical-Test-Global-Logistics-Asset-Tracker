using GLAT.Application.DTOs;
using GLAT.Application.Mapping;
using GLAT.Domain.Enums;
using GLAT.Domain.Interfaces;
using MediatR;

namespace GLAT.Application.Features.Assets;

public record GetAssetsQuery(int Page, int PageSize, AssetType? Type, AssetStatus? Status)
    : IRequest<PaginatedResponse<AssetDto>>;

public class GetAssetsHandler(IAssetRepository repo) : IRequestHandler<GetAssetsQuery, PaginatedResponse<AssetDto>>
{
    public async Task<PaginatedResponse<AssetDto>> Handle(GetAssetsQuery request, CancellationToken ct)
    {
        var (items, totalCount) = await repo.GetAllAsync(request.Page, request.PageSize, request.Type, request.Status);
        var dtos = items.Select(a => a.ToDto());
        return PaginatedResponse<AssetDto>.From(dtos, totalCount, request.Page, request.PageSize);
    }
}
