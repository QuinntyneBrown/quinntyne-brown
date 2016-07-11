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
            _uow = uow;
            _repository = uow.Galleries;
            _cache = cacheProvider.GetCache();
        }

        public GalleryAddOrUpdateResponseDto AddOrUpdate(GalleryAddOrUpdateRequestDto request)
        {
            var entity = GetAll()
                .FirstOrDefault(x => x.Id == request.Id && x.IsDeleted == false);
            if (entity == null) _repository.Add(entity = new Gallery());
            entity.Name = request.Name;
            entity.Description = request.Description;
            entity.Headline = request.Headline;
            entity.AlternateHeadline = request.AlternateHeadline;

            entity.GalleryCategories.Clear();
            entity.PhotographerGalleries.Clear();
            entity.GalleryPhotos.Clear();

            foreach (var category in request.Categories)
            {
                entity.GalleryCategories.Add(new GalleryCategory()
                {
                    Category= _uow.Categories.GetById(category.Id)
                });
            }

            foreach (var photo in request.Photos)
            {
                entity.GalleryPhotos.Add(new GalleryPhoto()
                {
                    Photo = _uow.Photos.GetById(photo.Id)
                });
            }

            foreach (var photographer in request.Photographers)
            {
                entity.PhotographerGalleries.Add(new PhotographerGallery()
                {
                    Photographer = _uow.Photographers.GetById(photographer.Id)
                });
            }

            _uow.SaveChanges();
            return new GalleryAddOrUpdateResponseDto(entity);
        }

        public dynamic Remove(int id)
        {
            var entity = _repository.GetById(id);
            entity.IsDeleted = true;
            _uow.SaveChanges();
            return id;
        }

        public ICollection<GalleryDto> Get()
        {
            ICollection<GalleryDto> response = new HashSet<GalleryDto>();
            var entities = GetAll().Where(x => x.IsDeleted == false).ToList();
            foreach(var entity in entities) { response.Add(new GalleryDto(entity)); }    
            return response;
        }


        public GalleryDto GetById(int id)
        {
            return new GalleryDto(GetAll().Where(x => x.Id == id && x.IsDeleted == false).FirstOrDefault());
        }

        public IQueryable<Gallery> GetAll() => _repository.GetAll()
            .Include(x => x.GalleryPhotos)
            .Include(x => x.CustomerGalleries)
            .Include(x => x.PhotographerGalleries)
            .Include("GalleryPhotos.Photo")
            .Include("PhotographerGalleries.Photographer")
            .Include("CustomerGalleries.Customer")
            .Where(x => x.IsDeleted == false);

        protected readonly IUow _uow;
        protected readonly IRepository<Gallery> _repository;
        protected readonly ICache _cache;
    }
}
