using Microsoft.AspNetCore.Mvc;
using SKVS.Server.Models;
using SKVS.Server.Repository;

namespace SKVS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DriverController : ControllerBase
    {
        private readonly IDriverRepository _repository;

        public DriverController(IDriverRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _repository.GetAllAsync());

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetByUserId(int userId)
        {
            var driver = await _repository.GetByUserIdAsync(userId);
            return driver == null ? NotFound() : Ok(driver);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Driver driver)
        {
            await _repository.AddAsync(driver);
            return CreatedAtAction(nameof(GetByUserId), new { userId = driver.UserId }, driver);
        }

        [HttpPut("{userId}")]
        public async Task<IActionResult> Update(int userId, Driver driver)
        {
            if (userId != driver.UserId) return BadRequest();
            await _repository.UpdateAsync(driver);
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
