namespace QuinntyneBrown.Dtos
{
    public class SectionDto
    {
        public SectionDto(QuinntyneBrown.Models.Section entity)
        {
            this.Id = entity.Id;
            this.Name = entity.Name;
        }

        public SectionDto()
        {
            
        }

        public int Id { get; set; }
        public string Name { get; set; }
    }
}
