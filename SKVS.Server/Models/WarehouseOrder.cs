using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 
using System.Text.Json.Serialization; 

namespace SKVS.Server.Models
{ 
    [Table("WarehouseOrder")] 
    public class WarehouseOrder
    {
        [Key] 
        [Column("id")]
        public int Id { get; set; }

        [Column("orderID")]
        public int OrderID { get; set; } 

        [Column("count")]
        public int Count { get; set; }
        [Column("weight")]
        public float Weight { get; set; }

        [Column("orderDate")]
        public DateTime OrderDate { get; set; } 

        [Column("deliveryDate")]
        public DateTime DeliveryDate { get; set; }

        [Column("transportationOrderID")]
        public int? TransportationOrderID { get; set; }

        [ForeignKey("TransportationOrderID")] 
        [JsonIgnore]
        public TransportationOrder? TransportationOrder { get; set; } 

        [Column("client_id")]
        public int ClientId { get; set; }

        [ForeignKey("ClientId")] 
        [JsonIgnore]
        public SVS? Client { get; set; }

        [Column("truckingCompanyUserId")]
        public int? TruckingCompanyUserId { get; set; }

        [ForeignKey("TruckingCompanyUserId")]
        [JsonIgnore]
        public TruckingCompanyManager? TruckingCompanyManager { get; set; }
    }
}
