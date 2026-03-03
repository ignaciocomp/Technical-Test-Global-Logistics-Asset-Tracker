using GLAT.Application.Common.Exceptions;
using GLAT.Application.DTOs;
using GLAT.Application.Mapping;
using GLAT.Domain.Interfaces;
using MediatR;

namespace GLAT.Application.Features.Telemetry;

public record GetTelemetryQuery(Guid AssetId, int Page, int PageSize)
    : IRequest<PaginatedResponse<TelemetryLogDto>>;

public class GetTelemetryHandler(
    IAssetRepository assetRepo,
    ITelemetryRepository telemetryRepo) : IRequestHandler<GetTelemetryQuery, PaginatedResponse<TelemetryLogDto>>
{
    public async Task<PaginatedResponse<TelemetryLogDto>> Handle(GetTelemetryQuery request, CancellationToken ct)
    {
        if (!await assetRepo.ExistsAsync(request.AssetId))
            throw new NotFoundException("Asset", request.AssetId);

        var (items, totalCount) = await telemetryRepo.GetByAssetIdAsync(request.AssetId, request.Page, request.PageSize);
        var dtos = items.Select(t => t.ToDto());
        return PaginatedResponse<TelemetryLogDto>.From(dtos, totalCount, request.Page, request.PageSize);
    }
}
