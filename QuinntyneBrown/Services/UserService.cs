using System;
using System.Collections.Generic;
using QuinntyneBrown.Data;
using QuinntyneBrown.Dtos;
using System.Data.Entity;
using System.Linq;
using QuinntyneBrown.Models;

namespace QuinntyneBrown.Services
{
    public class UserService : IUserService
    {
        public UserService(ICacheProvider cacheProvider, IUow uow, IEncryptionService encryptionService)
        {
            _uow = uow;
            _encryptionService = encryptionService;
            _cache = cacheProvider.GetCache();
        }

        public RegistrationResponseDto Register(RegistrationRequestDto request)
        {
            if (_uow.Users.GetAll().Where(x => x.Username == request.EmailAddress).FirstOrDefault() == null)
            {
                User user = new User()
                {
                    Firstname = request.Firstname,
                    Lastname = request.Lastname,
                    Email = request.EmailAddress,
                    Username = request.EmailAddress,
                    Password = _encryptionService.TransformPassword(request.Password)
                };
                _uow.Users.Add(user);
                _uow.SaveChanges();
            }

            return new RegistrationResponseDto();
        }

        public CurrentUserResponseDto Current(string username)
            => new CurrentUserResponseDto(_uow.Users
                .GetAll()
                .Where(x => x.IsDeleted == false)
                .Single(x => x.Username == username));

        public UserAddOrUpdateResponseDto AddOrUpdate(UserAddOrUpdateRequestDto request)
        {
            var entity = _repository.GetAll()
                .FirstOrDefault(x => x.Id == request.Id && x.IsDeleted == false);
            if (entity == null) _repository.Add(entity = new User());
            entity.Name = request.Name;
            _uow.SaveChanges();
            return new UserAddOrUpdateResponseDto(entity);
        }

        public dynamic Remove(int id)
        {
            var entity = _repository.GetById(id);
            entity.IsDeleted = true;
            _uow.SaveChanges();
            return id;
        }

        public ICollection<UserDto> Get()
        {
            ICollection<UserDto> response = new HashSet<UserDto>();
            var entities = _repository.GetAll().Where(x => x.IsDeleted == false).ToList();
            foreach(var entity in entities) { response.Add(new UserDto(entity)); }    
            return response;
        }


        public UserDto GetById(int id)
        {
            return new UserDto(_repository.GetAll().Where(x => x.Id == id && x.IsDeleted == false).FirstOrDefault());
        }

        protected readonly IUow _uow;
        protected readonly IRepository<User> _repository;
        protected readonly ICache _cache;
        protected readonly IEncryptionService _encryptionService;
    }
}
