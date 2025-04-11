using SKVS.Server.Models;

namespace SKVS.Server.Repository
{
    public interface ITruckRepository
    {
        Task<IEnumerable<Truck>> GetAllAsync();
        Task<Truck?> GetByPlateAsync(string plateNumber);
        Task AddAsync(Truck truck);
        Task UpdateAsync(Truck truck);
        Task DeleteAsync(string plateNumber);
    }
}
