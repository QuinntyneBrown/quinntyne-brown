using System;
using System.Collections.Generic;

namespace QuinntyneBrown.Dtos
{
    public class ArticleDto
    {
        public ArticleDto()
        {

        }

        public ArticleDto(Models.Article entity)
        {
            Id = entity.Id;
            Name = entity.Name;
            Excerpt = entity.Excerpt;
            ArticleBody = entity.ArticleBody;
            Headline = entity.Headline;
            AlternativeHeadline = entity.AlternativeHeadline;
            Url = entity.Url;
            Author = new AuthorDto(entity.Author);
            DatePublished = entity.DatePublished;
            DateModified = entity.DateModified;

        }

        public int? Id { get; set; }
        public int? AuthorId { get; set; }
        public string Name { get; set; }
        public string Excerpt { get; set; }
        public string ArticleBody { get; set; }
        public string Headline { get; set; }
        public string AlternativeHeadline { get; set; }
        public string Url { get; set; }
        public AuthorDto Author { get; set; }
        public DateTime? DatePublished { get; set; }
        public DateTime? DateModified { get; set; }
        public ICollection<TagDto> Tags { get; set; } = new HashSet<TagDto>();
        public ICollection<CategoryDto> Categories { get; set; } = new HashSet<CategoryDto>();
        public string ThumbnailUrl { get; set; }
        public ICollection<string> Image { get; set; } = new HashSet<string>();

    }
}
