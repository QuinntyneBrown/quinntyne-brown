namespace QuinntyneBrown.Dtos
{
    public class ProfessionalServiceDto
    {
        public ProfessionalServiceDto(QuinntyneBrown.Models.ProfessionalService entity)
        {
            this.Id = entity.Id;
            this.Name = entity.Name;
        }

        public ProfessionalServiceDto()
        {
            
        }

        public int Id { get; set; }
        public string Name { get; set; }
    }
}
