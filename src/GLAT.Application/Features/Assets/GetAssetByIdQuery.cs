using GLAT.Application.Common.Exceptions;
using GLAT.Application.DTOs;
using GLAT.Application.Mapping;
using GLAT.Domain.Interfaces;
using MediatR;

namespace GLAT.Application.Features.Assets;

public record GetAssetByIdQuery(Guid Id) : IRequest<AssetDto>;

public class GetAssetByIdHandler(IAssetRepository repo) : IRequestHandler<GetAssetByIdQuery, AssetDto>
{
    public async Task<AssetDto> Handle(GetAssetByIdQuery request, CancellationToken ct)
    {
        var asset = await repo.GetByIdAsync(request.Id)
            ?? throw new NotFoundException("Asset", request.Id);

        return asset.ToDto();
    }
}
