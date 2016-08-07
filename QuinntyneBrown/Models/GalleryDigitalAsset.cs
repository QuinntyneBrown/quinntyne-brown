using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class GalleryDigitalAsset
    {
        public int Id { get; set; }
        [ForeignKey("Gallery")]
        public int? GalleryId { get; set; }
        [ForeignKey("Photo")]
        public int? PhotoId { get; set; }
        public Gallery Gallery { get; set; }
        public DigitalAsset Photo { get; set; }
    }
}
