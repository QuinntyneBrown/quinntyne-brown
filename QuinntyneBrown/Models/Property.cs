using System.Collections.Generic;

namespace QuinntyneBrown.Models
{
    public class Property
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<Property> Properties { get; set; } = new HashSet<Property>();
        public bool IsDeleted { get; set; }
    }
}
