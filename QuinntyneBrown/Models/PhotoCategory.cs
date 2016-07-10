using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class PhotoCategory
    {
        public int Id { get; set; }
        [ForeignKey("Photo")]
        public int? PhotoId { get; set; }
        [ForeignKey("Category")]
        public int? CategoryId { get; set; }
        public Photo Photo { get; set; }
        public Category Category { get; set; }
    }
}
