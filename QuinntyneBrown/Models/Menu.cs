using System.Collections.Generic;

namespace QuinntyneBrown.Models
{
    public class Menu
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsDeleted { get; set; }
        public ICollection<MenuItem> MenuItems { get; set; } = new HashSet<MenuItem>();
    }
}
