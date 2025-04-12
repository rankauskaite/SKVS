using SKVS.Server.Models;

namespace SKVS.Server.Repository
{
    public interface IDriverRepository
    {
        Task<IEnumerable<Driver>> GetDrivers();
        Task<Driver?> GetByUserIdAsync(int userId);
        Task AddAsync(Driver driver);
        Task UpdateAsync(Driver driver);
        Task DeleteAsync(int userId);
    }
}
