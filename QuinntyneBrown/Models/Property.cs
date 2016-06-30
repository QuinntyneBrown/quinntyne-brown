namespace QuinntyneBrown.Models
{
    public class Property
    {
        public int Id { get; set; }
        public string Name { get; set; }        
        public string Key { get; set; }
        public string Value { get; set; }
        public bool IsDynamic { get; set; }
        public string BaseUri { get; set; }
        public string Uri { get; set; }
        public string HtmlBody { get; set; }
        public PropertyType PropertyType { get; set; }  
        public bool IsDeleted { get; set; }      
    }
}
