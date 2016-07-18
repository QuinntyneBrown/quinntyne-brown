using QuinntyneBrown.Dtos;
using System.Collections.Generic;

namespace QuinntyneBrown.Services
{
    public interface IMenuItemService
    {
        MenuItemAddOrUpdateResponseDto AddOrUpdate(MenuItemAddOrUpdateRequestDto request);
        ICollection<MenuItemDto> Get();
        MenuItemDto GetById(int id);
        dynamic Remove(int id);
    }
}
