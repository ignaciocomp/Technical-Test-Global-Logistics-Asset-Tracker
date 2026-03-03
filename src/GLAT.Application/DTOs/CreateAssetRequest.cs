namespace GLAT.Application.DTOs;

public record CreateAssetRequest(
    string Name,
    string Type,
    string? Status,
    LocationDto Location);
