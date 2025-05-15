using SKVS.Server.Models;

namespace SKVS.Server.Repository
{
    public interface IWarehouseOrderRepository
    {
        Task<IEnumerable<WarehouseOrder>> GetAllAsync();
        Task<IEnumerable<WarehouseOrder>> GetAllSelectedAsync(List<int> orderIds);
        Task<WarehouseOrder?> GetByIdAsync(int id);
        Task AddAsync(WarehouseOrder order);
        Task UpdateAsync(WarehouseOrder order);
        Task DeleteAsync(int id); 
        Task<IEnumerable<WarehouseOrder>> GetUnassignedAsync();

    }
}
