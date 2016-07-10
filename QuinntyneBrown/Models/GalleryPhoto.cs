using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class GalleryPhoto
    {
        public int Id { get; set; }
        [ForeignKey("Gallery")]
        public int? GalleryId { get; set; }
        [ForeignKey("Photo")]
        public int? PhotoId { get; set; }
        public Gallery Gallery { get; set; }
        public Photo Photo { get; set; }
    }
}
