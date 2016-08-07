using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class CustomerDigitalAsset
    {
        public int Id { get; set; }
        [ForeignKey("Customer")]
        public int? CustomerId { get; set; }
        [ForeignKey("DigitalAsset")]
        public int? DigitalAssetId { get; set; }
        public Customer Customer { get; set; }
        public DigitalAsset DigitalAsset { get; set; }
    }
}
