namespace QuinntyneBrown.Dtos
{
    public class QuoteDto
    {
        public QuoteDto(QuinntyneBrown.Models.Quote entity)
        {
            this.Id = entity.Id;
            this.Name = entity.Name;
        }

        public QuoteDto()
        {
            
        }

        public int Id { get; set; }
        public string Name { get; set; }
    }
}
