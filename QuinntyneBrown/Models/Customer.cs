using System.Collections.Generic;

namespace QuinntyneBrown.Models
{
    public class Customer: Person
    {
        public ICollection<CustomerGallery> CustomerGalleries { get; set; } = new HashSet<CustomerGallery>();
        public ICollection<CustomerDigitalAsset> CustomerDigitalAssets { get; set; } = new HashSet<CustomerDigitalAsset>();
        public ICollection<CustomerOrder> CustomerOrders { get; set; } = new HashSet<CustomerOrder>();
    }
}
