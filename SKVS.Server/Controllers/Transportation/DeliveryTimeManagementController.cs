using System.Threading.Tasks;
using Microsoft.AspNetCore.Components.Routing;
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
                var deliveryTimeValid = await CheckSelectedTime(model.DeliveryTimeId);
                if (!deliveryTimeValid)
                {
                    return BadRequest("⚠️ Pasirinktas laikas neegzistuoja arba jau užimtas.");
                }

                Console.WriteLine("➡️ Pradedu atnaujinti laiką");
                if (order.Ramp != null)
                {
                    var deliveryTime = await _repositoryAvailableTimes.GetByTimeAndRamp(order.DeliveryTime, order.Ramp.Value);
                    if (deliveryTime != null)
                    {
                        Console.WriteLine($"❗ Pirmas laikas rastas: {deliveryTime.Id}");

                        // Pakeisti pirmą laiką į false
                        await _repositoryAvailableTimes.UpdateTimeAsync(deliveryTime.Id, false);
                        Console.WriteLine($"✅ 1 Laikas atnaujintas į false: {deliveryTime.Id}");

                        // Antras atnaujinimas (naujas laikas)
                        await _repositoryAvailableTimes.UpdateTimeAsync(model.DeliveryTimeId, true);
                        Console.WriteLine("✅ 2 Laikas atnaujintas į true");
                    }
                    else
                    {
                        Console.WriteLine("❌ Laiko su tokiu Ramp nerasta.");
                    }
                }
                else
                {
                    Console.WriteLine("❌ Ramp yra null.");
                    await _repositoryAvailableTimes.UpdateTimeAsync(model.DeliveryTimeId, true);
                    Console.WriteLine("✅ Laikas atnaujintas (tikai antras veiksmas)");
                }

                Console.WriteLine("➡️ Pradedu išsaugoti užsakymą");
                await _repositoryTransportationOrders.UpdateOrderDeliveryInformation(orderId, model.DeliveryTime, model.Ramp);
                Console.WriteLine("✅ Užsakymas išsaugotas");

                // 5. Sukurti žinutę (formMessage) – čia paprasta sėkmės žinutė
                var successMessage = $"✅ Pristatymo laikas priskirtas: {model.DeliveryTime.Date} {model.Time/60}:00";

                // 7. Grąžinti sėkmingą atsakymą
                return Ok(new
                {
                    message = successMessage,
                    redirectTo = "driver",
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Klaida keičiant laiką: " + ex.Message);
                return StatusCode(500, "❌ Serverio klaida: " + ex.Message);
            }
        }

        private async Task<bool> CheckSelectedTime(int deliveryTimeId)
        {
            var deliveryTime = await _repositoryAvailableTimes.GetByIdAsync(deliveryTimeId);
            Console.WriteLine("DeliveryTimeId: " + deliveryTimeId);
            if (deliveryTime == null || deliveryTime.IsTaken)
                return false;
            return true;
        }

        [HttpPut("{orderId}/cancelDeliveryTime")]
        public async Task<IActionResult> GetCancellation(int orderId)
        {
            try
            {
                var order = await _repositoryTransportationOrders.GetByIdAsync(orderId);
                if (order == null)
                    return NotFound("Užsakymas nerastas");

                if (CheckCancellation(order.DeliveryTimeId) == false)
                    return BadRequest("Užsakymas neturi priskirto pristatymo laiko");

                // Atšaukiam laiką
                Console.WriteLine("➡️ Pradedu atnaujinti laiką");
                var deliveryTime = await _repositoryAvailableTimes.GetByTimeAndRamp(order.DeliveryTime, order.Ramp.Value);
                if(deliveryTime != null)
                {
                    Console.WriteLine($"❗ Pirmas laikas rastas: {deliveryTime.Id}");

                    // Pakeisti pirmą laiką į false
                    await _repositoryAvailableTimes.UpdateTimeAsync(deliveryTime.Id, false);
                    Console.WriteLine($"✅ Laikas atnaujintas į false: {deliveryTime.Id}");
                }
                else
                {
                    Console.WriteLine("❌ Laiko su tokiu Ramp nerasta.");
                }
                await _repositoryTransportationOrders.CancelOrderDelivery(orderId);

                return Ok(new { message = "✅ Pristatymo rezervacija atšaukta" });
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Klaida atšaukiant laiką: " + ex.Message);
                return StatusCode(500, "Serverio klaida: " + ex.Message);
            }
        }

        private bool CheckCancellation(int? deliveryTimeId)
        {
            if (deliveryTimeId == null)
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


    }

    public class DeliveryTimeResponse
    {
        public required IEnumerable<AvailableDeliveryTime> DeliveryTimes { get; set; }
        public DateTime OrderDate { get; set; }
    }

}