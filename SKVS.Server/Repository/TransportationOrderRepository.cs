using Microsoft.EntityFrameworkCore;
using SKVS.Server.Data;
using SKVS.Server.Models;

namespace SKVS.Server.Repository
{
    public class TransportationOrderRepository : ITransportationOrderRepository
    {
        private readonly ApplicationDbContext _context;

        public TransportationOrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TransportationOrder>> GetAllAsync() =>
            await _context.TransportationOrders
                .Include(o => o.Truck)
                .Include(o => o.CreatedBy)
                .ToListAsync();

        public async Task<TransportationOrder?> GetByIdAsync(int id) =>
            await _context.TransportationOrders
                .Include(o => o.Truck)
                .Include(o => o.CreatedBy)
                .FirstOrDefaultAsync(o => o.OrderId == id);

        public async Task AddAsync(TransportationOrder order)
        {
            _context.TransportationOrders.Add(order);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(TransportationOrder order)
        {
            _context.TransportationOrders.Update(order);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var order = await _context.TransportationOrders.FindAsync(id);
            if (order != null)
            {
                _context.TransportationOrders.Remove(order);
                await _context.SaveChangesAsync();
            }
        }
    }
}
