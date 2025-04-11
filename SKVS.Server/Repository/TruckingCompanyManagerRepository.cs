using Microsoft.EntityFrameworkCore;
using SKVS.Server.Data;
using SKVS.Server.Models;

namespace SKVS.Server.Repository
{
    public class TruckingCompanyManagerRepository : ITruckingCompanyManagerRepository
    {
        private readonly ApplicationDbContext _context;

        public TruckingCompanyManagerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TruckingCompanyManager>> GetAllAsync() =>
            await _context.TruckingCompanyManagers.Include(m => m.User).ToListAsync();

        public async Task<TruckingCompanyManager?> GetByUserIdAsync(int userId) =>
            await _context.TruckingCompanyManagers.Include(m => m.User)
                .FirstOrDefaultAsync(m => m.UserId == userId);

        public async Task AddAsync(TruckingCompanyManager manager)
        {
            _context.TruckingCompanyManagers.Add(manager);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(TruckingCompanyManager manager)
        {
            _context.TruckingCompanyManagers.Update(manager);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int userId)
        {
            var manager = await _context.TruckingCompanyManagers.FindAsync(userId);
            if (manager != null)
            {
                _context.TruckingCompanyManagers.Remove(manager);
                await _context.SaveChangesAsync();
            }
        }
    }
}
