namespace GLAT.Application.Interfaces;

public interface IHealthScoreService
{
    double CalculateHealthScore(double temperature, double pressure, double vibration);
}
