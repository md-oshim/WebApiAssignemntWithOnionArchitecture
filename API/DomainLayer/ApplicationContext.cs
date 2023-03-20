using Microsoft.EntityFrameworkCore;

namespace DomainLayer
{
    public class ApplicationContext : DbContext
    {
        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {
        }

        public DbSet<TouristPlace> TouristPlaces { get; set; }

    }
}
