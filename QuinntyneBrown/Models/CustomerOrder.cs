using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class CustomerOrder
    {
        public int Id { get; set; }
        [ForeignKey("Customer")]
        public int? CustomerId { get; set; }
        [ForeignKey("Order")]
        public int? OrderId { get; set; }
        public Customer Customer { get; set; }
        public Order Order { get; set; }
    }
}
