using GLAT.Domain.Entities;
using GLAT.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace GLAT.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Asset> Assets => Set<Asset>();
    public DbSet<TelemetryLog> TelemetryLogs => Set<TelemetryLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Asset>(entity =>
        {
            entity.ToTable("Assets");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Type).HasConversion<string>().HasMaxLength(20);
            entity.Property(e => e.Status).HasConversion<string>().HasMaxLength(20);

            entity.OwnsOne(e => e.Location, loc =>
            {
                loc.Property(l => l.Latitude).HasColumnName("Location_Latitude");
                loc.Property(l => l.Longitude).HasColumnName("Location_Longitude");
            });

            entity.Ignore(e => e.TelemetryLogs);
        });

        modelBuilder.Entity<TelemetryLog>(entity =>
        {
            entity.ToTable("TelemetryLogs");
            entity.HasKey(e => e.Id);

            entity.HasOne<Asset>()
                .WithMany()
                .HasForeignKey(e => e.AssetId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.OwnsOne(e => e.Sensors, s =>
            {
                s.Property(r => r.Temperature).HasColumnName("Sensor_Temperature");
                s.Property(r => r.Pressure).HasColumnName("Sensor_Pressure");
                s.Property(r => r.Vibration).HasColumnName("Sensor_Vibration");
            });

            entity.HasIndex(e => e.AssetId);
            entity.HasIndex(e => e.Timestamp).IsDescending();
        });
    }
}
