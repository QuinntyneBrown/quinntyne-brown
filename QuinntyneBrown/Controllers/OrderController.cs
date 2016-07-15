using QuinntyneBrown.Dtos;
using QuinntyneBrown.Services;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;

namespace QuinntyneBrown.Controllers
{
    [Authorize]
    [RoutePrefix("api/order")]
    public class OrderController : ApiController
    {
        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [Route("add")]
        [HttpPost]
        [ResponseType(typeof(OrderAddOrUpdateResponseDto))]
        public IHttpActionResult Add(OrderAddOrUpdateRequestDto dto) { return Ok(_orderService.AddOrUpdate(dto)); }

        [Route("update")]
        [HttpPut]
        [ResponseType(typeof(OrderAddOrUpdateResponseDto))]
        public IHttpActionResult Update(OrderAddOrUpdateRequestDto dto) { return Ok(_orderService.AddOrUpdate(dto)); }

        [Route("get")]
        [AllowAnonymous]
        [HttpGet]
        [ResponseType(typeof(ICollection<OrderDto>))]
        public IHttpActionResult Get() { return Ok(_orderService.Get()); }

        [Route("getById")]
        [HttpGet]
        [ResponseType(typeof(OrderDto))]
        public IHttpActionResult GetById(int id) { return Ok(_orderService.GetById(id)); }

        [Route("remove")]
        [HttpDelete]
        [ResponseType(typeof(int))]
        public IHttpActionResult Remove(int id) { return Ok(_orderService.Remove(id)); }

        protected readonly IOrderService _orderService;


    }
}
