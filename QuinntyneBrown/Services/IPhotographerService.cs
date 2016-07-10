using QuinntyneBrown.Dtos;
using System.Collections.Generic;

namespace QuinntyneBrown.Services
{
    public interface IPhotographerService
    {
        PhotographerAddOrUpdateResponseDto AddOrUpdate(PhotographerAddOrUpdateRequestDto request);
        ICollection<PhotographerDto> Get();
        PhotographerDto GetById(int id);
        dynamic Remove(int id);
    }
}
