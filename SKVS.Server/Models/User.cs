using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SKVS.Server.Models
{ 
    [Table("User")] 
    public class User
    { 
        [Key] 
        [Column("id")]
        public int Id { get; set; } 

        [Column("username")]
        public string Username { get; set; } = string.Empty; 

        [Column("phoneNumber")]
        public string PhoneNumber  { get; set; } = string.Empty; 

        [Column("password")]
        public string PasswordHash { get; set; } = string.Empty; 

        [JsonIgnore]
        public Driver? Driver { get; set; } 

        [JsonIgnore]
        public TruckingCompanyManager? Manager { get; set; }
    }
}