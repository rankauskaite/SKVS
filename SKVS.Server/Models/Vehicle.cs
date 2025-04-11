using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SKVS.Server.Models
{ 
    [Table("Vehicle")] 
    public class Vehicle
    {
        [Key] 
        [Column("plateNumber")]
        public string PlateNumber { get; set; } = string.Empty;
    }
}
