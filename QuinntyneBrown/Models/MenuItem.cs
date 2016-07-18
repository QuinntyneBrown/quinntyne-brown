using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class MenuItem
    {
        public int Id { get; set; }
        [ForeignKey("Menu")]
        public int? MenuId { get; set; }
        public string Name { get; set; }
        public string Caption { get; set; }
        public string Url { get; set; }
        public bool IsDeleted { get; set; }
        public Menu Menu { get; set; }
    }
}
