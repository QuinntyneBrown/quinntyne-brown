using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class UISection
    {
        public int Id { get; set; }
        [ForeignKey("UI")]
        public int? UIId { get; set; }
        [ForeignKey("Section")]
        public int? SectionId { get; set; }
        public UI UI { get; set; }
        public Section Section { get; set; }
    }
}
