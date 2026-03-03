namespace GLAT.Domain.Entities;

public class Location
{
    public double Latitude { get; private set; }
    public double Longitude { get; private set; }

    private Location() { }

    public static Location Create(double latitude, double longitude)
    {
        if (latitude is < -90 or > 90)
            throw new ArgumentOutOfRangeException(nameof(latitude));
        if (longitude is < -180 or > 180)
            throw new ArgumentOutOfRangeException(nameof(longitude));

        return new Location { Latitude = latitude, Longitude = longitude };
    }
}
