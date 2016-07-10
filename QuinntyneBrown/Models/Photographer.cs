using System.Collections.Generic;

namespace QuinntyneBrown.Models
{
    public class Photographer: Person
    {
        public ICollection<PhotographerPhoto> PhotographerPhotos { get; set; } = new HashSet<PhotographerPhoto>();
        public ICollection<PhotographerGallery> PhotographerGalleries { get; set; } = new HashSet<PhotographerGallery>();
    }
}
