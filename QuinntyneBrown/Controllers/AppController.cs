using QuinntyneBrown.Dtos;
using QuinntyneBrown.Services;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;

namespace QuinntyneBrown.Controllers
{
    [Authorize]
    [RoutePrefix("api/app")]
    public class AppController : ApiController
    {
        public AppController(IAppService appService)
        {
            _appService = appService;
        }

        [Route("add")]
        [HttpPost]
        [ResponseType(typeof(AppAddOrUpdateResponseDto))]
        public IHttpActionResult Add(AppAddOrUpdateRequestDto dto) { return Ok(_appService.AddOrUpdate(dto)); }

        [Route("update")]
        [HttpPut]
        [ResponseType(typeof(AppAddOrUpdateResponseDto))]
        public IHttpActionResult Update(AppAddOrUpdateRequestDto dto) { return Ok(_appService.AddOrUpdate(dto)); }

        [Route("get")]
        [AllowAnonymous]
        [HttpGet]
        [ResponseType(typeof(ICollection<AppDto>))]
        public IHttpActionResult Get() { return Ok(_appService.Get()); }

        [Route("getById")]
        [HttpGet]
        [ResponseType(typeof(AppDto))]
        public IHttpActionResult GetById(int id) { return Ok(_appService.GetById(id)); }

        [Route("remove")]
        [HttpDelete]
        [ResponseType(typeof(int))]
        public IHttpActionResult Remove(int id) { return Ok(_appService.Remove(id)); }

        protected readonly IAppService _appService;


    }
}
