using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SKVS.Server.Models;

namespace SKVS.Server.Models
{ 
    [Table("Driver")] 
    public class Driver
    {
        [Key]
        [ForeignKey("User")] 
        [Column("user_id")]
        public int UserId { get; set; } 

        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("surname")]
        public string Surname { get; set; } = string.Empty;

        public User User { get; set; } = null!;
    }
}
