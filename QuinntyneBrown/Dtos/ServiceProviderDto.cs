namespace QuinntyneBrown.Dtos
{
    public class ServiceProviderDto
    {
        public ServiceProviderDto(QuinntyneBrown.Models.ServiceProvider entity)
        {
            this.Id = entity.Id;
            this.Name = entity.Name;
        }

        public ServiceProviderDto()
        {
            
        }

        public int Id { get; set; }
        public string Name { get; set; }
    }
}
