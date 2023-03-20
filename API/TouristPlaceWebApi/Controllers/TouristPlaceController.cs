using DomainLayer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ServiceLayer.Interfaces;

namespace TouristPlaceWebApi.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class TouristPlaceController : ControllerBase
    {
        private readonly ITouristPlaceServices _touristPlaceServices;
        public TouristPlaceController(ITouristPlaceServices touristPlaceServices)
        {
            _touristPlaceServices = touristPlaceServices;
        }

        [HttpGet(nameof(GetAllTouristPlaces))]
        public async Task<ActionResult<List<TouristPlace>>> GetAllTouristPlaces(string? searchedText, string? sortBy, string? sortType)
        {
            List<TouristPlace> allTouristPlaces = new();
            // searching mechanism
            if(searchedText.IsNullOrEmpty() == false)
            {
                searchedText = searchedText.Trim();
                allTouristPlaces = (List<TouristPlace>)_touristPlaceServices.TouristPlaceGeneralSearch(searchedText);
            }
            else
            {
                allTouristPlaces = await _touristPlaceServices.GetAllTouristPlacesAsync().Result.ToListAsync();
            }
            // sorting mechanism
            if(sortBy.IsNullOrEmpty() == false)
            {
                if(sortBy == "Name")
                {
                    if(sortType == "ASC")
                    {
                        allTouristPlaces = allTouristPlaces.OrderBy(touristPlace => touristPlace.Name).ToList();
                    }
                    else //DESC
                    {
                        allTouristPlaces = allTouristPlaces.OrderByDescending(touristPlace => touristPlace.Name).ToList();
                    }
                }
                else // Rating
                {
                    if (sortType == "ASC")
                    {
                        allTouristPlaces = allTouristPlaces.OrderBy(touristPlace => touristPlace.Rating).ToList();
                    }
                    else //DESC
                    {
                        allTouristPlaces = allTouristPlaces.OrderByDescending(touristPlace => touristPlace.Rating).ToList();
                    }
                }
            }
            
            if(allTouristPlaces.Count > 0)
            {
                return Ok(allTouristPlaces);
            }
            return NoContent();
        }

        [HttpGet("GetTouristPlaceById/{id}")]
        public async Task<ActionResult<TouristPlace>> GetTouristPlaceById(int id)
        {
            var touristPlace = await _touristPlaceServices.GetTouristPlaceByIdAsync(id);
            if(touristPlace == null)
            {
                return NotFound();
            }
            return Ok(touristPlace);
        }

        [HttpPost(nameof(InsertTouristPlace))]
        public async Task<ActionResult<TouristPlace>> InsertTouristPlace(TouristPlace touristPlace)
        {
            if(ModelState.IsValid)
            {
                if (_touristPlaceServices.IsExistsAsync(touristPlace.Name).Result == false)
                {
                    await _touristPlaceServices.InsertTouristPlaceAsync(touristPlace);
                    return CreatedAtAction(nameof(InsertTouristPlace), touristPlace);
                }
                else
                {
                    return BadRequest("Same name already exists in the Database");
                }
            }
            else
            {
                return BadRequest("Wrong Input Data");
            }
        }

        [HttpPatch("UpdateTouristPlace")]
        public async Task<ActionResult> UpdateTouristPlace(TouristPlace touristPlace)
        {
            if (ModelState.IsValid)
            {
                if (_touristPlaceServices.IsExistsAsync(touristPlace.Name, touristPlace.Id).Result == false)
                {
                    await _touristPlaceServices.UpdateTouristPlaceAsync(touristPlace);
                    return NoContent();
                }
                else
                {
                    return BadRequest("Same tourist place already exists in the database");
                }
            }
            else
            {
                return BadRequest("Wrong Input Data");
            }
        }

        [HttpDelete("DeleteTouristPlace/{id}")]
        public async Task<ActionResult> DeleteTouristPlace(int id)
        {
            if(_touristPlaceServices.GetTouristPlaceByIdAsync(id).Result != null)
            {
                await _touristPlaceServices.DeleteTouristPlaceAsync(id);
                return NoContent();
            }
            else
            {
                return NotFound();
            }
        }
    }
}
