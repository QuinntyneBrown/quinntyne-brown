using System.Collections.Generic;
using System.Linq;

namespace QuinntyneBrown.Dtos
{
    public class GalleryDto
    {
        public GalleryDto(QuinntyneBrown.Models.Gallery entity)
        {
            Id = entity.Id;
            Name = entity.Name;
            Description = entity.Description;
            ServiceProviders = entity.ServiceProviderGalleries.Select(x => new ServiceProviderDto(x.ServiceProvider)).ToList();
            Photos = entity.GalleryPhotos.Select(x => new PhotoDto(x.Photo)).ToList();
            Categories = entity.GalleryCategories.Select(x => new CategoryDto(x.Category)).ToList();
        }

        public GalleryDto()
        {

        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Headline { get; set; }
        public string AlternateHeadline { get; set; }
        public string Description { get; set; }
        public ICollection<ServiceProviderDto> ServiceProviders { get; set; }
        public ICollection<PhotoDto> Photos { get; set; }
        public ICollection<CategoryDto> Categories {get;set;}
    }
}
