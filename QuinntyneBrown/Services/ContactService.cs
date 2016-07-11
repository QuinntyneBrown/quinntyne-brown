using System;
using System.Collections.Generic;
using QuinntyneBrown.Data;
using QuinntyneBrown.Dtos;
using System.Data.Entity;
using System.Linq;
using QuinntyneBrown.Models;

namespace QuinntyneBrown.Services
{
    public class ContactService : IContactService
    {
        public ContactService(IUow uow, ICacheProvider cacheProvider)
        {
            this.uow = uow;
            this.repository = uow.Contacts;
            this.cache = cacheProvider.GetCache();
        }

        public ContactAddOrUpdateResponseDto AddOrUpdate(ContactAddOrUpdateRequestDto request)
        {
            var entity = repository.GetAll()
                .FirstOrDefault(x => x.Id == request.Id && x.IsDeleted == false);
            if (entity == null) repository.Add(entity = new Contact());
            entity.Name = request.Name;
            uow.SaveChanges();
            return new ContactAddOrUpdateResponseDto(entity);
        }

        public dynamic Remove(int id)
        {
            var entity = repository.GetById(id);
            entity.IsDeleted = true;
            uow.SaveChanges();
            return id;
        }

        public ICollection<ContactDto> Get()
        {
            ICollection<ContactDto> response = new HashSet<ContactDto>();
            var entities = repository.GetAll().Where(x => x.IsDeleted == false).ToList();
            foreach(var entity in entities) { response.Add(new ContactDto(entity)); }    
            return response;
        }


        public ContactDto GetById(int id)
        {
            return new ContactDto(repository.GetAll().Where(x => x.Id == id && x.IsDeleted == false).FirstOrDefault());
        }

        protected readonly IUow uow;
        protected readonly IRepository<Contact> repository;
        protected readonly ICache cache;
    }
}
