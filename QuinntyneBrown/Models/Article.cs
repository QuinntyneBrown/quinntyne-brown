using System;
using System.Collections.Generic;

namespace QuinntyneBrown.Models
{
    public class Article
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ArticleBody { get; set; }
        public string Excerpt { get; set; }
        public string Headline { get; set; }
        public string Url { get; set; }
        public string AlternativeHeadline { get; set; }
        public DateTime? DatePublished { get; set; }
        public DateTime? DateModified { get; set; }
        public bool IsPublished { get; set; }
        public string Slug { get; set; }
        public string Title { get; set; }
        public string UniqueId { get; set; }
        public bool IsDeleted { get; set; }
        public int? AuthorId { get; set; }
        public Author Author { get; set; }
        public ICollection<ArticleCategory> ArticleCategories { get; set; } = new HashSet<ArticleCategory>();
        public ICollection<ArticleDigitalAsset> ArticleDigitalAssets { get; set; } = new HashSet<ArticleDigitalAsset>();
    }
}
