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
        private readonly ITruckRepository _repositoryTruck;
        private readonly IWarehouseOrderRepository _repositoryWarehouseOrder;

        public TransportationOrderFormController(ApplicationDbContext context, IDriverRepository repositoryDriver, ITruckRepository repositoryTruck,
        IWarehouseOrderRepository repositoryWarehouseOrder)
        {
            _context = context;
            _repositoryDriver = repositoryDriver;
            _repositoryTruck = repositoryTruck;
            _repositoryWarehouseOrder = repositoryWarehouseOrder;
        }

        // 3. getDrivers() ir 4. driverList()
        [HttpGet("/api/drivers")]
        public async Task<IActionResult> getDrivers()
        {
            var drivers = await _repositoryDriver.GetDrivers();

            var driverList = drivers.Select(d => new
            {
                d.UserId,
                d.Name,
                d.Surname
            });

            return Ok(driverList);
        }

        // 5. getTrucks() ir 6. truckList()
        [HttpGet("/api/trucks")]
        public async Task<IActionResult> getTrucks()
        {
            var truckList = await _repositoryTruck.GetAllAsync();
            return Ok(truckList);
        }

        // 7. getWarehouseOrders() ir 8. warehouseOrderList()
        [HttpGet("/api/available/warehouseOrders")]
        public async Task<IActionResult> getWarehouseOrders()
        {
            var warehouseOrderList = await _repositoryWarehouseOrder.GetUnassignedAsync();
            return Ok(warehouseOrderList);
        }
    }
}