using System;
using System.Collections.Generic;
using QuinntyneBrown.Data;
using QuinntyneBrown.Dtos;
using System.Data.Entity;
using System.Linq;
using QuinntyneBrown.Models;

namespace QuinntyneBrown.Services
{
    public class ServiceProviderService : IServiceProviderService
    {
        public ServiceProviderService(IUow uow, ICacheProvider cacheProvider)
        {
            this.uow = uow;
            this.repository = uow.ServiceProviders;
            this.cache = cacheProvider.GetCache();
        }

        public ServiceProviderAddOrUpdateResponseDto AddOrUpdate(ServiceProviderAddOrUpdateRequestDto request)
        {
            var entity = repository.GetAll()
                .FirstOrDefault(x => x.Id == request.Id && x.IsDeleted == false);
            if (entity == null) repository.Add(entity = new ServiceProvider());
            entity.Name = request.Name;
            uow.SaveChanges();
            return new ServiceProviderAddOrUpdateResponseDto(entity);
        }

        public dynamic Remove(int id)
        {
            var entity = repository.GetById(id);
            entity.IsDeleted = true;
            uow.SaveChanges();
            return id;
        }

        public ICollection<ServiceProviderDto> Get()
        {
            ICollection<ServiceProviderDto> response = new HashSet<ServiceProviderDto>();
            var entities = repository.GetAll().Where(x => x.IsDeleted == false).ToList();
            foreach(var entity in entities) { response.Add(new ServiceProviderDto(entity)); }    
            return response;
        }


        public ServiceProviderDto GetById(int id)
        {
            return new ServiceProviderDto(repository.GetAll().Where(x => x.Id == id && x.IsDeleted == false).FirstOrDefault());
        }

        protected readonly IUow uow;
        protected readonly IRepository<ServiceProvider> repository;
        protected readonly ICache cache;
    }
}
