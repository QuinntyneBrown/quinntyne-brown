namespace QuinntyneBrown.Dtos
{
    public class ProductDto
    {
        public ProductDto(QuinntyneBrown.Models.Product entity)
        {
            this.Id = entity.Id;
            this.Name = entity.Name;
        }

        public ProductDto()
        {
            
        }

        public int Id { get; set; }
        public string Name { get; set; }
    }
}
