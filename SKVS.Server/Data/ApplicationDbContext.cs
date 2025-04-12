using Microsoft.EntityFrameworkCore;
using SKVS.Server.Models;

namespace SKVS.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Driver> Drivers { get; set; }
        public DbSet<TransportationOrder> TransportationOrders { get; set; } 
        public DbSet<TruckingCompanyManager> TruckingCompanyManagers { get; set; } 
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Truck> Trucks { get; set; } 
        public DbSet<WarehouseOrder> WarehouseOrders { get; set; } 
        public DbSet<SVS> SVS { get; set; }

        public DbSet<AvailableDeliveryTime> AvailableDeliveryTimes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<TransportationOrder>()
                .Property(o => o.State)
                .HasConversion<string>();

            modelBuilder.Entity<TruckingCompanyManager>()
                .HasKey(m => m.UserId);

            modelBuilder.Entity<TruckingCompanyManager>()
                .HasOne(m => m.User)
                .WithOne(u => u.Manager)
                .HasForeignKey<TruckingCompanyManager>(m => m.UserId); 
            
            modelBuilder.Entity<Truck>()
                .HasOne(t => t.Vehicle)
                .WithOne()
                .HasForeignKey<Truck>(t => t.PlateNumber);

            modelBuilder.Entity<Truck>()
                .HasOne(t => t.Owner)
                .WithMany(o => o.Trucks)
                .HasForeignKey(t => t.OwnerId);

            modelBuilder.Entity<TransportationOrder>()
                .HasOne(o => o.DeliveryTimeSlot)
                .WithMany()
                .HasForeignKey(o => o.DeliveryTimeId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
