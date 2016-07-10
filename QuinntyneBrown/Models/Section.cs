using System.Collections.Generic;

namespace QuinntyneBrown.Models
{
    public class Section
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsDynamic { get; set; }
        public ICollection<SectionProperty> SectionProperties { get; set; } = new HashSet<SectionProperty>();
    }
}
