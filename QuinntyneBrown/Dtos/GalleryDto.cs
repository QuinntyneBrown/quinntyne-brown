namespace QuinntyneBrown.Dtos
{
    public class GalleryDto
    {
        public GalleryDto(QuinntyneBrown.Models.Gallery entity)
        {
            this.Id = entity.Id;
            this.Name = entity.Name;
        }

        public GalleryDto()
        {
            
        }

        public int Id { get; set; }
        public string Name { get; set; }
    }
}
