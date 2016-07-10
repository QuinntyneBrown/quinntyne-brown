using System.ComponentModel.DataAnnotations.Schema;

namespace QuinntyneBrown.Models
{
    public class ArticleCategory
    {
        public int Id { get; set; }
        [ForeignKey("Article")]
        public int? ArticleId { get; set; }
        [ForeignKey("Category")]
        public int? CategoryId { get; set; }
        public Article Article { get; set; }
        public Category Category { get; set; }
    }
}
