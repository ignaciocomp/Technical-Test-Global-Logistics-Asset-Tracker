using GLAT.Application.DTOs;
using GLAT.Application.Features.Assets;
using GLAT.Application.Features.Telemetry;
using GLAT.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GLAT.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssetsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<AssetDto>>> List(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] AssetType? type = null,
        [FromQuery] AssetStatus? status = null)
    {
        var result = await mediator.Send(new GetAssetsQuery(page, pageSize, type, status));
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<AssetDto>> Create([FromBody] CreateAssetRequest request)
    {
        var result = await mediator.Send(new CreateAssetCommand(request));
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AssetDto>> GetById(Guid id)
    {
        var result = await mediator.Send(new GetAssetByIdQuery(id));
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<AssetDto>> Update(Guid id, [FromBody] UpdateAssetRequest request)
    {
        var result = await mediator.Send(new UpdateAssetCommand(id, request));
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await mediator.Send(new DeleteAssetCommand(id));
        return NoContent();
    }

    [HttpPost("{id:guid}/telemetry")]
    public async Task<ActionResult<SensorStatusDto>> AddTelemetry(Guid id, [FromBody] CreateTelemetryRequest request)
    {
        var result = await mediator.Send(new AddTelemetryCommand(id, request));
        return Created($"/api/assets/{id}/telemetry", result);
    }

    [HttpGet("{id:guid}/telemetry")]
    public async Task<ActionResult<PaginatedResponse<TelemetryLogDto>>> GetTelemetry(
        Guid id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await mediator.Send(new GetTelemetryQuery(id, page, pageSize));
        return Ok(result);
    }

    [HttpGet("{id:guid}/status")]
    public async Task<ActionResult<SensorStatusDto>> GetStatus(Guid id)
    {
        var result = await mediator.Send(new GetAssetStatusQuery(id));
        return Ok(result);
    }
}
