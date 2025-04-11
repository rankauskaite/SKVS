using Microsoft.EntityFrameworkCore;
using SKVS.Server.Models; // Pritaikyk pagal tavo namespace!

namespace SKVS.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<User> Users => Set<User>();
    }
}
