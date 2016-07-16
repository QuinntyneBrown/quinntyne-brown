using QuinntyneBrown.Dtos;
using System.Collections.Generic;

namespace QuinntyneBrown.Services
{
    public interface ISocialShareItemService
    {
        SocialShareItemAddOrUpdateResponseDto AddOrUpdate(SocialShareItemAddOrUpdateRequestDto request);
        ICollection<SocialShareItemDto> Get();
        SocialShareItemDto GetById(int id);
        dynamic Remove(int id);
    }
}
