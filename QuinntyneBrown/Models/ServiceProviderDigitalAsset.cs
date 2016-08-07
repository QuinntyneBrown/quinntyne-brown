using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class ServiceProviderDigitalAsset
    {
        public int Id { get; set; }
        [ForeignKey("ServiceProvider")]
        public int? ServiceProviderId { get; set; }
        [ForeignKey("DigitalAsset")]
        public int? DigitalAssetId { get; set; }
        public ServiceProvider ServiceProvider { get; set; }
        public DigitalAsset DigitalAsset { get; set; }
    }
}
