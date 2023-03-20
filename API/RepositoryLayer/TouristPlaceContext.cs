using DomainLayer;
using Microsoft.EntityFrameworkCore;

namespace RepositoryLayer
{
    public class TouristPlaceContext : DbContext
    {
        public TouristPlaceContext(DbContextOptions<TouristPlaceContext> options) : base(options)
        {
        }

        public DbSet<TouristPlace> TouristPlaces { get; set; }

    }
}
