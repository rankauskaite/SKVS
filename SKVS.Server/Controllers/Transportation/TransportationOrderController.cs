using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SKVS.Server.Data;
using SKVS.Server.Enums;
using SKVS.Server.Models;
using System.Text.Json;

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
        public async Task<IActionResult> InitializeTransportationOrders([FromQuery] int? userId)
        {
            try
            {
                var query = _context.TransportationOrders.AsQueryable();

                if (userId.HasValue)
                {
                    query = query.Where(o => o.AssignedDriverId == userId.Value);
                }

                var orders = await query
                    .Include(t => t.WarehouseOrders)
                    .Include(t => t.CreatedBy)
                    .Include(t => t.AssignedDriver)
                    .Include(t => t.Truck)
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Klaida gaunant užsakymus: " + ex.Message);
                return StatusCode(500, "Serverio klaida: " + ex.Message);
            }
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
            Console.WriteLine($"Gautas JSON: {JsonSerializer.Serialize(input)}");
            Console.WriteLine($"Gauta input.Ramp reikšmė: {input.Ramp ?? null}");

            if (input.Ramp.HasValue && input.Ramp <= 0)
            {
                return BadRequest("Rampa turi būti teigiamas skaičius.");
            }

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

            Console.WriteLine($"Priskirta order.Ramp reikšmė: {order.Ramp ?? null}");

            _context.TransportationOrders.Add(order);
            await _context.SaveChangesAsync();

            Console.WriteLine($"Išsaugota DB order.Ramp reikšmė: {order.Ramp ?? null}");

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

            foreach (var old in existing.WarehouseOrders)
            {
                old.TransportationOrderID = null;
                _context.Entry(old).State = EntityState.Modified;
            }

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

            foreach (var wo in existing.WarehouseOrders)
            {
                wo.TransportationOrderID = null;
                _context.Entry(wo).State = EntityState.Modified;
            }

            _context.TransportationOrders.Remove(existing);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}/driver")]
        public async Task<IActionResult> AssignDriver(int id, [FromBody] AssignDriverRequest model)
        {
            var order = await _context.TransportationOrders.FindAsync(id);
            if (order == null) return NotFound();

            var driver = await _context.Drivers.FindAsync(model.DriverId);
            if (driver == null) return BadRequest("Vairuotojas nerastas");

            order.AssignedDriverId = model.DriverId;
            _context.Entry(order).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        public class AssignDriverRequest
        {
            public int DriverId { get; set; }
        }

        public class TransportationOrderInputModel
        {
            public string Description { get; set; } = string.Empty;
            public string Address { get; set; } = string.Empty;
            public DateTime DeliveryTime { get; set; }
            public int? Ramp { get; set; }
            public bool IsCancelled { get; set; } = false;
            public bool IsCompleted { get; set; } = false;
            public bool IsOnTheWay { get; set; } = false;
            public int CreatedById { get; set; }
            public int? AssignedDriverId { get; set; }
            public string? TruckPlateNumber { get; set; }
            public OrderState State { get; set; }
            public List<int> WarehouseOrderIds { get; set; } = new();
        }
    }
}