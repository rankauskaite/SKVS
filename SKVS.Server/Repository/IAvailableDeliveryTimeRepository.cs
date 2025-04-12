using SKVS.Server.Models;

namespace SKVS.Server.Repository
{
    public interface IAvailableDeliveryTimeRepository
    {
        Task<IEnumerable<AvailableDeliveryTime>> GetAvailableDeliveryTimes(DateTime date);
        Task<AvailableDeliveryTime?> GetByIdAsync(int id);
        Task AddAsync(AvailableDeliveryTime availableDeliveryTime);
        Task UpdateAsync(AvailableDeliveryTime availableDeliveryTime);
        Task DeleteAsync(int id);
    }
}
