using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class GalleryCategory
    {
        public int Id { get; set; }
        [ForeignKey("Gallery")]
        public int? GalleryId { get; set; }
        [ForeignKey("Category")]
        public int? CategoryId { get; set; }
        public Gallery Gallery { get; set; }
        public Category Category { get; set; }
    }
}
