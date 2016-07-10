using QuinntyneBrown.Dtos;
using QuinntyneBrown.Services;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;

namespace QuinntyneBrown.Controllers
{
    [Authorize]
    [RoutePrefix("api/gallery")]
    public class GalleryController : ApiController
    {
        public GalleryController(IGalleryService galleryService)
        {
            _galleryService = galleryService;
        }

        [Route("add")]
        [HttpPost]
        [ResponseType(typeof(GalleryAddOrUpdateResponseDto))]
        public IHttpActionResult Add(GalleryAddOrUpdateRequestDto dto) { return Ok(_galleryService.AddOrUpdate(dto)); }

        [Route("update")]
        [HttpPut]
        [ResponseType(typeof(GalleryAddOrUpdateResponseDto))]
        public IHttpActionResult Update(GalleryAddOrUpdateRequestDto dto) { return Ok(_galleryService.AddOrUpdate(dto)); }

        [Route("get")]
        [AllowAnonymous]
        [HttpGet]
        [ResponseType(typeof(ICollection<GalleryDto>))]
        public IHttpActionResult Get() { return Ok(_galleryService.Get()); }

        [Route("getById")]
        [HttpGet]
        [ResponseType(typeof(GalleryDto))]
        public IHttpActionResult GetById(int id) { return Ok(_galleryService.GetById(id)); }

        [Route("remove")]
        [HttpDelete]
        [ResponseType(typeof(int))]
        public IHttpActionResult Remove(int id) { return Ok(_galleryService.Remove(id)); }

        protected readonly IGalleryService _galleryService;


    }
}
