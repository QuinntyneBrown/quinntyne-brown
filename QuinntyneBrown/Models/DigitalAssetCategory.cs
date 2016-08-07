using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class DigitalAssetCategory
    {
        public int Id { get; set; }
        [ForeignKey("DigitalAsset")]
        public int? DigitalAssetId { get; set; }
        [ForeignKey("Category")]
        public int? CategoryId { get; set; }
        public DigitalAsset DigitalAsset { get; set; }
        public Category Category { get; set; }
    }
}
