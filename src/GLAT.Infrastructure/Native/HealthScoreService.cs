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

        if (temperature < 15)
            score -= (15 - temperature) * 1.5;
        else if (temperature > 35)
            score -= (temperature - 35) * 1.5;

        if (pressure < 50)
            score -= (50 - pressure) * 1.0;
        else if (pressure > 120)
            score -= (pressure - 120) * 1.0;

        if (vibration > 30)
            score -= (vibration - 30) * 2.0;

        return Math.Clamp(score, 0, 100);
    }
}
