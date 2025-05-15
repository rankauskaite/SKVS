using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SKVS.Server.Data;
using SKVS.Server.Enums;
using SKVS.Server.Models;
using SKVS.Server.Repository;

namespace SKVS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransportationOrderFormController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IDriverRepository _repositoryDriver;
        private readonly ITruckRepository _repositoryTruck;
        private readonly IWarehouseOrderRepository _repositoryWarehouseOrder;
        private readonly ITransportationOrderRepository _repositoryTransportationOrders;

        public TransportationOrderFormController(ApplicationDbContext context, IDriverRepository repositoryDriver, ITruckRepository repositoryTruck,
        IWarehouseOrderRepository repositoryWarehouseOrder, ITransportationOrderRepository repositoryTransportationOrders)
        {
            _context = context;
            _repositoryDriver = repositoryDriver;
            _repositoryTruck = repositoryTruck;
            _repositoryWarehouseOrder = repositoryWarehouseOrder;
            _repositoryTransportationOrders = repositoryTransportationOrders;
        }

        [HttpGet]
        public async Task<IActionResult> retrieveForm()
        {
            try
            {
                var drivers = await _repositoryDriver.GetDrivers();
                var trucks = await _repositoryTruck.GetAllAsync();
                var warehouseOrders = await _repositoryWarehouseOrder.GetUnassignedAsync();

                return Ok(new
                {
                    Drivers = drivers,
                    Trucks = trucks,
                    WarehouseOrders = warehouseOrders
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Klaida gaunant užsakymus: " + ex.Message);
                return StatusCode(500, "Serverio klaida: " + ex.Message);
            }
        }

        private IActionResult? checkFormedTransportationOrder(TransportationOrderInputModel input)
        {
            if (string.IsNullOrEmpty(input.Address))
                return BadRequest("Adresas yra privalomas.");
            if (string.IsNullOrEmpty(input.Description))
                return BadRequest("Aprašymas yra privalomas.");
            if (input.DeliveryTime == DateTime.Parse("1000-01-01T00:00:00Z"))
                return BadRequest("Pristatymo laikas yra privalomas.");
            if (input.AssignedDriverId == null)
                return BadRequest("Vairuotojas yra privalomas.");
            if (string.IsNullOrEmpty(input.TruckPlateNumber))
                return BadRequest("Sunkvežimis yra privalomas.");
            if (!input.WarehouseOrderIds.Any())
                return BadRequest("Pasirinkite bent vieną sandėlio užsakymą.");

            return null; // Formos tikrinimas sėkmingas
        }

        [HttpPost]
        public async Task<IActionResult> createTransportationOrder([FromBody] TransportationOrderInputModel input)
        {
            try
            {
                var validationResult = checkFormedTransportationOrder(input);
                if (validationResult != null)
                    return validationResult;

                var order = new TransportationOrder
                {
                    Description = input.Description,
                    Address = input.Address,
                    DeliveryTime = input.DeliveryTime.Date,
                    Ramp = input.Ramp,
                    State = input.State,
                    IsCancelled = input.IsCancelled,
                    IsCompleted = input.IsCompleted,
                    IsOnTheWay = input.IsOnTheWay,
                    CreatedById = input.CreatedById,
                    AssignedDriverId = input.AssignedDriverId,
                    TruckPlateNumber = input.TruckPlateNumber
                };

                await _repositoryTransportationOrders.AddAsync(order);

                var warehouseOrders = await _repositoryWarehouseOrder.GetAllSelectedAsync(input.WarehouseOrderIds);

                if (!warehouseOrders.Any())
                {
                    return BadRequest("Nerasta pasirinktų sandėlio užsakymų.");
                }

                foreach (var wo in warehouseOrders)
                {
                    wo.TransportationOrderID = order.OrderId;
                    await _repositoryWarehouseOrder.UpdateAsync(wo);
                }

                return CreatedAtAction(nameof(Get), new { id = order.OrderId }, order);
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Klaida kuriant užsakymą: " + ex.Message);
                return StatusCode(500, "Serverio klaida kuriant užsakymą: " + ex.Message); // 22. error()
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