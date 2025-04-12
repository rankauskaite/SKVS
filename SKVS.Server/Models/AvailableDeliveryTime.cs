using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SKVS.Server.Models
{
    [Table("AvailableDeliveryTime")]
    public class AvailableDeliveryTime
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("time")]
        public int Time { get; set; }

        [Column("ramp")]
        public int Ramp { get; set; }

        [Column("date")]
        public DateTime Date { get; set; }

        [Column("svs_id")]
        public int SvsId { get; set; }

        [ForeignKey("SvsId")]
        public SVS? Svs { get; set; }
    }
}
