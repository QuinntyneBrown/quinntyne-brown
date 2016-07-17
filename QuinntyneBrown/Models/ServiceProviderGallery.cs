using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class ServiceProviderGallery
    {
        public int Id { get; set; }
        [ForeignKey("ServiceProvider")]
        public int? ServiceProviderId { get; set; }
        [ForeignKey("Gallery")]
        public int? GalleryId { get; set; }
        public ServiceProvider ServiceProvider { get; set; }
        public Gallery Gallery { get; set; }
    }
}
