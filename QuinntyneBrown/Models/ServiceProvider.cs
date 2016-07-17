using System.Collections.Generic;

namespace QuinntyneBrown.Models
{
    public class ServiceProvider: Person
    {
        public ICollection<ServiceProviderPhoto> ServiceProviderPhotos { get; set; } = new HashSet<ServiceProviderPhoto>();
        public ICollection<ServiceProviderGallery> ServiceProviderGalleries { get; set; } = new HashSet<ServiceProviderGallery>();
    }
}
