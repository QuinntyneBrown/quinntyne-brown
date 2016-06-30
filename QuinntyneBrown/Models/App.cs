using System.Collections.Generic;

namespace QuinntyneBrown.Models
{
    public class App
    {
        public int Id { get; set; }
        public ICollection<UI> UIs { get; set; } = new HashSet<UI>();
        public string Name { get; set; }
        public bool IsDeleted { get; set; }
    }
}
