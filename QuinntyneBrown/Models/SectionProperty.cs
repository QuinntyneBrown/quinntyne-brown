using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class SectionProperty
    {
        public int Id { get; set; }
        [ForeignKey("Section")]
        public int? SectionId { get; set; }
        [ForeignKey("Property")]
        public int? PropertyId { get; set; }
        public Section Section { get; set; }
        public Property Property { get; set; }
    }
}
