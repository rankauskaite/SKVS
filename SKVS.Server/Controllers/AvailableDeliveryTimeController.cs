using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SKVS.Server.Data;
using SKVS.Server.Models;

namespace SKVS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AvailableDeliveryTimeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AvailableDeliveryTimeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var times = await _context.AvailableDeliveryTimes
                    .Select(t => new
                    {
                        t.Id,
                        t.Ramp,
                        t.Date,
                        time = new
                        {
                            hours = t.Time / 100,    // Pvz., 1000 -> 10 val.
                            minutes = t.Time % 100   // Pvz., 1030 -> 30 min.
                        },
                        t.SvsId
                    })
                    .ToListAsync();

                return Ok(times);
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Klaida: " + ex.Message);
                return StatusCode(500, "Serverio klaida: " + ex.Message);
            }
        }


        

        [HttpPut("{id}/setDeliveryTime")]
        public async Task<IActionResult> SetDeliveryTime(int id, [FromBody] DeliveryTimeInputModel model)
        {
            var order = await _context.TransportationOrders.FindAsync(id);
            if (order == null)
                return NotFound();

            order.DeliveryTimeId = model.DeliveryTimeId;
            await _context.SaveChangesAsync();

            return Ok();
        }

        public class DeliveryTimeInputModel
        {
            public int DeliveryTimeId { get; set; }
        }



        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var time = await _context.AvailableDeliveryTimes
                .Include(t => t.Svs)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (time == null) return NotFound();
            return Ok(time);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AvailableDeliveryTime time)
        {
            _context.AvailableDeliveryTimes.Add(time);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = time.Id }, time);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var time = await _context.AvailableDeliveryTimes.FindAsync(id);
            if (time == null) return NotFound();

            _context.AvailableDeliveryTimes.Remove(time);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
