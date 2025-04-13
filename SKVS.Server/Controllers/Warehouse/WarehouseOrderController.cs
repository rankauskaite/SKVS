using Microsoft.AspNetCore.Mvc;
using SKVS.Server.Models;
using SKVS.Server.Repository;

namespace SKVS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WarehouseOrderController : ControllerBase
    {
        private readonly IWarehouseOrderRepository _repository;
        private readonly ITruckingCompanyManagerRepository _repositoryTruckingCompanyManager;

        public WarehouseOrderController(IWarehouseOrderRepository repository, ITruckingCompanyManagerRepository repositoryTruckingCompanyManager)
        {
            _repository = repository;
            _repositoryTruckingCompanyManager = repositoryTruckingCompanyManager;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var orders = await _repository.GetAllAsync();
            return Ok(orders);
        }

        [HttpGet("truckingcompanies")]
        public async Task<IActionResult> GetTruckingCompanies()
        {
            var truckingCompanies = await _repositoryTruckingCompanyManager.GetAllAsync();
            return Ok(truckingCompanies);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var order = await _repository.GetByIdAsync(id);
            if (order == null) return NotFound();
            return Ok(order);
        }

        [HttpPost]
        public async Task<IActionResult> Post(WarehouseOrder order)
        {
            await _repository.AddAsync(order);
            return CreatedAtAction(nameof(Get), new { id = order.Id }, order);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, WarehouseOrder order)
        {
            if (id != order.Id) return BadRequest();
            await _repository.UpdateAsync(order);
            return NoContent();
        }

        [HttpDelete("{id}/cancel")]
        public async Task<IActionResult> Delete(int id)
        {
            await _repository.DeleteAsync(id);
            return Ok();
        }

        // 🔥 NAUJAS ENDPOINTAS: Nepriskirti (laisvi) warehouse orderiai
        [HttpGet("availablee")]
        public async Task<IActionResult> GetAvailable()
        {
            var availableOrders = await _repository.GetUnassignedAsync(); // turi būti įgyvendinta repozitorijoje
            return Ok(availableOrders);
        }
        [HttpGet("getCurrentOrderInfo")]
        public IActionResult GetCurrentOrderInfo()
        {
            return Ok();

        }

        [HttpPut("{id}/settruckingcompany")]
        public async Task<IActionResult> AssignTruckingCompany(int id, [FromBody] SetTruckingCompanyRequest request)
        {
            var order = await _repository.GetByIdAsync(id);
            if (order == null) return NotFound();

            order.TruckingCompanyUserId = request.UserId;
            await _repository.UpdateAsync(order);

            return Ok();
        }

        public class SetTruckingCompanyRequest
        {
            public int? UserId { get; set; }
        }
    }
}
