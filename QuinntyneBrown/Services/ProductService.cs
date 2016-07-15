using System;
using System.Collections.Generic;
using QuinntyneBrown.Data;
using QuinntyneBrown.Dtos;
using System.Data.Entity;
using System.Linq;
using QuinntyneBrown.Models;

namespace QuinntyneBrown.Services
{
    public class ProductService : IProductService
    {
        public ProductService(IUow uow, ICacheProvider cacheProvider)
        {
            this.uow = uow;
            this.repository = uow.Products;
            this.cache = cacheProvider.GetCache();
        }

        public ProductAddOrUpdateResponseDto AddOrUpdate(ProductAddOrUpdateRequestDto request)
        {
            var entity = repository.GetAll()
                .FirstOrDefault(x => x.Id == request.Id && x.IsDeleted == false);
            if (entity == null) repository.Add(entity = new Product());
            entity.Name = request.Name;
            uow.SaveChanges();
            return new ProductAddOrUpdateResponseDto(entity);
        }

        public dynamic Remove(int id)
        {
            var entity = repository.GetById(id);
            entity.IsDeleted = true;
            uow.SaveChanges();
            return id;
        }

        public ICollection<ProductDto> Get()
        {
            ICollection<ProductDto> response = new HashSet<ProductDto>();
            var entities = repository.GetAll().Where(x => x.IsDeleted == false).ToList();
            foreach(var entity in entities) { response.Add(new ProductDto(entity)); }    
            return response;
        }


        public ProductDto GetById(int id)
        {
            return new ProductDto(repository.GetAll().Where(x => x.Id == id && x.IsDeleted == false).FirstOrDefault());
        }

        protected readonly IUow uow;
        protected readonly IRepository<Product> repository;
        protected readonly ICache cache;
    }
}
