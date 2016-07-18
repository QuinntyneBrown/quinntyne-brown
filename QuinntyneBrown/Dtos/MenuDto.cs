namespace QuinntyneBrown.Dtos
{
    public class MenuDto
    {
        public MenuDto(QuinntyneBrown.Models.Menu entity)
        {
            this.Id = entity.Id;
            this.Name = entity.Name;
        }

        public MenuDto()
        {
            
        }

        public int Id { get; set; }
        public string Name { get; set; }
    }
}
