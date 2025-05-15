using Microsoft.EntityFrameworkCore;
using SKVS.Server.Controllers;
using SKVS.Server.Data;
using SKVS.Server.Enums;
using SKVS.Server.Models;
using static SKVS.Server.Controllers.DeliveryTimeManagementController;

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
                .Include(t => t.WarehouseOrders)
                .Include(t => t.CreatedBy)
                .Include(t => t.AssignedDriver)
                .Include(t => t.Truck)
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



        public async Task UpdateOrderDeliveryInformation(int id, DeliveryTimeUpdateModel deliveryTime)
        {
            var order = await _context.TransportationOrders
                                    .FirstOrDefaultAsync(o => o.OrderId == id);
            if (order != null)
            {
                order.DeliveryTimeId = deliveryTime.DeliveryTimeId;
                order.DeliveryTime = deliveryTime.DeliveryTime;
                order.Ramp = deliveryTime.Ramp;
                order.State = OrderState.Scheduled;
                await _context.SaveChangesAsync();
            }
        }
        public async Task CancelOrderDelivery(int id)
        {
            var order = await _context.TransportationOrders.FindAsync(id);
            
            if (order != null)
            {
                DateTime o = order.DeliveryTime.Date;
                order.DeliveryTime = o;
                order.Ramp = null;
                order.State = OrderState.Formed;
                _context.TransportationOrders.Update(order);
                await _context.SaveChangesAsync();
            }
        }
    }
}
