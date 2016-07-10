using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class PhotographerPhoto
    {
        public int Id { get; set; }
        [ForeignKey("Photographer")]
        public int? PhotographerId { get; set; }
        [ForeignKey("Photo")]
        public int? PhotoId { get; set; }
        public Photographer Photographer { get; set; }
        public Photo Photo { get; set; }
    }
}
