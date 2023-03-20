using DomainLayer;

namespace ServiceLayer
{
    public interface ITouristPlaceServices
    {
        Task<IAsyncEnumerable<TouristPlace>> GetAllTouristPlacesAsync();
        IList<TouristPlace> TouristPlaceGeneralSearch(string searchedText);
        Task<TouristPlace> GetTouristPlaceByIdAsync(int id);
        Task InsertTouristPlaceAsync(TouristPlace touristPlace);
        Task UpdateTouristPlaceAsync(TouristPlace touristPlace);
        Task DeleteTouristPlaceAsync(int id);
        Task<bool> IsExistsAsync(string name, int id = -1);
    }
}
