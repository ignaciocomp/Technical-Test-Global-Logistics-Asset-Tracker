using GLAT.Application.Common.Exceptions;
using GLAT.Domain.Interfaces;
using MediatR;

namespace GLAT.Application.Features.Assets;

public record DeleteAssetCommand(Guid Id) : IRequest;

public class DeleteAssetHandler(IAssetRepository repo) : IRequestHandler<DeleteAssetCommand>
{
    public async Task Handle(DeleteAssetCommand request, CancellationToken ct)
    {
        if (!await repo.ExistsAsync(request.Id))
            throw new NotFoundException("Asset", request.Id);

        await repo.DeleteAsync(request.Id);
    }
}
