using System;
using System.Collections.Generic;
using QuinntyneBrown.Data;
using QuinntyneBrown.Dtos;
using System.Data.Entity;
using System.Linq;
using QuinntyneBrown.Models;
using static QuinntyneBrown.Services.PropertyHelper;

namespace QuinntyneBrown.Services
{
    public class AppService : IAppService
    {
        public AppService(IUow uow, ICacheProvider cacheProvider)
        {
            _uow = uow;
            _repository = uow.Apps;
            _cache = cacheProvider.GetCache();
        }

        public AppAddOrUpdateResponseDto AddOrUpdate(AppAddOrUpdateRequestDto request)
        {
            var entity = GetAll()
                .FirstOrDefault(x => x.Id == request.Id && x.IsDeleted == false);
            if (entity == null) _repository.Add(entity = new App());
            entity.Name = request.Name;
            entity.UIs.Clear();
            entity.Properties.Clear();

            foreach (var property in request.Properties)
            {
                entity.Properties.Add(new AppProperty() { Property = _uow.Properties.GetById(property.Id) });
            }

            foreach (var ui in request.UIs)
            {
                entity.UIs.Add(_uow.UIs.GetById(ui.Id));
            }

            _uow.SaveChanges();
            return new AppAddOrUpdateResponseDto(entity);
        }

        public dynamic Remove(int id)
        {
            var entity = _repository.GetById(id);
            entity.IsDeleted = true;
            _uow.SaveChanges();
            return id;
        }

        public ICollection<AppDto> Get()
        {
            ICollection<AppDto> response = new HashSet<AppDto>();
            var entities = GetAll().Where(x => x.IsDeleted == false).ToList();
            foreach(var entity in entities) {
                ResolveDynamicProperties(entity.Properties);
                response.Add(new AppDto(entity));
            }    
            return response;
        }


        public AppDto GetById(int id)
        {
            var app = GetAll().Where(x => x.Id == id && x.IsDeleted == false).FirstOrDefault();
            if (app == null)
                return new AppDto();

            ResolveDynamicProperties(app.Properties);
            return new AppDto(app);
        }

        public IQueryable<App> GetAll() => _repository.GetAll()
            .Include(x => x.UIs)
            .Include(x => x.Properties)
            .Include("Properties.Property");

        protected readonly IUow _uow;
        protected readonly IRepository<App> _repository;
        protected readonly ICache _cache;
    }
}
