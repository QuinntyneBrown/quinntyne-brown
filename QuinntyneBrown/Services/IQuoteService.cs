using QuinntyneBrown.Dtos;
using System.Collections.Generic;

namespace QuinntyneBrown.Services
{
    public interface IQuoteService
    {
        QuoteAddOrUpdateResponseDto AddOrUpdate(QuoteAddOrUpdateRequestDto request);
        ICollection<QuoteDto> Get();
        QuoteDto GetById(int id);
        dynamic Remove(int id);
    }
}
