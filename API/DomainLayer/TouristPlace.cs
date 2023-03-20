using System.ComponentModel.DataAnnotations;

namespace DomainLayer
{
    public class TouristPlace : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(100)]
        public string Address { get; set; }

        [Required]
        [Range(1, 5, ErrorMessage = "Enter the Rating between 1 and 5")]
        public int Rating { get; set; }

        [Required]
        [MaxLength(20)]    
        public string Type { get; set; }

        [Required]
        public string Picture { get; set; }
    }
}
