using System;
using System.Collections.Generic;
using QuinntyneBrown.Data;
using QuinntyneBrown.Dtos;
using System.Data.Entity;
using System.Linq;
using QuinntyneBrown.Models;

namespace QuinntyneBrown.Services
{
    public class PhotographerService : IPhotographerService
    {
        public PhotographerService(IUow uow, ICacheProvider cacheProvider)
        {
            this._uow = uow;
            this._repository = uow.Photographers;
            this._cache = cacheProvider.GetCache();
        }

        public PhotographerAddOrUpdateResponseDto AddOrUpdate(PhotographerAddOrUpdateRequestDto request)
        {
            var entity = _repository.GetAll()
                .FirstOrDefault(x => x.Id == request.Id && x.IsDeleted == false);
            if (entity == null) _repository.Add(entity = new Photographer());
            entity.Name = request.Name;
            _uow.SaveChanges();
            return new PhotographerAddOrUpdateResponseDto(entity);
        }

        public dynamic Remove(int id)
        {
            var entity = _repository.GetById(id);
            entity.IsDeleted = true;
            _uow.SaveChanges();
            return id;
        }

        public ICollection<PhotographerDto> Get()
        {
            ICollection<PhotographerDto> response = new HashSet<PhotographerDto>();
            var entities = _repository.GetAll().Where(x => x.IsDeleted == false).ToList();
            foreach(var entity in entities) { response.Add(new PhotographerDto(entity)); }    
            return response;
        }
        
        public PhotographerDto GetById(int id)
        {
            return new PhotographerDto(_repository.GetAll().Where(x => x.Id == id && x.IsDeleted == false).FirstOrDefault());
        }

        public IQueryable<Photographer> GetAll() => _repository.GetAll();

        protected readonly IUow _uow;
        protected readonly IRepository<Photographer> _repository;
        protected readonly ICache _cache;
    }
}
