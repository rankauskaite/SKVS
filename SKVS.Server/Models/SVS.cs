using System.ComponentModel.DataAnnotations; 
using System.ComponentModel.DataAnnotations.Schema; 
using System.Text.Json.Serialization;

namespace SKVS.Server.Models
{
    public class SVS
    {
        [Key] 
        [Column("id")]
        public int Id { get; set; }

        [Required] 
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [JsonIgnore]
        public ICollection<WarehouseOrder> WarehouseOrders { get; set; } = new List<WarehouseOrder>();
    }
}
