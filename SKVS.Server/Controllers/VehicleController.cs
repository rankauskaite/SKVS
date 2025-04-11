using Microsoft.AspNetCore.Mvc;
using SKVS.Server.Models;
using SKVS.Server.Repository;

namespace SKVS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehicleController : ControllerBase
    {
        private readonly IVehicleRepository _repository;

        public VehicleController(IVehicleRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _repository.GetAllAsync());

        [HttpGet("{plateNumber}")]
        public async Task<IActionResult> Get(string plateNumber)
        {
            var vehicle = await _repository.GetByPlateAsync(plateNumber);
            return vehicle == null ? NotFound() : Ok(vehicle);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Vehicle vehicle)
        {
            await _repository.AddAsync(vehicle);
            return CreatedAtAction(nameof(Get), new { plateNumber = vehicle.PlateNumber }, vehicle);
        }

        [HttpDelete("{plateNumber}")]
        public async Task<IActionResult> Delete(string plateNumber)
        {
            await _repository.DeleteAsync(plateNumber);
            return NoContent();
        }
    }
}
