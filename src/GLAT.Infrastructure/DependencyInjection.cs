using GLAT.Application.Interfaces;
using GLAT.Domain.Interfaces;
using GLAT.Infrastructure.Native;
using GLAT.Infrastructure.Persistence;
using GLAT.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace GLAT.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IAssetRepository, AssetRepository>();
        services.AddScoped<ITelemetryRepository, TelemetryRepository>();
        services.AddSingleton<IHealthScoreService, HealthScoreService>();

        return services;
    }
}
