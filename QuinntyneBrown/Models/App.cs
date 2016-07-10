using System.Collections.Generic;

namespace QuinntyneBrown.Models
{
    public class App
    {
        public int Id { get; set; }
        public ICollection<UI> UIs { get; set; } = new HashSet<UI>();
        public ICollection<AppProperty> Properties { get; set; } = new HashSet<AppProperty>();
        public string Name { get; set; }
        public bool IsDeleted { get; set; }
    }
}
