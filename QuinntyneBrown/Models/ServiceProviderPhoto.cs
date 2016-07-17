using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class ServiceProviderPhoto
    {
        public int Id { get; set; }
        [ForeignKey("ServiceProvider")]
        public int? ServiceProviderId { get; set; }
        [ForeignKey("Photo")]
        public int? PhotoId { get; set; }
        public ServiceProvider ServiceProvider { get; set; }
        public Photo Photo { get; set; }
    }
}
