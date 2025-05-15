using Microsoft.EntityFrameworkCore;
using SKVS.Server.Data;
using SKVS.Server.Models;

namespace SKVS.Server.Repository
{
    public class WarehouseOrderRepository : IWarehouseOrderRepository
    {
        private readonly ApplicationDbContext _context;

        // seka dabartini uzsakyma
        private WarehouseOrder? _currentOrder;

        public WarehouseOrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<WarehouseOrder>> GetAllAsync()
        {
            return await _context.WarehouseOrders.Include(x => x.Client).ToListAsync();
        }

        public async Task<IEnumerable<WarehouseOrder>> GetAllSelectedAsync(List<int> orderIds)
        {
            return await _context.WarehouseOrders
                .Where(x => orderIds.Contains(x.Id))
                .ToListAsync();
        }

        public async Task<WarehouseOrder?> GetByIdAsync(int id)
        {
            var order = await _context.WarehouseOrders.Include(x => x.Client).FirstOrDefaultAsync(x => x.Id == id);
            if (order != null)
            {
                _currentOrder = order;
            }
            return order;
        }

        public async Task AddAsync(WarehouseOrder order)
        {
            _context.WarehouseOrders.Add(order);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(WarehouseOrder order)
        {
            _context.WarehouseOrders.Update(order);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var order = await _context.WarehouseOrders.FindAsync(id);
            if (order != null)
            {
                _context.WarehouseOrders.Remove(order);
                await _context.SaveChangesAsync();
            }
        } 
        public async Task<IEnumerable<WarehouseOrder>> GetUnassignedAsync()
        {
            return await _context.WarehouseOrders
                .Where(wo => wo.TransportationOrderID  == null)
                .ToListAsync();
        }
        public WarehouseOrder? GetCurrentOrder()
        {
            return _currentOrder;
        }
    }
}
