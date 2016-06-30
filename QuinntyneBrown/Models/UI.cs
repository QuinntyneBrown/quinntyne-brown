using System.Collections.Generic;

namespace QuinntyneBrown.Models
{
    public class UI
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<Section> Sections { get; set; } = new HashSet<Section>();
        public bool IsDeleted { get; set; }
    }
}
