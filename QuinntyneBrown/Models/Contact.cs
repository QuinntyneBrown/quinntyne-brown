namespace QuinntyneBrown.Models
{
    public class Contact
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public bool IsDeleted { get; set; }
    }
}
