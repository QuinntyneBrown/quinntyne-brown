using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class UI
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [ForeignKey("App")]
        public int? AppId { get; set; }
        public ICollection<UISection> Sections { get; set; } = new HashSet<UISection>();
        public ICollection<UIProperty> Properties { get; set; } = new HashSet<UIProperty>();
        public App App { get; set; }
        public bool IsDeleted { get; set; }
    }
}
