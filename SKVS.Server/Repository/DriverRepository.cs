using Microsoft.EntityFrameworkCore;
using SKVS.Server.Data;
using SKVS.Server.Models;

namespace SKVS.Server.Repository
{
    public class DriverRepository : IDriverRepository
    {
        private readonly ApplicationDbContext _context;

        public DriverRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Driver>> GetAllAsync() =>
            await _context.Drivers.Include(d => d.User).ToListAsync();

        public async Task<Driver?> GetByUserIdAsync(int userId) =>
            await _context.Drivers.Include(d => d.User)
                .FirstOrDefaultAsync(d => d.UserId == userId);

        public async Task AddAsync(Driver driver)
        {
            _context.Drivers.Add(driver);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Driver driver)
        {
            _context.Drivers.Update(driver);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int userId)
        {
            var driver = await _context.Drivers.FindAsync(userId);
            if (driver != null)
            {
                _context.Drivers.Remove(driver);
                await _context.SaveChangesAsync();
            }
        }
    }
}
