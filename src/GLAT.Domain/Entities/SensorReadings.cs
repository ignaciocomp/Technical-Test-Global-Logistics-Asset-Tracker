namespace GLAT.Domain.Entities;

public class SensorReadings
{
    public double Temperature { get; private set; }
    public double Pressure { get; private set; }
    public double Vibration { get; private set; }

    private SensorReadings() { }

    public static SensorReadings Create(double temperature, double pressure, double vibration)
    {
        return new SensorReadings
        {
            Temperature = temperature,
            Pressure = pressure,
            Vibration = vibration
        };
    }
}
