using System.Collections.Generic;

namespace QuinntyneBrown.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsDeleted { get; set; }
        public ICollection<CustomerOrder> CustomerOrders = new HashSet<CustomerOrder>();
        public ICollection<OrderProduct> OrderProducts { get; set; } = new HashSet<OrderProduct>();
    }
}
