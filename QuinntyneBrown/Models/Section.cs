using System.Collections.Generic;

namespace QuinntyneBrown.Models
{
    public class Section
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsDeleted { get; set; }
        public ICollection<Property> Properties { get; set; } = new HashSet<Property>();
        public ICollection<Section> Sections { get; set; } = new HashSet<Section>();
    }
}
