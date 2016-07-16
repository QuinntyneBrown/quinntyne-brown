using QuinntyneBrown.Dtos;
using QuinntyneBrown.Services;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;

namespace QuinntyneBrown.Controllers
{
    [Authorize]
    [RoutePrefix("api/socialshareitem")]
    public class SocialShareItemController : ApiController
    {
        public SocialShareItemController(ISocialShareItemService socialShareItemService)
        {
            _socialShareItemService = socialShareItemService;
        }

        [Route("add")]
        [HttpPost]
        [ResponseType(typeof(SocialShareItemAddOrUpdateResponseDto))]
        public IHttpActionResult Add(SocialShareItemAddOrUpdateRequestDto dto) { return Ok(_socialShareItemService.AddOrUpdate(dto)); }

        [Route("update")]
        [HttpPut]
        [ResponseType(typeof(SocialShareItemAddOrUpdateResponseDto))]
        public IHttpActionResult Update(SocialShareItemAddOrUpdateRequestDto dto) { return Ok(_socialShareItemService.AddOrUpdate(dto)); }

        [Route("get")]
        [AllowAnonymous]
        [HttpGet]
        [ResponseType(typeof(ICollection<SocialShareItemDto>))]
        public IHttpActionResult Get() { return Ok(_socialShareItemService.Get()); }

        [Route("getById")]
        [HttpGet]
        [ResponseType(typeof(SocialShareItemDto))]
        public IHttpActionResult GetById(int id) { return Ok(_socialShareItemService.GetById(id)); }

        [Route("remove")]
        [HttpDelete]
        [ResponseType(typeof(int))]
        public IHttpActionResult Remove(int id) { return Ok(_socialShareItemService.Remove(id)); }

        protected readonly ISocialShareItemService _socialShareItemService;


    }
}
