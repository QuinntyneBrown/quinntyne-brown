using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;

namespace QuinntyneBrown.Dtos
{
    public class AppDto
    {
        public AppDto(QuinntyneBrown.Models.App entity)
        {
            Id = entity.Id;
            Name = entity.Name;
            UIs = entity.UIs.Select(x => new UIDto(x)).ToList();
            Properties = entity.Properties.Select(x => new PropertyDto(x.Property)).ToList();
        }

        public AppDto()
        {
            
        }

        public int Id { get; set; }
        public string Name { get; set; }
        [JsonProperty(PropertyName = "uis")]
        public ICollection<UIDto> UIs { get; set; } = new HashSet<UIDto>();
        public ICollection<PropertyDto> Properties = new HashSet<PropertyDto>();
    }
}
