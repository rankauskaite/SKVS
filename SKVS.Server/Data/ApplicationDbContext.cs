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

        }
    }
}
