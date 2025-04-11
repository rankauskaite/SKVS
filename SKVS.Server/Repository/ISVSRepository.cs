using SKVS.Server.Models;

namespace SKVS.Server.Repository
{
    public interface ISVSRepository
    {
        Task<IEnumerable<SVS>> GetAllAsync();
        Task<SVS?> GetByIdAsync(int id);
        Task AddAsync(SVS svs);
        Task UpdateAsync(SVS svs);
        Task DeleteAsync(int id);
    }
}
