using GLAT.Application.DTOs;
using GLAT.Application.Mapping;
using GLAT.Domain.Entities;
using GLAT.Domain.Enums;
using GLAT.Domain.Interfaces;
using MediatR;

namespace GLAT.Application.Features.Assets;

public record CreateAssetCommand(CreateAssetRequest Body) : IRequest<AssetDto>;

public class CreateAssetHandler(IAssetRepository repo) : IRequestHandler<CreateAssetCommand, AssetDto>
{
    public async Task<AssetDto> Handle(CreateAssetCommand request, CancellationToken ct)
    {
        var body = request.Body;

        var type = Enum.Parse<AssetType>(body.Type, ignoreCase: true);
        var status = string.IsNullOrEmpty(body.Status)
            ? AssetStatus.Active
            : Enum.Parse<AssetStatus>(body.Status, ignoreCase: true);
        var location = Location.Create(body.Location.Latitude, body.Location.Longitude);

        var asset = Asset.Create(body.Name, type, status, location);
        await repo.CreateAsync(asset);

        return asset.ToDto();
    }
}
