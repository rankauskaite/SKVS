using SKVS.Server.Models;

namespace SKVS.Server.Repository
{
    public interface IAvailableDeliveryTimeRepository
    {
        Task<IEnumerable<AvailableDeliveryTime>> GetAvailableDeliveryTimes(DateTime date);
        Task<AvailableDeliveryTime?> GetByIdAsync(int id);
        Task<AvailableDeliveryTime?> GetByTimeAndRamp(DateTime time, int ramp);
        Task AddAsync(AvailableDeliveryTime availableDeliveryTime);
        Task UpdateAsync(AvailableDeliveryTime availableDeliveryTime);
        Task UpdateTimeAsync(int id, bool isTaken);
        Task DeleteAsync(int id);
    }
}
