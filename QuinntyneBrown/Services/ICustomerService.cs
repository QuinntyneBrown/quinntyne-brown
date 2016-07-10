using QuinntyneBrown.Dtos;
using System.Collections.Generic;

namespace QuinntyneBrown.Services
{
    public interface ICustomerService
    {
        CustomerAddOrUpdateResponseDto AddOrUpdate(CustomerAddOrUpdateRequestDto request);
        ICollection<CustomerDto> Get();
        CustomerDto GetById(int id);
        dynamic Remove(int id);
    }
}
