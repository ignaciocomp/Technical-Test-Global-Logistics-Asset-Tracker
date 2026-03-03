using GLAT.Application.Common.Exceptions;
using GLAT.Application.DTOs;
using GLAT.Application.Mapping;
using GLAT.Domain.Entities;
using GLAT.Domain.Enums;
using GLAT.Domain.Interfaces;
using MediatR;

namespace GLAT.Application.Features.Assets;

public record UpdateAssetCommand(Guid Id, UpdateAssetRequest Body) : IRequest<AssetDto>;

public class UpdateAssetHandler(IAssetRepository repo) : IRequestHandler<UpdateAssetCommand, AssetDto>
{
    public async Task<AssetDto> Handle(UpdateAssetCommand request, CancellationToken ct)
    {
        var asset = await repo.GetByIdAsync(request.Id)
            ?? throw new NotFoundException("Asset", request.Id);

        var body = request.Body;
        var status = body.Status is not null ? Enum.Parse<AssetStatus>(body.Status, ignoreCase: true) : (AssetStatus?)null;
        var location = body.Location is not null ? Location.Create(body.Location.Latitude, body.Location.Longitude) : null;

        asset.Update(body.Name, status, location);
        await repo.UpdateAsync(asset);

        return asset.ToDto();
    }
}
