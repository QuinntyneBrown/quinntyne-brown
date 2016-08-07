using System.Collections.Generic;

namespace QuinntyneBrown.Models
{
    public class ServiceProvider: Person
    {
        public ICollection<ServiceProviderDigitalAsset> ServiceProviderPhotos { get; set; } = new HashSet<ServiceProviderDigitalAsset>();
        public ICollection<ServiceProviderGallery> ServiceProviderGalleries { get; set; } = new HashSet<ServiceProviderGallery>();
    }
}
