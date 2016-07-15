using System;
using System.Collections.Generic;
using QuinntyneBrown.Data;
using QuinntyneBrown.Dtos;
using System.Data.Entity;
using System.Linq;
using QuinntyneBrown.Models;

namespace QuinntyneBrown.Services
{
    public class QuoteService : IQuoteService
    {
        public QuoteService(IUow uow, ICacheProvider cacheProvider)
        {
            this.uow = uow;
            this.repository = uow.Quotes;
            this.cache = cacheProvider.GetCache();
        }

        public QuoteAddOrUpdateResponseDto AddOrUpdate(QuoteAddOrUpdateRequestDto request)
        {
            var entity = repository.GetAll()
                .FirstOrDefault(x => x.Id == request.Id && x.IsDeleted == false);
            if (entity == null) repository.Add(entity = new Quote());
            entity.Name = request.Name;
            uow.SaveChanges();
            return new QuoteAddOrUpdateResponseDto(entity);
        }

        public dynamic Remove(int id)
        {
            var entity = repository.GetById(id);
            entity.IsDeleted = true;
            uow.SaveChanges();
            return id;
        }

        public ICollection<QuoteDto> Get()
        {
            ICollection<QuoteDto> response = new HashSet<QuoteDto>();
            var entities = repository.GetAll().Where(x => x.IsDeleted == false).ToList();
            foreach(var entity in entities) { response.Add(new QuoteDto(entity)); }    
            return response;
        }


        public QuoteDto GetById(int id)
        {
            return new QuoteDto(repository.GetAll().Where(x => x.Id == id && x.IsDeleted == false).FirstOrDefault());
        }

        protected readonly IUow uow;
        protected readonly IRepository<Quote> repository;
        protected readonly ICache cache;
    }
}
