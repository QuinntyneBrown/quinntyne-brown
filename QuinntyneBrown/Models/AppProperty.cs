namespace QuinntyneBrown.Models
{
    public class AppProperty
    {
        public int Id { get; set; }
        public int? AppId { get; set; }
        public int? PropertyId { get; set; }
        public App App { get; set; }
        public Property Property { get; set; }
    }
}
