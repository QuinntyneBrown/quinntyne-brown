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
        }

        public int? Id { get; set; }
        public string Name { get; set; }
    }
}
