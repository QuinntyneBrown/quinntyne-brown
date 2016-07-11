namespace QuinntyneBrown.Dtos
{
    public class ContactDto
    {
        public ContactDto(QuinntyneBrown.Models.Contact entity)
        {
            Id = entity.Id;
            Name = entity.Name;
            Firstname = entity.Firstname;
            Lastname = entity.Lastname;
            PhoneNumber = entity.PhoneNumber;
            Email = entity.Email;
        }

        public ContactDto()
        {
            
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
    }
}
