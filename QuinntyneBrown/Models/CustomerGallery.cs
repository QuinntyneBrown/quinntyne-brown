using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class CustomerGallery
    {
        public int Id { get; set; }
        [ForeignKey("Customer")]
        public int? CustomerId { get; set; }
        [ForeignKey("Gallery")]
        public int? GalleryId { get; set; }
        public Customer Customer { get; set; }
        public Gallery Gallery { get; set; }
    }
}
