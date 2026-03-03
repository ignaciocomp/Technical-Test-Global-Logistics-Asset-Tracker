using System.Text.Json;
using FluentValidation;
using GLAT.Application.Common.Exceptions;

namespace GLAT.API.Middleware;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (NotFoundException ex)
        {
            logger.LogWarning(ex, "Resource not found");
            await WriteResponse(context, StatusCodes.Status404NotFound, ex.Message);
        }
        catch (ValidationException ex)
        {
            logger.LogWarning(ex, "Validation failed");
            var details = ex.Errors.Select(e => e.ErrorMessage).ToList();
            await WriteResponse(context, StatusCodes.Status400BadRequest, "Validation failed.", details);
        }
        catch (ArgumentException ex)
        {
            logger.LogWarning(ex, "Bad request");
            await WriteResponse(context, StatusCodes.Status400BadRequest, ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception");
            await WriteResponse(context, StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
        }
    }

    private static async Task WriteResponse(HttpContext context, int statusCode, string message, List<string>? details = null)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";
        var body = new { message, details };
        await context.Response.WriteAsync(JsonSerializer.Serialize(body, JsonOptions));
    }
}
