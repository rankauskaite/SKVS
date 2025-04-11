using Microsoft.AspNetCore.Mvc;
using SKVS.Server.Models;
using SKVS.Server.Repository;

namespace SKVS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TruckController : ControllerBase
    {
        private readonly ITruckRepository _repository;

        public TruckController(ITruckRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _repository.GetAllAsync());

        [HttpGet("{plateNumber}")]
        public async Task<IActionResult> Get(string plateNumber)
        {
            var truck = await _repository.GetByPlateAsync(plateNumber);
            return truck == null ? NotFound() : Ok(truck);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Truck truck)
        {
            await _repository.AddAsync(truck);
            return CreatedAtAction(nameof(Get), new { plateNumber = truck.PlateNumber }, truck);
        }

        [HttpPut("{plateNumber}")]
        public async Task<IActionResult> Update(string plateNumber, Truck truck)
        {
            if (plateNumber != truck.PlateNumber) return BadRequest();
            await _repository.UpdateAsync(truck);
            return NoContent();
        }

        [HttpDelete("{plateNumber}")]
        public async Task<IActionResult> Delete(string plateNumber)
        {
            await _repository.DeleteAsync(plateNumber);
            return NoContent();
        }
    }
}
