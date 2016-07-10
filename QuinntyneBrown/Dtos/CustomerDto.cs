namespace QuinntyneBrown.Dtos
{
    public class CustomerDto
    {
        public CustomerDto(QuinntyneBrown.Models.Customer entity)
        {
            this.Id = entity.Id;
            this.Name = entity.Name;
        }

        public CustomerDto()
        {
            
        }

        public int Id { get; set; }
        public string Name { get; set; }
    }
}
