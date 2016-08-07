using QuinntyneBrown.Dtos;
using System.Collections.Generic;

namespace QuinntyneBrown.Services
{
    public interface IDigitalAssetService
    {
        DigitalAssetAddOrUpdateResponseDto AddOrUpdate(DigitalAssetAddOrUpdateRequestDto request);
        ICollection<DigitalAssetDto> Get();
        DigitalAssetDto GetById(int id);
        dynamic Remove(int id);
    }
}
