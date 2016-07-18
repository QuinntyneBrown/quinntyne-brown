using System;
using System.Collections.Generic;
using QuinntyneBrown.Data;
using QuinntyneBrown.Dtos;
using System.Data.Entity;
using System.Linq;
using QuinntyneBrown.Models;

namespace QuinntyneBrown.Services
{
    public class MenuItemService : IMenuItemService
    {
        public MenuItemService(IUow uow, ICacheProvider cacheProvider)
        {
            this.uow = uow;
            this.repository = uow.MenuItems;
            this.cache = cacheProvider.GetCache();
        }

        public MenuItemAddOrUpdateResponseDto AddOrUpdate(MenuItemAddOrUpdateRequestDto request)
        {
            var entity = repository.GetAll()
                .FirstOrDefault(x => x.Id == request.Id && x.IsDeleted == false);
            if (entity == null) repository.Add(entity = new MenuItem());
            entity.Name = request.Name;
            uow.SaveChanges();
            return new MenuItemAddOrUpdateResponseDto(entity);
        }

        public dynamic Remove(int id)
        {
            var entity = repository.GetById(id);
            entity.IsDeleted = true;
            uow.SaveChanges();
            return id;
        }

        public ICollection<MenuItemDto> Get()
        {
            ICollection<MenuItemDto> response = new HashSet<MenuItemDto>();
            var entities = repository.GetAll().Where(x => x.IsDeleted == false).ToList();
            foreach(var entity in entities) { response.Add(new MenuItemDto(entity)); }    
            return response;
        }


        public MenuItemDto GetById(int id)
        {
            return new MenuItemDto(repository.GetAll().Where(x => x.Id == id && x.IsDeleted == false).FirstOrDefault());
        }

        protected readonly IUow uow;
        protected readonly IRepository<MenuItem> repository;
        protected readonly ICache cache;
    }
}
