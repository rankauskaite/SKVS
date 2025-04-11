using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SKVS.Server.Models
{ 
    [Table("TruckingCompanyManager")] 
    public class TruckingCompanyManager
    {
        [Key]
        [ForeignKey("User")] 
        [Column("user_id")]
        public int UserId { get; set; }

        public User User { get; set; } = null!; 

        [JsonIgnore]
        public List<Truck> Trucks { get; set; } = new();

    }
}
