using System.Collections.Generic;

namespace QuinntyneBrown.Models
{
    public class Gallery
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsDeleted { get; set; }
        public ICollection<GalleryPhoto> GalleryPhotos { get; set; } = new HashSet<GalleryPhoto>();
        public ICollection<PhotographerGallery> PhotographerGalleries { get; set; } = new HashSet<PhotographerGallery>();
        public ICollection<CustomerGallery> CustomerGalleries { get; set; } = new HashSet<CustomerGallery>();
    }
}
