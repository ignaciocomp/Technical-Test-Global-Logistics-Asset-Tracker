namespace GLAT.Application.Features.Telemetry;

public static class AlertEvaluator
{
    public static List<string> Evaluate(double temperature, double pressure, double vibration, double healthScore)
    {
        var alerts = new List<string>();

        if (temperature > 80) alerts.Add("High temperature");
        if (temperature < -20) alerts.Add("Low temperature");
        if (pressure > 150) alerts.Add("High pressure");
        if (pressure < 20) alerts.Add("Low pressure");
        if (vibration > 70) alerts.Add("High vibration");
        if (healthScore < 50) alerts.Add("Health score critical");

        return alerts;
    }
}
