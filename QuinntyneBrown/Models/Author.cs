namespace QuinntyneBrown.Models
{
    public class Author
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public bool IsDeleted { get; set; }
        public int? DigitalAssetId { get; set; }
        public DigitalAsset DigitalAsset { get; set; }
    }
}
