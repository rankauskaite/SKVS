using SKVS.Server.Models;

namespace SKVS.Server.Repository
{
    public interface ITruckingCompanyManagerRepository
    {
        Task<IEnumerable<TruckingCompanyManager>> GetAllAsync();
        Task<TruckingCompanyManager?> GetByUserIdAsync(int userId);
        Task AddAsync(TruckingCompanyManager manager);
        Task UpdateAsync(TruckingCompanyManager manager);
        Task DeleteAsync(int userId);
    }
}
