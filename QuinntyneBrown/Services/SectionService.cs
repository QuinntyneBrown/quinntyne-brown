using System;
using System.Collections.Generic;
using QuinntyneBrown.Data;
using QuinntyneBrown.Dtos;
using System.Linq;
using QuinntyneBrown.Models;
using static QuinntyneBrown.Services.PropertyHelper;

namespace QuinntyneBrown.Services
{
    public class SectionService : ISectionService
    {
        public SectionService(IUow uow, ICacheProvider cacheProvider)
        {
            _uow = uow;
            _repository = uow.Sections;
            _cache = cacheProvider.GetCache();
        }

        public SectionAddOrUpdateResponseDto AddOrUpdate(SectionAddOrUpdateRequestDto request)
        {
            var entity = _repository.GetAll()
                .FirstOrDefault(x => x.Id == request.Id && x.IsDeleted == false);
            if (entity == null) _repository.Add(entity = new Section());
            entity.Name = request.Name;
            _uow.SaveChanges();
            return new SectionAddOrUpdateResponseDto(entity);
        }

        public dynamic Remove(int id)
        {
            var entity = _repository.GetById(id);
            entity.IsDeleted = true;
            _uow.SaveChanges();
            return id;
        }

        public ICollection<SectionDto> Get()
        {
            ICollection<SectionDto> response = new HashSet<SectionDto>();
            var entities = _repository.GetAll().Where(x => x.IsDeleted == false).ToList();
            foreach(var entity in entities) { response.Add(new SectionDto(entity)); }    
            return response;
        }
        
        public SectionDto GetById(int id)
        {
            return new SectionDto(_repository.GetAll().Where(x => x.Id == id && x.IsDeleted == false).FirstOrDefault());
        }
        
        protected readonly IUow _uow;
        protected readonly IRepository<Section> _repository;
        protected readonly ICache _cache;
    }
}
