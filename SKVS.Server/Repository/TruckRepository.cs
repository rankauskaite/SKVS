using Microsoft.EntityFrameworkCore;
using SKVS.Server.Data;
using SKVS.Server.Models;

namespace SKVS.Server.Repository
{
    public class TruckRepository : ITruckRepository
    {
        private readonly ApplicationDbContext _context;

        public TruckRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Truck>> GetAllAsync() =>
            await _context.Trucks
                .Include(t => t.Owner)
                .Include(t => t.Vehicle)
                .ToListAsync();

        public async Task<Truck?> GetByPlateAsync(string plateNumber) =>
            await _context.Trucks
                .Include(t => t.Owner)
                .Include(t => t.Vehicle)
                .FirstOrDefaultAsync(t => t.PlateNumber == plateNumber);

        public async Task AddAsync(Truck truck)
        {
            // Pridėti Vehicle pirmiausia, nes Truck FK į jį
            if (!_context.Vehicles.Any(v => v.PlateNumber == truck.PlateNumber))
            {
                _context.Vehicles.Add(new Vehicle { PlateNumber = truck.PlateNumber });
            }

            _context.Trucks.Add(truck);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Truck truck)
        {
            _context.Trucks.Update(truck);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(string plateNumber)
        {
            var truck = await _context.Trucks.FindAsync(plateNumber);
            if (truck != null)
            {
                _context.Trucks.Remove(truck);

                var vehicle = await _context.Vehicles.FindAsync(plateNumber);
                if (vehicle != null)
                {
                    _context.Vehicles.Remove(vehicle);
                }

                await _context.SaveChangesAsync();
            }
        }
    }
}
