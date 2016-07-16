namespace QuinntyneBrown.Dtos
{
    public class SocialShareItemDto
    {
        public SocialShareItemDto(QuinntyneBrown.Models.SocialShareItem entity)
        {
            this.Id = entity.Id;
            this.Name = entity.Name;
        }

        public SocialShareItemDto()
        {
            
        }

        public int Id { get; set; }
        public string Name { get; set; }
    }
}
