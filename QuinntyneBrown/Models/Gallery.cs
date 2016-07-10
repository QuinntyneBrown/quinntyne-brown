using System.Collections.Generic;

namespace QuinntyneBrown.Models
{
    public class Gallery
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Headline { get; set; }
        public string AlternateHeadline { get; set; }
        public string Description { get; set; }
        public bool IsDeleted { get; set; }
        public ICollection<GalleryCategory> GalleryCategories { get; set; } = new HashSet<GalleryCategory>();
        public ICollection<GalleryPhoto> GalleryPhotos { get; set; } = new HashSet<GalleryPhoto>();
        public ICollection<PhotographerGallery> PhotographerGalleries { get; set; } = new HashSet<PhotographerGallery>();
        public ICollection<CustomerGallery> CustomerGalleries { get; set; } = new HashSet<CustomerGallery>();
    }
}
