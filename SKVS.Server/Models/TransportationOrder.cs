using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SKVS.Server.Enums;
using System.Text.Json.Serialization;
using SKVS.Server.Models;

namespace SKVS.Server.Models
{
    [Table("TransportationOrder")]
    public class TransportationOrder
    {
        [Key]
        [Column("orderID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderId { get; set; }

        [Column("description")]
        public string Description { get; set; } = string.Empty;

        [Column("address")]
        public string Address { get; set; } = string.Empty;

        [Column("isCancelled")]
        public bool IsCancelled { get; set; } = false;

        [Column("deliveryTime")]
        public DateTime DeliveryTime { get; set; }

        [Column("ramp")]
        public int Ramp { get; set; }

        [Column("isCompleted")]
        public bool IsCompleted { get; set; } = false;

        [Column("state")]
        public OrderState State { get; set; } = OrderState.Formed;

        [Column("isOnTheWay")]
        public bool IsOnTheWay { get; set; } = false;

        // Foreign Key į TruckingCompanyManager
        [Column("createdBy_id")]
        public int CreatedById { get; set; }

        [ForeignKey("CreatedById")]
        [JsonIgnore]
        public TruckingCompanyManager? CreatedBy { get; set; }

        // Foreign Key į Truck
        [ForeignKey("truckPlateNumber")]
        public string? TruckPlateNumber { get; set; } = string.Empty;

        [ForeignKey("TruckPlateNumber")]
        [JsonIgnore]
        public Truck? Truck { get; set; }

        public List<WarehouseOrder> WarehouseOrders { get; set; } = new();

        [Column("assignedDriverId")]
        public int? AssignedDriverId { get; set; }

        [ForeignKey("AssignedDriverId")]
        [JsonIgnore]
        public Driver? AssignedDriver { get; set; }

        [Column("deliveryTimeId")]
        public int? DeliveryTimeId { get; set; }

        [ForeignKey("DeliveryTimeId")]
        [JsonIgnore]
        public AvailableDeliveryTime? DeliveryTimeSlot { get; set; }
    }
}
