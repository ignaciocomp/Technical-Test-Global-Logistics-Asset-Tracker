using System.Runtime.InteropServices;
using GLAT.Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace GLAT.Infrastructure.Native;

public class HealthScoreService(ILogger<HealthScoreService> logger) : IHealthScoreService
{
    [DllImport("health_score", CallingConvention = CallingConvention.Cdecl)]
    private static extern double calculate_health_score(double temperature, double pressure, double vibration);

    public double CalculateHealthScore(double temperature, double pressure, double vibration)
    {
        try
        {
            var score = calculate_health_score(temperature, pressure, vibration);
            return Math.Clamp(score, 0, 100);
        }
        catch (DllNotFoundException)
        {
            logger.LogWarning("Native health_score library not found, using managed fallback");
            return ManagedFallback(temperature, pressure, vibration);
        }
    }

    private static double ManagedFallback(double temperature, double pressure, double vibration)
    {
        var score = 100.0;

        var tempDelta = Math.Abs(temperature - 40);
        score -= tempDelta * 0.5;

        var pressureDelta = Math.Abs(pressure - 100);
        score -= pressureDelta * 0.3;

        score -= vibration * 0.4;

        return Math.Clamp(score, 0, 100);
    }
}
