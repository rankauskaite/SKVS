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

        // 20. initiateTransportationOrdersView() ir 21. show()
        [HttpGet]
        public async Task<IActionResult> initiateTransportationOrdersView([FromQuery] int? userId)
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

                return Ok(orders); // 21. show()
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Klaida gaunant užsakymus: " + ex.Message);
                return StatusCode(500, "Serverio klaida: " + ex.Message); // 22. error()
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

        // 15. checkFormedTransportationOrder()
        private IActionResult checkFormedTransportationOrder(TransportationOrderInputModel input)
        {
            if (string.IsNullOrEmpty(input.Address))
                return BadRequest("Adresas yra privalomas.");
            if (input.DeliveryTime == default)
                return BadRequest("Pristatymo laikas yra privalomas.");
            if (input.AssignedDriverId == null)
                return BadRequest("Vairuotojas yra privalomas.");
            if (string.IsNullOrEmpty(input.TruckPlateNumber))
                return BadRequest("Sunkvežimis yra privalomas.");
            if (!input.WarehouseOrderIds.Any())
                return BadRequest("Pasirinkite bent vieną sandėlio užsakymą.");

            return null;
        }

        // 16. createTransportationOrder() ir 17. transportationOrderCreated()
        [HttpPost]
        public async Task<IActionResult> createTransportationOrder([FromBody] TransportationOrderInputModel input)
        {
            try
            {
                // 15. Tikriname formą
                var validationResult = checkFormedTransportationOrder(input);
                if (validationResult != null)
                    return validationResult;

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
                    AssignedDriverId = input.AssignedDriverId,
                    TruckPlateNumber = input.TruckPlateNumber
                };

                _context.TransportationOrders.Add(order);
                await _context.SaveChangesAsync();

                var warehouseOrders = await _context.WarehouseOrders
                    .Where(w => input.WarehouseOrderIds.Contains(w.Id))
                    .ToListAsync();

                if (!warehouseOrders.Any())
                {
                    return BadRequest("Nerasta pasirinktų sandėlio užsakymų.");
                }

                foreach (var wo in warehouseOrders)
                {
                    wo.TransportationOrderID = order.OrderId;
                    _context.Entry(wo).State = EntityState.Modified;
                }

                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(Get), new { id = order.OrderId }, order); // 17. transportationOrderCreated()
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Klaida kuriant užsakymą: " + ex.Message);
                return StatusCode(500, "Serverio klaida kuriant užsakymą: " + ex.Message); // 22. error()
            }
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