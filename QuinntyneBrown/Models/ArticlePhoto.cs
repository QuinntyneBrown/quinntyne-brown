using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class ArticlePhoto
    {
        public int Id { get; set; }
        [ForeignKey("Article")]
        public int? ArticleId { get; set; }
        [ForeignKey("Photo")]
        public int? PhotoId { get; set; }
        public DigitalAsset Photo { get; set; }
        public Article Article { get; set; }

    }
}
