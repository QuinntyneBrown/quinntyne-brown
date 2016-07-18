namespace QuinntyneBrown.Dtos
{
    public class MenuItemDto
    {
        public MenuItemDto(QuinntyneBrown.Models.MenuItem entity)
        {
            this.Id = entity.Id;
            this.Name = entity.Name;
        }

        public MenuItemDto()
        {
            
        }

        public int Id { get; set; }
        public string Name { get; set; }
    }
}
