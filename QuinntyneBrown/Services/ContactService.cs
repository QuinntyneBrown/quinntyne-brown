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
            _uow = uow;
            _repository = uow.Contacts;
            _cache = cacheProvider.GetCache();
        }

        public ContactAddOrUpdateResponseDto AddOrUpdate(ContactAddOrUpdateRequestDto request)
        {
            var entity = _repository.GetAll()
                .FirstOrDefault(x => x.Id == request.Id && x.IsDeleted == false);
            if (entity == null) _repository.Add(entity = new Contact());
            entity.Name = request.Name;
            entity.Firstname = request.Firstname;
            entity.Lastname = request.Lastname;
            entity.PhoneNumber = request.PhoneNumber;
            entity.Email = request.Email;
            _uow.SaveChanges();
            return new ContactAddOrUpdateResponseDto(entity);
        }

        public dynamic Remove(int id)
        {
            var entity = _repository.GetById(id);
            entity.IsDeleted = true;
            _uow.SaveChanges();
            return id;
        }

        public ICollection<ContactDto> Get()
        {
            ICollection<ContactDto> response = new HashSet<ContactDto>();
            var entities = _repository.GetAll().Where(x => x.IsDeleted == false).ToList();
            foreach(var entity in entities) { response.Add(new ContactDto(entity)); }    
            return response;
        }


        public ContactDto GetById(int id)
        {
            return new ContactDto(_repository.GetAll().Where(x => x.Id == id && x.IsDeleted == false).FirstOrDefault());
        }

        public IQueryable<Contact> GetAll() => _repository.GetAll().Where(x => x.IsDeleted == false);

        protected readonly IUow _uow;
        protected readonly IRepository<Contact> _repository;
        protected readonly ICache _cache;
    }
}
