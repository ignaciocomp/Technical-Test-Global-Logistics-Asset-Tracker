#include "health_score.h"

static double clamp(double value, double min, double max)
{
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

double calculate_health_score(double temperature, double pressure, double vibration)
{
    double score = 100.0;

    /* Temperature: ideal range 15-35. Deduct 1.5 per degree outside. */
    if (temperature < 15.0)
        score -= (15.0 - temperature) * 1.5;
    else if (temperature > 35.0)
        score -= (temperature - 35.0) * 1.5;

    /* Pressure: ideal range 50-120. Deduct 1.0 per unit outside. */
    if (pressure < 50.0)
        score -= (50.0 - pressure) * 1.0;
    else if (pressure > 120.0)
        score -= (pressure - 120.0) * 1.0;

    /* Vibration: anything above 30 is bad. Deduct 2.0 per unit above 30. */
    if (vibration > 30.0)
        score -= (vibration - 30.0) * 2.0;

    return clamp(score, 0.0, 100.0);
}
