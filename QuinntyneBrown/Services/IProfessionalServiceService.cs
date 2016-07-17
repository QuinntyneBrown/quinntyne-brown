using QuinntyneBrown.Dtos;
using System.Collections.Generic;

namespace QuinntyneBrown.Services
{
    public interface IProfessionalServiceService
    {
        ProfessionalServiceAddOrUpdateResponseDto AddOrUpdate(ProfessionalServiceAddOrUpdateRequestDto request);
        ICollection<ProfessionalServiceDto> Get();
        ProfessionalServiceDto GetById(int id);
        dynamic Remove(int id);
    }
}
