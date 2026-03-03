namespace GLAT.Application.DTOs;

public record UpdateAssetRequest(
    string? Name,
    string? Status,
    LocationDto? Location);
