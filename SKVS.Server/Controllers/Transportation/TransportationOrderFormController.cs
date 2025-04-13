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

        [HttpGet("/api/drivers")]
        public async Task<IActionResult> getDrivers()
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

        [HttpGet("/api/trucks")]
        public async Task<IActionResult> getTrucks() =>
            Ok(await _repositoryTruck.GetAllAsync());


        [HttpGet("/api/available/warehouseOrders")]
        public async Task<IActionResult> GetAvailable()
        {
            var availableOrders = await _repositoryWarehouseOrder.GetUnassignedAsync(); // turi būti įgyvendinta repozitorijoje
            return Ok(availableOrders);
        }

    }
}