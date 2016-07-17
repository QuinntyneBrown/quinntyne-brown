using System;
using System.Collections.Generic;
using QuinntyneBrown.Data;
using QuinntyneBrown.Dtos;
using System.Data.Entity;
using System.Linq;
using QuinntyneBrown.Models;

namespace QuinntyneBrown.Services
{
    public class SocialShareItemService : ISocialShareItemService
    {
        public SocialShareItemService(IUow uow, ICacheProvider cacheProvider)
        {
            _uow = uow;
            _repository = uow.SocialShareItems;
            _cache = cacheProvider.GetCache();
        }

        public SocialShareItemAddOrUpdateResponseDto AddOrUpdate(SocialShareItemAddOrUpdateRequestDto request)
        {
            var entity = _repository.GetAll()
                .FirstOrDefault(x => x.Id == request.Id && x.IsDeleted == false);
            if (entity == null) _repository.Add(entity = new SocialShareItem());
            entity.Name = request.Name;
            entity.Src = request.Src;
            entity.SrcHover = request.SrcHover;
            _uow.SaveChanges();
            return new SocialShareItemAddOrUpdateResponseDto(entity);
        }

        public dynamic Remove(int id)
        {
            var entity = _repository.GetById(id);
            entity.IsDeleted = true;
            _uow.SaveChanges();
            return id;
        }

        public ICollection<SocialShareItemDto> Get()
        {
            ICollection<SocialShareItemDto> response = new HashSet<SocialShareItemDto>();
            var entities = _repository.GetAll().Where(x => x.IsDeleted == false).ToList();
            foreach(var entity in entities) { response.Add(new SocialShareItemDto(entity)); }    
            return response;
        }
        
        public SocialShareItemDto GetById(int id)
        {
            return new SocialShareItemDto(_repository.GetAll().Where(x => x.Id == id && x.IsDeleted == false).FirstOrDefault());
        }

        protected readonly IUow _uow;
        protected readonly IRepository<SocialShareItem> _repository;
        protected readonly ICache _cache;
    }
}
