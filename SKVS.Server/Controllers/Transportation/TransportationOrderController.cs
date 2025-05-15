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
    public class TransportationOrderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ITransportationOrderRepository _repositoryTransportationOrders;

        public TransportationOrderController(ApplicationDbContext context, ITransportationOrderRepository repositoryTransportationOrders)
        {
            _repositoryTransportationOrders = repositoryTransportationOrders;
            _context = context;
        }

        //PARODYTI UŽSAKYMŲ SĄRAŠA
        [HttpGet]
        public async Task<IActionResult> initializeTransportationOrders([FromQuery] int? userId)
        {
            try
            {
                var orders = await _repositoryTransportationOrders.GetAllAsync();

                if (userId.HasValue)//VAIRUOTOJUI
                {
                    orders = orders.Where(o => o.AssignedDriverId == userId.Value);
                }

                return Ok(orders);
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Klaida gaunant užsakymus: " + ex.Message);
                return StatusCode(500, "Serverio klaida: " + ex.Message);
            }
        }

        [HttpGet("drivers")]
        public async Task<IActionResult> GetDrivers()
        {
            try
            {
                var drivers = await _context.Drivers
                    .Include(d => d.User)
                    .ToListAsync();

                return Ok(drivers);
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Klaida gaunant vairuotojus: " + ex.Message);
                return StatusCode(500, "Serverio klaida: " + ex.Message);
            }
        }
    }
}