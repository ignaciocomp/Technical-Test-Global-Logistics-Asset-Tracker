namespace GLAT.Application.DTOs;

public record AssetDto(
    Guid Id,
    string Name,
    string Type,
    string Status,
    LocationDto Location,
    DateTimeOffset LastUpdated);
