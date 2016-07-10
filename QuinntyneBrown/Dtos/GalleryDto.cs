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
            Photographers = entity.PhotographerGalleries.Select(x => new PhotographerDto(x.Photographer)).ToList();
            Photos = entity.GalleryPhotos.Select(x => new PhotoDto(x.Photo)).ToList();
        }

        public GalleryDto()
        {
            
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<PhotographerDto> Photographers { get; set; }
        public ICollection<PhotoDto> Photos { get; set; }
    }
}
