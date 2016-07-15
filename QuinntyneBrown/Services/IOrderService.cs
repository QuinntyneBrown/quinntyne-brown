using QuinntyneBrown.Dtos;
using System.Collections.Generic;

namespace QuinntyneBrown.Services
{
    public interface IOrderService
    {
        OrderAddOrUpdateResponseDto AddOrUpdate(OrderAddOrUpdateRequestDto request);
        ICollection<OrderDto> Get();
        OrderDto GetById(int id);
        dynamic Remove(int id);
    }
}
