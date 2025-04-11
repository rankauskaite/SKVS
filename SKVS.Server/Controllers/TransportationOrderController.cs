using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SKVS.Server.Data;
using SKVS.Server.Enums;
using SKVS.Server.Models;

namespace SKVS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransportationOrderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TransportationOrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _context.TransportationOrders
                .Include(t => t.WarehouseOrders)
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var order = await _context.TransportationOrders
                .Include(t => t.WarehouseOrders)
                .FirstOrDefaultAsync(t => t.OrderId == id);

            return order == null ? NotFound() : Ok(order);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TransportationOrderInputModel input)
        {
            // 1. Sukuriam order objektą
            var order = new TransportationOrder
            {
                Description = input.Description,
                Address = input.Address,
                DeliveryTime = input.DeliveryTime,
                Ramp = input.Ramp,
                State = input.State,
                IsCancelled = input.IsCancelled,
                IsCompleted = input.IsCompleted,
                IsOnTheWay = input.IsOnTheWay,
                CreatedById = input.CreatedById,
                TruckPlateNumber = input.TruckPlateNumber
            };

            // 2. Įrašom orderį, kad turėtume OrderId
            _context.TransportationOrders.Add(order);
            await _context.SaveChangesAsync();

            // 3. Užkraunam pasirinktus warehouse orderius ir priskiriam
            var warehouseOrders = await _context.WarehouseOrders
                .Where(w => input.WarehouseOrderIds.Contains(w.Id))
                .ToListAsync();

            foreach (var wo in warehouseOrders)
            {
                wo.TransportationOrderID = order.OrderId;
                _context.Entry(wo).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = order.OrderId }, order);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TransportationOrderInputModel input)
        {
            var existing = await _context.TransportationOrders
                .Include(t => t.WarehouseOrders)
                .FirstOrDefaultAsync(t => t.OrderId == id);

            if (existing == null)
                return NotFound();

            // Atnaujinti pagrindinius laukus
            existing.Description = input.Description;
            existing.Address = input.Address;
            existing.DeliveryTime = input.DeliveryTime;
            existing.Ramp = input.Ramp;
            existing.State = input.State;
            existing.IsCancelled = input.IsCancelled;
            existing.IsCompleted = input.IsCompleted;
            existing.IsOnTheWay = input.IsOnTheWay;
            existing.CreatedById = input.CreatedById;
            existing.TruckPlateNumber = input.TruckPlateNumber;

            // 1. Nuimam senus ryšius
            foreach (var old in existing.WarehouseOrders)
            {
                old.TransportationOrderID = null;
                _context.Entry(old).State = EntityState.Modified;
            }

            // 2. Priskiriam naujus
            var newWarehouseOrders = await _context.WarehouseOrders
                .Where(w => input.WarehouseOrderIds.Contains(w.Id))
                .ToListAsync();

            foreach (var wo in newWarehouseOrders)
            {
                wo.TransportationOrderID = id;
                _context.Entry(wo).State = EntityState.Modified;
            }

            existing.WarehouseOrders = newWarehouseOrders;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _context.TransportationOrders
                .Include(o => o.WarehouseOrders)
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (existing == null)
                return NotFound();

            // Atlaisvinam warehouse orderius
            foreach (var wo in existing.WarehouseOrders)
            {
                wo.TransportationOrderID = null;
                _context.Entry(wo).State = EntityState.Modified;
            }

            _context.TransportationOrders.Remove(existing);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ Vidinė klasė tik Create / Update POST requestams
        public class TransportationOrderInputModel
        {
            public string Description { get; set; } = string.Empty;
            public string Address { get; set; } = string.Empty;
            public DateTime DeliveryTime { get; set; }
            public int Ramp { get; set; }
            public bool IsCancelled { get; set; } = false;
            public bool IsCompleted { get; set; } = false;
            public bool IsOnTheWay { get; set; } = false;
            public int CreatedById { get; set; }
            public string TruckPlateNumber { get; set; } = string.Empty;
            public OrderState State { get; set; }

            public List<int> WarehouseOrderIds { get; set; } = new();
        }
    }
}
