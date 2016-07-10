namespace QuinntyneBrown.Dtos
{
    public class PhotographerDto
    {
        public PhotographerDto(QuinntyneBrown.Models.Photographer entity)
        {
            this.Id = entity.Id;
            this.Name = entity.Name;
        }

        public PhotographerDto()
        {
            
        }

        public int Id { get; set; }
        public string Name { get; set; }
    }
}
