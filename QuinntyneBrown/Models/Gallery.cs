using System.Collections.Generic;

namespace QuinntyneBrown.Models
{
    public class Gallery
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsDeleted { get; set; }
        public ICollection<Photo> Photos { get; set; } = new HashSet<Photo>();
    }
}
