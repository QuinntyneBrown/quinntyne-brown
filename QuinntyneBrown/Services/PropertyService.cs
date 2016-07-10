using System;
using System.Collections.Generic;
using QuinntyneBrown.Data;
using QuinntyneBrown.Dtos;
using System.Data.Entity;
using System.Linq;
using QuinntyneBrown.Models;

namespace QuinntyneBrown.Services
{
    public class PropertyService : IPropertyService
    {
        public PropertyService(IUow uow, ICacheProvider cacheProvider)
        {
            this.uow = uow;
            this._repository = uow.Properties;
            this.cache = cacheProvider.GetCache();
        }

        public PropertyAddOrUpdateResponseDto AddOrUpdate(PropertyAddOrUpdateRequestDto request)
        {
            var entity = _repository.GetAll()
                .FirstOrDefault(x => x.Id == request.Id && x.IsDeleted == false);
            if (entity == null) _repository.Add(entity = new Property());
            entity.Name = request.Name;
            uow.SaveChanges();
            return new PropertyAddOrUpdateResponseDto(entity);
        }

        public dynamic Remove(int id)
        {
            var entity = _repository.GetById(id);
            entity.IsDeleted = true;
            uow.SaveChanges();
            return id;
        }

        public ICollection<PropertyDto> Get()
        {
            ICollection<PropertyDto> response = new HashSet<PropertyDto>();
            var entities = _repository.GetAll().Where(x => x.IsDeleted == false).ToList();
            foreach(var entity in entities) { response.Add(new PropertyDto(entity)); }    
            return response;
        }


        public PropertyDto GetById(int id)
        {
            return new PropertyDto(_repository.GetAll().Where(x => x.Id == id && x.IsDeleted == false).FirstOrDefault());
        }

        protected readonly IUow uow;
        protected readonly IRepository<Property> _repository;
        protected readonly ICache cache;
    }
}
