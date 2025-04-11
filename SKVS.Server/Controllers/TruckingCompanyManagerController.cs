using Microsoft.AspNetCore.Mvc;
using SKVS.Server.Models;
using SKVS.Server.Repository;

namespace SKVS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TruckingCompanyManagerController : ControllerBase
    {
        private readonly ITruckingCompanyManagerRepository _repository;

        public TruckingCompanyManagerController(ITruckingCompanyManagerRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _repository.GetAllAsync());

        [HttpGet("{userId}")]
        public async Task<IActionResult> Get(int userId)
        {
            var manager = await _repository.GetByUserIdAsync(userId);
            return manager == null ? NotFound() : Ok(manager);
        }

        [HttpPost]
        public async Task<IActionResult> Create(TruckingCompanyManager manager)
        {
            await _repository.AddAsync(manager);
            return CreatedAtAction(nameof(Get), new { userId = manager.UserId }, manager);
        }

        [HttpPut("{userId}")]
        public async Task<IActionResult> Update(int userId, TruckingCompanyManager manager)
        {
            if (userId != manager.UserId) return BadRequest();
            await _repository.UpdateAsync(manager);
            return NoContent();
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> Delete(int userId)
        {
            await _repository.DeleteAsync(userId);
            return NoContent();
        }
    }
}
