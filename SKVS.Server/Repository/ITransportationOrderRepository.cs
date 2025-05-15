using SKVS.Server.Models;
using static SKVS.Server.Controllers.DeliveryTimeManagementController;

namespace SKVS.Server.Repository
{
    public interface ITransportationOrderRepository
    {
        Task<IEnumerable<TransportationOrder>> GetAllAsync();
        Task<TransportationOrder?> GetByIdAsync(int id);

        Task UpdateOrderDeliveryInformation(int id, DeliveryTimeUpdateModel deliveryTime);
        Task CancelOrderDelivery(int id);
        Task AddAsync(TransportationOrder order);
        Task UpdateAsync(TransportationOrder order);
        Task DeleteAsync(int id);
    }
}
