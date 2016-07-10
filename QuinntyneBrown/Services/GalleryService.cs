using System;
using System.Collections.Generic;
using QuinntyneBrown.Data;
using QuinntyneBrown.Dtos;
using System.Data.Entity;
using System.Linq;
using QuinntyneBrown.Models;

namespace QuinntyneBrown.Services
{
    public class GalleryService : IGalleryService
    {
        public GalleryService(IUow uow, ICacheProvider cacheProvider)
        {
            this.uow = uow;
            this.repository = uow.Galleries;
            this.cache = cacheProvider.GetCache();
        }

        public GalleryAddOrUpdateResponseDto AddOrUpdate(GalleryAddOrUpdateRequestDto request)
        {
            var entity = repository.GetAll()
                .FirstOrDefault(x => x.Id == request.Id && x.IsDeleted == false);
            if (entity == null) repository.Add(entity = new Gallery());
            entity.Name = request.Name;
            uow.SaveChanges();
            return new GalleryAddOrUpdateResponseDto(entity);
        }

        public dynamic Remove(int id)
        {
            var entity = repository.GetById(id);
            entity.IsDeleted = true;
            uow.SaveChanges();
            return id;
        }

        public ICollection<GalleryDto> Get()
        {
            ICollection<GalleryDto> response = new HashSet<GalleryDto>();
            var entities = repository.GetAll().Where(x => x.IsDeleted == false).ToList();
            foreach(var entity in entities) { response.Add(new GalleryDto(entity)); }    
            return response;
        }


        public GalleryDto GetById(int id)
        {
            return new GalleryDto(repository.GetAll().Where(x => x.Id == id && x.IsDeleted == false).FirstOrDefault());
        }

        protected readonly IUow uow;
        protected readonly IRepository<Gallery> repository;
        protected readonly ICache cache;
    }
}
