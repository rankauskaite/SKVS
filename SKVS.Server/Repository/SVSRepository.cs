using Microsoft.EntityFrameworkCore;
using SKVS.Server.Data;
using SKVS.Server.Models;

namespace SKVS.Server.Repository
{
    public class SVSRepository : ISVSRepository
    {
        private readonly ApplicationDbContext _context;

        public SVSRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SVS>> GetAllAsync()
        {
            return await _context.SVS.ToListAsync();
        }

        public async Task<SVS?> GetByIdAsync(int id)
        {
            return await _context.SVS.FindAsync(id);
        }

        public async Task AddAsync(SVS svs)
        {
            _context.SVS.Add(svs);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(SVS svs)
        {
            _context.SVS.Update(svs);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var svs = await _context.SVS.FindAsync(id);
            if (svs != null)
            {
                _context.SVS.Remove(svs);
                await _context.SaveChangesAsync();
            }
        }
    }
}
