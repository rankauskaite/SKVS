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

        public TransportationOrderFormController(ApplicationDbContext context, IDriverRepository repositoryDriver)
        {
            _context = context;
            _repositoryDriver = repositoryDriver;
        }

        [HttpGet("{drivers}")]
        public async Task<IActionResult> GetDrivers()
        {
            var drivers = await _repositoryDriver.GetDrivers();

            var result = drivers.Select(d => new
            {
                d.UserId,
                d.Name,
                d.Surname
            });

            return Ok(result);
        }
    }

    
}