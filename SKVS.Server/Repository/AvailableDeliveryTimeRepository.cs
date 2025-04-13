using Microsoft.EntityFrameworkCore;
using SKVS.Server.Data;
using SKVS.Server.Models;

namespace SKVS.Server.Repository
{
    public class AvailableDeliveryTimeRepository : IAvailableDeliveryTimeRepository
    {
        private readonly ApplicationDbContext _context;

        public AvailableDeliveryTimeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AvailableDeliveryTime>> GetAvailableDeliveryTimes(DateTime date)
        {
            return await _context.AvailableDeliveryTimes
                .Where(x => x.Date.Date == date.Date)
                .Where(x => x.IsTaken == false)
                .ToListAsync();
        }

        public async Task<AvailableDeliveryTime?> GetByIdAsync(int id)
        {
            return await _context.AvailableDeliveryTimes.FindAsync(id);
        }

        public Task AddAsync(AvailableDeliveryTime availableDeliveryTime)
        {
            throw new NotImplementedException();
        }

        public async Task UpdateAsync(AvailableDeliveryTime availableDeliveryTime)
        {
            // Užtikrinti, kad naujas pakeitimas būtų įrašytas tik po ankstesnio
            _context.AvailableDeliveryTimes.Update(availableDeliveryTime);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateTimeAsync(int id, bool isTaken)
        {
            var availableDeliveryTime = await GetByIdAsync(id);
            if (availableDeliveryTime == null) return;

            // Pakeisti statusą ir išsaugoti tik vieną kartą
            availableDeliveryTime.IsTaken = isTaken;
            _context.AvailableDeliveryTimes.Update(availableDeliveryTime);
            await _context.SaveChangesAsync(); // Užtikrina, kad operacijos vyksta viena po kitos
        }

        public Task DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<AvailableDeliveryTime?> GetByTimeAndRamp(DateTime time, int ramp)
        {
            return await _context.AvailableDeliveryTimes
                .FirstOrDefaultAsync(x => x.Date == time && x.Ramp == ramp);
        }
    }
}
