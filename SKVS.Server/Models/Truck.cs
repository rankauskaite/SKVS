using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SKVS.Server.Models
{
    [Table("Truck")] 
    public class Truck
    {
        [Key]
        [ForeignKey("Vehicle")] 
        [Column("plateNumber")]
        public string PlateNumber { get; set; } = string.Empty;

        [Column("loadingCapacity")]
        public int LoadingCapacity { get; set; }

        [Column("owner_id")]
        public int OwnerId { get; set; }

        [ForeignKey("OwnerId")] 
        [JsonIgnore]
        public TruckingCompanyManager? Owner { get; set; }

        public Vehicle Vehicle { get; set; } = null!;
    }
}
