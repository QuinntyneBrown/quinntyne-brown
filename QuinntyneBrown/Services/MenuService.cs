using System;
using System.Collections.Generic;
using QuinntyneBrown.Data;
using QuinntyneBrown.Dtos;
using System.Data.Entity;
using System.Linq;
using QuinntyneBrown.Models;

namespace QuinntyneBrown.Services
{
    public class MenuService : IMenuService
    {
        public MenuService(IUow uow, ICacheProvider cacheProvider)
        {
            this.uow = uow;
            this.repository = uow.Menus;
            this.cache = cacheProvider.GetCache();
        }

        public MenuAddOrUpdateResponseDto AddOrUpdate(MenuAddOrUpdateRequestDto request)
        {
            var entity = repository.GetAll()
                .FirstOrDefault(x => x.Id == request.Id && x.IsDeleted == false);
            if (entity == null) repository.Add(entity = new Menu());
            entity.Name = request.Name;
            uow.SaveChanges();
            return new MenuAddOrUpdateResponseDto(entity);
        }

        public dynamic Remove(int id)
        {
            var entity = repository.GetById(id);
            entity.IsDeleted = true;
            uow.SaveChanges();
            return id;
        }

        public ICollection<MenuDto> Get()
        {
            ICollection<MenuDto> response = new HashSet<MenuDto>();
            var entities = repository.GetAll().Where(x => x.IsDeleted == false).ToList();
            foreach(var entity in entities) { response.Add(new MenuDto(entity)); }    
            return response;
        }


        public MenuDto GetById(int id)
        {
            return new MenuDto(repository.GetAll().Where(x => x.Id == id && x.IsDeleted == false).FirstOrDefault());
        }

        protected readonly IUow uow;
        protected readonly IRepository<Menu> repository;
        protected readonly ICache cache;
    }
}
