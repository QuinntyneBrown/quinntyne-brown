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
        public ICollection<GalleryDigitalAsset> GalleryDigitalAssets { get; set; } = new HashSet<GalleryDigitalAsset>();
        public ICollection<ServiceProviderGallery> ServiceProviderGalleries { get; set; } = new HashSet<ServiceProviderGallery>();
        public ICollection<CustomerGallery> CustomerGalleries { get; set; } = new HashSet<CustomerGallery>();
    }
}
