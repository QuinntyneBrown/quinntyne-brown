using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class UIProperty
    {
        public int Id { get; set; }
        [ForeignKey("UI")]
        public int? UIId { get; set; }
        [ForeignKey("Property")]
        public int? PropertyId { get; set; }
        public UI UI { get; set; }
        public Property Property { get; set; }
    }
}
