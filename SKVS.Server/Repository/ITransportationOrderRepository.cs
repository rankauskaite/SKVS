using SKVS.Server.Models;

namespace SKVS.Server.Repository
{
    public interface ITransportationOrderRepository
    {
        Task<IEnumerable<TransportationOrder>> GetAllAsync();
        Task<TransportationOrder?> GetByIdAsync(int id);

        Task UpdateOrderDeliveryInformation(int id, DateTime deliveryTime, int ramp);
        Task CancelOrderDelivery(int id);
        Task AddAsync(TransportationOrder order);
        Task UpdateAsync(TransportationOrder order);
        Task DeleteAsync(int id);
    }
}
