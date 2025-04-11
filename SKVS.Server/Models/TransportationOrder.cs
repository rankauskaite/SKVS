using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SKVS.Server.Enums;

namespace SKVS.Server.Models
{ 
    [Table("TransportationOrder")] 
    public class TransportationOrder
    {
        [Key] 
        [Column("orderID")]
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
        public TruckingCompanyManager? CreatedBy { get; set; }

        // Foreign Key į Truck
        public string TruckPlateNumber { get; set; } = string.Empty;

        [ForeignKey("TruckPlateNumber")]
        public Truck? Truck { get; set; }
    }
}
