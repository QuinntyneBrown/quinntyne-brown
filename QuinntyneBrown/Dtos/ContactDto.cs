namespace QuinntyneBrown.Dtos
{
    public class ContactDto
    {
        public ContactDto(QuinntyneBrown.Models.Contact entity)
        {
            this.Id = entity.Id;
            this.Name = entity.Name;
        }

        public ContactDto()
        {
            
        }

        public int Id { get; set; }
        public string Name { get; set; }
    }
}
