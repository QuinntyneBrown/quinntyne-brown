using QuinntyneBrown.Dtos;
using System.Collections.Generic;

namespace QuinntyneBrown.Services
{
    public interface IContactService
    {
        ContactAddOrUpdateResponseDto AddOrUpdate(ContactAddOrUpdateRequestDto request);
        ICollection<ContactDto> Get();
        ContactDto GetById(int id);
        dynamic Remove(int id);
    }
}
