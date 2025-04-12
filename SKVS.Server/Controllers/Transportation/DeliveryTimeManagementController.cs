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
    public class DeliveryTimeManagementController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IAvailableDeliveryTimeRepository _repositoryAvailableTimes;
        private readonly ITransportationOrderRepository _repositoryTransportationOrders;

        public DeliveryTimeManagementController(ApplicationDbContext context, IAvailableDeliveryTimeRepository repositoryAvailableTimes, ITransportationOrderRepository repositoryTransportationOrders)
        {
            _context = context;
            _repositoryAvailableTimes = repositoryAvailableTimes;
            _repositoryTransportationOrders = repositoryTransportationOrders;
        }

        [HttpGet("{orderId}")]
        public async Task<IActionResult> InitializeTimeManagement(int orderId)
        {
            var order = await _repositoryTransportationOrders.GetByIdAsync(orderId);
            if (order == null)
                return NotFound("Užsakymas nerastas arba neturi pristatymo datos");

            var deliveryTimes = await _repositoryAvailableTimes.GetAvailableDeliveryTimes(order.DeliveryTime);

            var response = new DeliveryTimeResponse
            {
                DeliveryTimes = deliveryTimes,
                OrderDate = order.DeliveryTime.Date,
            };

            return Ok(response);
        }

        [HttpPut("{orderId}/setDeliveryTime")]
        public async Task<IActionResult> GetSelectedTime(int orderId, [FromBody] DeliveryTimeUpdateModel model)
        {
            try
            {
                // 1. Gauti užsakymą
                var order = await _repositoryTransportationOrders.GetByIdAsync(orderId);
                if (order == null)
                {
                    return NotFound("❌ Užsakymas nerastas.");
                }

                // 2. Patikrinti ar toks pristatymo laikas egzistuoja (checkSelectedTime)
                var deliveryTime = CheckSelectedTime(model.DeliveryTimeId);
                if (deliveryTime == false)
                {
                    return BadRequest("⚠️ Pasirinktas laikas neegzistuoja.");
                }

                // 3. Atnaujinti užsakymą (updateOrderDeliveryInformation)
                await _repositoryTransportationOrders.SaveOrderDeliveryInformation(orderId, model.DeliveryTime, model.Ramp);

                // 4. Išsaugoti (delivery information saved)
                AvailableDeliveryTime availableDeliveryTime = new AvailableDeliveryTime
                {
                    Id = model.DeliveryTimeId,
                    IsTaken = true,
                    Date = model.DeliveryTime.Date,
                    Ramp = model.Ramp,
                    Time = model.Time,
                };
                await _repositoryAvailableTimes.UpdateAsync(availableDeliveryTime);

                // 5. Sukurti žinutę (formMessage) – čia paprasta sėkmės žinutė
                var successMessage = $"✅ Pristatymo laikas priskirtas: {model.DeliveryTime.Date} {model.Time/60}:00";

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

        private bool CheckSelectedTime(int deliveryTimeId)
        {
            // Patikriname ar laikas egzistuoja
            var deliveryTime = _context.AvailableDeliveryTimes.Find(deliveryTimeId);
            if (deliveryTime.IsTaken == true)
                return false;
            return true;
        }

        public class DeliveryTimeUpdateModel
        {
            public int DeliveryTimeId { get; set; }
            public DateTime DeliveryTime { get; set; }
            public int Ramp { get; set; }
            public int Time { get; set; } // Assuming this is the time in minutes or some other unit
        } 

        [HttpPut("{orderId}/changeDeliveryTime")]
        public async Task<IActionResult> ChangeDeliveryTime(int orderId, [FromBody] DeliveryTimeUpdateModel model)
        {
            try
            {
                var order = await _context.TransportationOrders.FindAsync(orderId);
                if (order == null)
                    return NotFound("Užsakymas nerastas");

                //var newTime = await _context.AvailableDeliveryTimes.FindAsync(model.DeliveryTimeId);
                //if (newTime == null)
                    //return BadRequest("Tokio pristatymo laiko nėra");

                //order.DeliveryTimeId = model.DeliveryTimeId;
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

    }    

    public class DeliveryTimeResponse
    {
        public required IEnumerable<AvailableDeliveryTime> DeliveryTimes { get; set; }
        public DateTime OrderDate { get; set; }
    }

}