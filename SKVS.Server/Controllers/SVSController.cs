using Microsoft.AspNetCore.Mvc;
using SKVS.Server.Models;
using SKVS.Server.Repository;

namespace SKVS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SVSController : ControllerBase
    {
        private readonly ISVSRepository _repository;

        public SVSController(ISVSRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var all = await _repository.GetAllAsync();
            return Ok(all);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var svs = await _repository.GetByIdAsync(id);
            return svs == null ? NotFound() : Ok(svs);
        }

        [HttpPost]
        public async Task<IActionResult> Post(SVS svs)
        {
            await _repository.AddAsync(svs);
            return CreatedAtAction(nameof(Get), new { id = svs.Id }, svs);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, SVS svs)
        {
            if (id != svs.Id) return BadRequest();
            await _repository.UpdateAsync(svs);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}
