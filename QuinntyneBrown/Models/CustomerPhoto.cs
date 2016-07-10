using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class CustomerPhoto
    {
        public int Id { get; set; }
        [ForeignKey("Customer")]
        public int? CustomerId { get; set; }
        [ForeignKey("Photo")]
        public int? PhotoId { get; set; }
        public Customer Customer { get; set; }
        public Photo Photo { get; set; }
    }
}
