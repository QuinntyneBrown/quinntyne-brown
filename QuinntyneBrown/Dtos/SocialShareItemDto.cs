namespace QuinntyneBrown.Dtos
{
    public class SocialShareItemDto
    {
        public SocialShareItemDto(QuinntyneBrown.Models.SocialShareItem entity)
        {
            Id = entity.Id;
            Name = entity.Name;
            Src = entity.Src;
            SrcHover = entity.SrcHover;
        }

        public SocialShareItemDto()
        {
            
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Src { get; set; }
        public string SrcHover { get; set; }
        
    }
}
