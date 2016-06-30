using QuinntyneBrown.Dtos;
using System.Collections.Generic;

namespace QuinntyneBrown.Services
{
    public interface IArticleService
    {
        ArticleAddOrUpdateResponseDto AddOrUpdate(ArticleAddOrUpdateRequestDto request);
        ICollection<ArticleDto> Get();
        ArticleDto GetById(int id);
        dynamic Remove(int id);
    }
}
