using System;
using System.Collections.Generic;
using QuinntyneBrown.Data;
using QuinntyneBrown.Dtos;
using System.Data.Entity;
using System.Linq;
using QuinntyneBrown.Models;

namespace QuinntyneBrown.Services
{
    public class OrderService : IOrderService
    {
        public OrderService(IUow uow, ICacheProvider cacheProvider)
        {
            this.uow = uow;
            this.repository = uow.Orders;
            this.cache = cacheProvider.GetCache();
        }

        public OrderAddOrUpdateResponseDto AddOrUpdate(OrderAddOrUpdateRequestDto request)
        {
            var entity = repository.GetAll()
                .FirstOrDefault(x => x.Id == request.Id && x.IsDeleted == false);
            if (entity == null) repository.Add(entity = new Order());
            entity.Name = request.Name;
            uow.SaveChanges();
            return new OrderAddOrUpdateResponseDto(entity);
        }

        public dynamic Remove(int id)
        {
            var entity = repository.GetById(id);
            entity.IsDeleted = true;
            uow.SaveChanges();
            return id;
        }

        public ICollection<OrderDto> Get()
        {
            ICollection<OrderDto> response = new HashSet<OrderDto>();
            var entities = repository.GetAll().Where(x => x.IsDeleted == false).ToList();
            foreach(var entity in entities) { response.Add(new OrderDto(entity)); }    
            return response;
        }


        public OrderDto GetById(int id)
        {
            return new OrderDto(repository.GetAll().Where(x => x.Id == id && x.IsDeleted == false).FirstOrDefault());
        }

        protected readonly IUow uow;
        protected readonly IRepository<Order> repository;
        protected readonly ICache cache;
    }
}
