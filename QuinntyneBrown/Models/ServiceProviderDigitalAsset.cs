using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class ServiceProviderDigitalAsset
    {
        public int Id { get; set; }
        [ForeignKey("ServiceProvider")]
        public int? ServiceProviderId { get; set; }
        [ForeignKey("Photo")]
        public int? PhotoId { get; set; }
        public ServiceProvider ServiceProvider { get; set; }
        public DigitalAsset Photo { get; set; }
    }
}
