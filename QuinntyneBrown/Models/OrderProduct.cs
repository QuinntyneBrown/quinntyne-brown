using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class OrderProduct
    {
        public int Id { get; set; }
        [ForeignKey("Product")]
        public int? ProductId { get; set; }
        [ForeignKey("Order")]
        public int? OrderId { get; set; }
        public Product Product { get; set; }
        public Order Order { get; set; }
        public int Quantity { get; set; }
    }
}
