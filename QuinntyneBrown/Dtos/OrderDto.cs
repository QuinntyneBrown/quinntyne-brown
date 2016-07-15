namespace QuinntyneBrown.Dtos
{
    public class OrderDto
    {
        public OrderDto(QuinntyneBrown.Models.Order entity)
        {
            this.Id = entity.Id;
            this.Name = entity.Name;
        }

        public OrderDto()
        {
            
        }

        public int Id { get; set; }
        public string Name { get; set; }
    }
}
