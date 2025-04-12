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
                .Where(x => x.Date == date)
                .Where(x => x.IsTaken == false)
                .ToListAsync();
        }

        public Task<AvailableDeliveryTime?> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task AddAsync(AvailableDeliveryTime availableDeliveryTime)
        {
            throw new NotImplementedException();
        }

        public async Task UpdateAsync(AvailableDeliveryTime availableDeliveryTime)
        {
            _context.AvailableDeliveryTimes.Update(availableDeliveryTime);
            await _context.SaveChangesAsync();
        }

        public Task DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
