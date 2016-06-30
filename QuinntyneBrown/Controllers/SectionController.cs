using QuinntyneBrown.Dtos;
using QuinntyneBrown.Services;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;

namespace QuinntyneBrown.Controllers
{
    [Authorize]
    [RoutePrefix("api/section")]
    public class SectionController : ApiController
    {
        public SectionController(ISectionService sectionService)
        {
            _sectionService = sectionService;
        }

        [Route("add")]
        [HttpPost]
        [ResponseType(typeof(SectionAddOrUpdateResponseDto))]
        public IHttpActionResult Add(SectionAddOrUpdateRequestDto dto) { return Ok(_sectionService.AddOrUpdate(dto)); }

        [Route("update")]
        [HttpPut]
        [ResponseType(typeof(SectionAddOrUpdateResponseDto))]
        public IHttpActionResult Update(SectionAddOrUpdateRequestDto dto) { return Ok(_sectionService.AddOrUpdate(dto)); }

        [Route("get")]
        [AllowAnonymous]
        [HttpGet]
        [ResponseType(typeof(ICollection<SectionDto>))]
        public IHttpActionResult Get() { return Ok(_sectionService.Get()); }

        [Route("getById")]
        [HttpGet]
        [ResponseType(typeof(SectionDto))]
        public IHttpActionResult GetById(int id) { return Ok(_sectionService.GetById(id)); }

        [Route("remove")]
        [HttpDelete]
        [ResponseType(typeof(int))]
        public IHttpActionResult Remove(int id) { return Ok(_sectionService.Remove(id)); }

        protected readonly ISectionService _sectionService;        
    }
}
