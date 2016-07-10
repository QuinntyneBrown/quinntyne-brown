using QuinntyneBrown.Dtos;
using QuinntyneBrown.Services;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;

namespace QuinntyneBrown.Controllers
{
    [Authorize]
    [RoutePrefix("api/photographer")]
    public class PhotographerController : ApiController
    {
        public PhotographerController(IPhotographerService photographerService)
        {
            _photographerService = photographerService;
        }

        [Route("add")]
        [HttpPost]
        [ResponseType(typeof(PhotographerAddOrUpdateResponseDto))]
        public IHttpActionResult Add(PhotographerAddOrUpdateRequestDto dto) { return Ok(_photographerService.AddOrUpdate(dto)); }

        [Route("update")]
        [HttpPut]
        [ResponseType(typeof(PhotographerAddOrUpdateResponseDto))]
        public IHttpActionResult Update(PhotographerAddOrUpdateRequestDto dto) { return Ok(_photographerService.AddOrUpdate(dto)); }

        [Route("get")]
        [AllowAnonymous]
        [HttpGet]
        [ResponseType(typeof(ICollection<PhotographerDto>))]
        public IHttpActionResult Get() { return Ok(_photographerService.Get()); }

        [Route("getById")]
        [HttpGet]
        [ResponseType(typeof(PhotographerDto))]
        public IHttpActionResult GetById(int id) { return Ok(_photographerService.GetById(id)); }

        [Route("remove")]
        [HttpDelete]
        [ResponseType(typeof(int))]
        public IHttpActionResult Remove(int id) { return Ok(_photographerService.Remove(id)); }

        protected readonly IPhotographerService _photographerService;


    }
}
