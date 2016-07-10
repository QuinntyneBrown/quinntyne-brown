using QuinntyneBrown.Dtos;
using QuinntyneBrown.Services;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;

namespace QuinntyneBrown.Controllers
{
    [Authorize]
    [RoutePrefix("api/customer")]
    public class CustomerController : ApiController
    {
        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [Route("add")]
        [HttpPost]
        [ResponseType(typeof(CustomerAddOrUpdateResponseDto))]
        public IHttpActionResult Add(CustomerAddOrUpdateRequestDto dto) { return Ok(_customerService.AddOrUpdate(dto)); }

        [Route("update")]
        [HttpPut]
        [ResponseType(typeof(CustomerAddOrUpdateResponseDto))]
        public IHttpActionResult Update(CustomerAddOrUpdateRequestDto dto) { return Ok(_customerService.AddOrUpdate(dto)); }

        [Route("get")]
        [AllowAnonymous]
        [HttpGet]
        [ResponseType(typeof(ICollection<CustomerDto>))]
        public IHttpActionResult Get() { return Ok(_customerService.Get()); }

        [Route("getById")]
        [HttpGet]
        [ResponseType(typeof(CustomerDto))]
        public IHttpActionResult GetById(int id) { return Ok(_customerService.GetById(id)); }

        [Route("remove")]
        [HttpDelete]
        [ResponseType(typeof(int))]
        public IHttpActionResult Remove(int id) { return Ok(_customerService.Remove(id)); }

        protected readonly ICustomerService _customerService;


    }
}
