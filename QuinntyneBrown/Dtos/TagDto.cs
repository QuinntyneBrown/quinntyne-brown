namespace QuinntyneBrown.Dtos
{
    public class TagDto
    {
        public TagDto(QuinntyneBrown.Models.Tag entity)
        {
            this.Id = entity.Id;
            this.Name = entity.Name;
        }

        public TagDto()
        {
            
        }

        public int Id { get; set; }
        public string Name { get; set; }
    }
}
