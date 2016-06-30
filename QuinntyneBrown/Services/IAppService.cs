using QuinntyneBrown.Dtos;
using System.Collections.Generic;

namespace QuinntyneBrown.Services
{
    public interface IAppService
    {
        AppAddOrUpdateResponseDto AddOrUpdate(AppAddOrUpdateRequestDto request);
        ICollection<AppDto> Get();
        AppDto GetById(int id);
        dynamic Remove(int id);
    }
}
