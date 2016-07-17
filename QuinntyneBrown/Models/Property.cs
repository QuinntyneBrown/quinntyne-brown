using System.Collections.Generic;

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
        public ICollection<AppProperty> AppProperties { get; set; } = new HashSet<AppProperty>();
        public ICollection<SectionProperty> SectionProperties { get; set; } = new HashSet<SectionProperty>();
        public ICollection<UIProperty> UIProperties { get; set; } = new HashSet<UIProperty>(); 
    }
}
