using QuinntyneBrown.Dtos;
using QuinntyneBrown.Services;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;

namespace QuinntyneBrown.Controllers
{
    [Authorize]
    [RoutePrefix("api/uI")]
    public class UIController : ApiController
    {
        public UIController(IUIService uIService)
        {
            _uIService = uIService;
        }

        [Route("add")]
        [HttpPost]
        [ResponseType(typeof(UIAddOrUpdateResponseDto))]
        public IHttpActionResult Add(UIAddOrUpdateRequestDto dto) { return Ok(_uIService.AddOrUpdate(dto)); }

        [Route("update")]
        [HttpPut]
        [ResponseType(typeof(UIAddOrUpdateResponseDto))]
        public IHttpActionResult Update(UIAddOrUpdateRequestDto dto) { return Ok(_uIService.AddOrUpdate(dto)); }

        [Route("get")]
        [AllowAnonymous]
        [HttpGet]
        [ResponseType(typeof(ICollection<UIDto>))]
        public IHttpActionResult Get() { return Ok(_uIService.Get()); }

        [Route("getById")]
        [HttpGet]
        [ResponseType(typeof(UIDto))]
        public IHttpActionResult GetById(int id) { return Ok(_uIService.GetById(id)); }

        [Route("remove")]
        [HttpDelete]
        [ResponseType(typeof(int))]
        public IHttpActionResult Remove(int id) { return Ok(_uIService.Remove(id)); }

        protected readonly IUIService _uIService;


    }
}
