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
            this.uow = uow;
            this.repository = uow.SocialShareItems;
            this.cache = cacheProvider.GetCache();
        }

        public SocialShareItemAddOrUpdateResponseDto AddOrUpdate(SocialShareItemAddOrUpdateRequestDto request)
        {
            var entity = repository.GetAll()
                .FirstOrDefault(x => x.Id == request.Id && x.IsDeleted == false);
            if (entity == null) repository.Add(entity = new SocialShareItem());
            entity.Name = request.Name;
            uow.SaveChanges();
            return new SocialShareItemAddOrUpdateResponseDto(entity);
        }

        public dynamic Remove(int id)
        {
            var entity = repository.GetById(id);
            entity.IsDeleted = true;
            uow.SaveChanges();
            return id;
        }

        public ICollection<SocialShareItemDto> Get()
        {
            ICollection<SocialShareItemDto> response = new HashSet<SocialShareItemDto>();
            var entities = repository.GetAll().Where(x => x.IsDeleted == false).ToList();
            foreach(var entity in entities) { response.Add(new SocialShareItemDto(entity)); }    
            return response;
        }


        public SocialShareItemDto GetById(int id)
        {
            return new SocialShareItemDto(repository.GetAll().Where(x => x.Id == id && x.IsDeleted == false).FirstOrDefault());
        }

        protected readonly IUow uow;
        protected readonly IRepository<SocialShareItem> repository;
        protected readonly ICache cache;
    }
}
