using DomainLayer;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace RepositoryLayer
{
    public class Repository<T> : IRepository<T> where T : BaseEntity
    {
        private readonly TouristPlaceContext _context;
        private DbSet<T> _entities;
        public Repository(TouristPlaceContext touristPlaceContext)
        {
            _context = touristPlaceContext;
            _entities = _context.Set<T>();
        }

        public async Task DeleteOneAsync(int id)
        {
            var result = _entities.SingleOrDefault(e => e.Id == id);
            if (result != null)
            {
                _entities.Remove(result);
                await SaveChangesAsync();
            }
            else
            {
                throw new ArgumentNullException("No entity available with id = " + id);
            }
        }

        public IList<T> GeneralSearch(Expression<Func<T, bool>> predicate)
        {
            var result_t = _entities.Where(predicate);
            var result = result_t.ToList();
            return result;
        }

        public async Task<IAsyncEnumerable<T>> GetAllAsync()
        {
            var result  = _entities.AsAsyncEnumerable();
            return result;
        }

        public async Task<T> GetOneAsync(int id)
        {
            return await _entities.SingleOrDefaultAsync(entity => entity.Id == id);
        }

        public async Task InsertOneAsync(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("No entity found to insert in the database");
            }
            else
            {
                entity.CreatedAt = DateTime.Now;    
                await _entities.AddAsync(entity);
                await SaveChangesAsync();
            }
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task UpdateOneAsync(T entity)
        {
            entity.UpdatedAt = DateTime.Now;
            _entities.Update(entity);
            _context.SaveChanges(); 
            await SaveChangesAsync();
        }

        
    }
}
