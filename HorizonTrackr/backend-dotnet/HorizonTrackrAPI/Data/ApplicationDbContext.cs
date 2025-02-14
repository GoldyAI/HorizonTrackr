using Microsoft.EntityFrameworkCore;
using HorizonTrackrAPI.Models;

namespace HorizonTrackrAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Job> Jobs { get; set; }
    }
}
