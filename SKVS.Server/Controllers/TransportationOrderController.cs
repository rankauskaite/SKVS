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
            try
            {
                var orders = await _context.TransportationOrders
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

        [HttpPut("{orderId}/setDeliveryTime")]
        public async Task<IActionResult> SetDeliveryTime(int orderId, [FromBody] DeliveryTimeUpdateModel model)
        {
            try
            {
                // 1. Gauti užsakymą
                var order = await _context.TransportationOrders.FindAsync(orderId);
                if (order == null)
                {
                    return NotFound("❌ Užsakymas nerastas.");
                }

                // 2. Patikrinti ar toks pristatymo laikas egzistuoja (checkSelectedTime)
                var deliveryTime = await _context.AvailableDeliveryTimes.FindAsync(model.DeliveryTimeId);
                if (deliveryTime == null)
                {
                    return BadRequest("⚠️ Pasirinktas laikas neegzistuoja.");
                }

                // 3. Atnaujinti užsakymą (updateOrderDeliveryInformation)
                order.DeliveryTimeId = model.DeliveryTimeId;

                // 4. Išsaugoti (delivery information saved)
                await _context.SaveChangesAsync();

                // 5. Sukurti žinutę (formMessage) – čia paprasta sėkmės žinutė
                var successMessage = $"✅ Pristatymo laikas priskirtas: {deliveryTime.Date.ToShortDateString()} {deliveryTime.Time}";

                // 6. Inicijuoti užsakymų sąrašo atnaujinimą (initializeTransportationOrders)
                var updatedOrders = await _context.TransportationOrders
                    .Include(t => t.WarehouseOrders)
                    .Include(t => t.CreatedBy)
                    .Include(t => t.AssignedDriver)
                    .Include(t => t.Truck)
                    .ToListAsync();

                // 7. Grąžinti sėkmingą atsakymą
                return Ok(new
                {
                    message = successMessage,
                    updatedOrders
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Klaida keičiant laiką: " + ex.Message);
                return StatusCode(500, "❌ Serverio klaida: " + ex.Message);
            }
        }

        public class DeliveryTimeUpdateModel
        {
            public int DeliveryTimeId { get; set; }
        } 

        [HttpPut("{orderId}/changeDeliveryTime")]
        public async Task<IActionResult> ChangeDeliveryTime(int orderId, [FromBody] DeliveryTimeUpdateModel model)
        {
            try
            {
                var order = await _context.TransportationOrders.FindAsync(orderId);
                if (order == null)
                    return NotFound("Užsakymas nerastas");

                var newTime = await _context.AvailableDeliveryTimes.FindAsync(model.DeliveryTimeId);
                if (newTime == null)
                    return BadRequest("Tokio pristatymo laiko nėra");

                order.DeliveryTimeId = model.DeliveryTimeId;
                await _context.SaveChangesAsync();

                return Ok(new { message = "✅ Rezervacijos laikas sėkmingai pakeistas" });
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Klaida keičiant rezervacijos laiką: " + ex.Message);
                return StatusCode(500, "Serverio klaida: " + ex.Message);
            }
        } 

        [HttpPut("{orderId}/cancelDeliveryTime")]
        public async Task<IActionResult> CancelDeliveryTime(int orderId)
        {
            try
            {
                var order = await _context.TransportationOrders.FindAsync(orderId);
                if (order == null)
                    return NotFound("Užsakymas nerastas");

                if (order.DeliveryTimeId == null)
                    return BadRequest("Užsakymas neturi priskirto pristatymo laiko");

                // Atšaukiam laiką
                order.DeliveryTimeId = null;
                await _context.SaveChangesAsync();

                return Ok(new { message = "✅ Pristatymo rezervacija atšaukta" });
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Klaida atšaukiant laiką: " + ex.Message);
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

        // tik POST dalis, pilnas failas jau pas tave geras
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TransportationOrderInputModel input)
        {
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

            _context.TransportationOrders.Add(order);
            await _context.SaveChangesAsync(); // ❗️orderID sugeneruojamas čia

            var warehouseOrders = await _context.WarehouseOrders
                .Where(w => input.WarehouseOrderIds.Contains(w.Id))
                .ToListAsync();

            foreach (var wo in warehouseOrders)
            {
                wo.TransportationOrderID = order.OrderId;
                _context.Entry(wo).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync(); // ❗️ išsaugom warehouse orders

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

        [HttpPut("{id}/driver")]
        public async Task<IActionResult> AssignDriver(int id, [FromBody] AssignDriverRequest model)
        {
            var order = await _context.TransportationOrders.FindAsync(id);
            if (order == null) return NotFound();

            // Patikrinti ar toks vairuotojas egzistuoja
            var driver = await _context.Drivers.FindAsync(model.DriverId);
            if (driver == null) return BadRequest("Vairuotojas nerastas");

            // Priskirti vairuotoją
            order.AssignedDriverId = model.DriverId;
            _context.Entry(order).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        public class AssignDriverRequest
        {
            public int DriverId { get; set; }
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
            public int? AssignedDriverId { get; set; }
            public string? TruckPlateNumber { get; set; }
            public OrderState State { get; set; } 


            public List<int> WarehouseOrderIds { get; set; } = new();
        }
    }
}
