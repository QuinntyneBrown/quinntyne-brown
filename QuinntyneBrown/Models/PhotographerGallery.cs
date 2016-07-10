using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class PhotographerGallery
    {
        public int Id { get; set; }
        [ForeignKey("Photographer")]
        public int? PhotographerId { get; set; }
        [ForeignKey("Gallery")]
        public int? GalleryId { get; set; }
        public Photographer Photographer { get; set; }
        public Gallery Gallery { get; set; }
    }
}
