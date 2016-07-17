using System;
using System.Collections.Generic;
using QuinntyneBrown.Data;
using QuinntyneBrown.Dtos;
using System.Data.Entity;
using System.Linq;
using QuinntyneBrown.Models;

namespace QuinntyneBrown.Services
{
    public class ProfessionalServiceService : IProfessionalServiceService
    {
        public ProfessionalServiceService(IUow uow, ICacheProvider cacheProvider)
        {
            this.uow = uow;
            this.repository = uow.ProfessionalServices;
            this.cache = cacheProvider.GetCache();
        }

        public ProfessionalServiceAddOrUpdateResponseDto AddOrUpdate(ProfessionalServiceAddOrUpdateRequestDto request)
        {
            var entity = repository.GetAll()
                .FirstOrDefault(x => x.Id == request.Id && x.IsDeleted == false);
            if (entity == null) repository.Add(entity = new ProfessionalService());
            entity.Name = request.Name;
            uow.SaveChanges();
            return new ProfessionalServiceAddOrUpdateResponseDto(entity);
        }

        public dynamic Remove(int id)
        {
            var entity = repository.GetById(id);
            entity.IsDeleted = true;
            uow.SaveChanges();
            return id;
        }

        public ICollection<ProfessionalServiceDto> Get()
        {
            ICollection<ProfessionalServiceDto> response = new HashSet<ProfessionalServiceDto>();
            var entities = repository.GetAll().Where(x => x.IsDeleted == false).ToList();
            foreach(var entity in entities) { response.Add(new ProfessionalServiceDto(entity)); }    
            return response;
        }


        public ProfessionalServiceDto GetById(int id)
        {
            return new ProfessionalServiceDto(repository.GetAll().Where(x => x.Id == id && x.IsDeleted == false).FirstOrDefault());
        }

        protected readonly IUow uow;
        protected readonly IRepository<ProfessionalService> repository;
        protected readonly ICache cache;
    }
}
