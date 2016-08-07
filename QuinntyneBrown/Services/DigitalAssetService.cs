using System;
using System.Collections.Generic;
using QuinntyneBrown.Data;
using QuinntyneBrown.Dtos;
using System.Data.Entity;
using System.Linq;
using QuinntyneBrown.Models;

namespace QuinntyneBrown.Services
{
    public class DigitalAssetService : IDigitalAssetService
    {
        public DigitalAssetService(IUow uow, ICacheProvider cacheProvider)
        {
            this.uow = uow;
            this._repository = uow.Photos;
            this.cache = cacheProvider.GetCache();
        }

        public DigitalAssetAddOrUpdateResponseDto AddOrUpdate(DigitalAssetAddOrUpdateRequestDto request)
        {
            var entity = _repository.GetAll()
                .FirstOrDefault(x => x.Id == request.Id && x.IsDeleted == false);
            if (entity == null) _repository.Add(entity = new DigitalAsset());
            entity.Name = request.Name;
            uow.SaveChanges();
            return new DigitalAssetAddOrUpdateResponseDto(entity);
        }

        public dynamic Remove(int id)
        {
            var entity = _repository.GetById(id);
            entity.IsDeleted = true;
            uow.SaveChanges();
            return id;
        }

        public ICollection<DigitalAssetDto> Get()
        {
            ICollection<DigitalAssetDto> response = new HashSet<DigitalAssetDto>();
            var entities = _repository.GetAll().Where(x => x.IsDeleted == false).ToList();
            foreach(var entity in entities) { response.Add(new DigitalAssetDto(entity)); }    
            return response;
        }


        public DigitalAssetDto GetById(int id)
        {
            return new DigitalAssetDto(_repository.GetAll().Where(x => x.Id == id && x.IsDeleted == false).FirstOrDefault());
        }

        public IQueryable<DigitalAsset> GetAll() => _repository.GetAll()
            .Include(x=>x.GalleryDigitalAssets)
            .Include(x=>x.ServiceProviderDigitalAssets)
            .Include(x=>x.ArticleDigitalAssets)
            .Include("GalleryPhotos.Gallery")
            .Include("PhotographerPhotos.Photographer")
            .Include("ArticlePhotos.Article")
            .Where(x => x.IsDeleted == false);

        protected readonly IUow uow;
        protected readonly IRepository<DigitalAsset> _repository;
        protected readonly ICache cache;
    }
}
