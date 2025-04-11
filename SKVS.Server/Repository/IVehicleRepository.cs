using SKVS.Server.Models;

namespace SKVS.Server.Repository
{
    public interface IVehicleRepository
    {
        Task<IEnumerable<Vehicle>> GetAllAsync();
        Task<Vehicle?> GetByPlateAsync(string plateNumber);
        Task AddAsync(Vehicle vehicle);
        Task DeleteAsync(string plateNumber);
    }
}
