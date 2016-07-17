using QuinntyneBrown.Dtos;
using QuinntyneBrown.Services;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;

namespace QuinntyneBrown.Controllers
{
    [Authorize]
    [RoutePrefix("api/serviceProvider")]
    public class ServiceProviderController : ApiController
    {
        public ServiceProviderController(IServiceProviderService serviceProviderService)
        {
            _serviceProviderService = serviceProviderService;
        }

        [Route("add")]
        [HttpPost]
        [ResponseType(typeof(ServiceProviderAddOrUpdateResponseDto))]
        public IHttpActionResult Add(ServiceProviderAddOrUpdateRequestDto dto) { return Ok(_serviceProviderService.AddOrUpdate(dto)); }

        [Route("update")]
        [HttpPut]
        [ResponseType(typeof(ServiceProviderAddOrUpdateResponseDto))]
        public IHttpActionResult Update(ServiceProviderAddOrUpdateRequestDto dto) { return Ok(_serviceProviderService.AddOrUpdate(dto)); }

        [Route("get")]
        [AllowAnonymous]
        [HttpGet]
        [ResponseType(typeof(ICollection<ServiceProviderDto>))]
        public IHttpActionResult Get() { return Ok(_serviceProviderService.Get()); }

        [Route("getById")]
        [HttpGet]
        [ResponseType(typeof(ServiceProviderDto))]
        public IHttpActionResult GetById(int id) { return Ok(_serviceProviderService.GetById(id)); }

        [Route("remove")]
        [HttpDelete]
        [ResponseType(typeof(int))]
        public IHttpActionResult Remove(int id) { return Ok(_serviceProviderService.Remove(id)); }

        protected readonly IServiceProviderService _serviceProviderService;


    }
}
