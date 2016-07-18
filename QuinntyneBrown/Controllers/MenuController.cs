using QuinntyneBrown.Dtos;
using QuinntyneBrown.Services;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;

namespace QuinntyneBrown.Controllers
{
    [Authorize]
    [RoutePrefix("api/menu")]
    public class MenuController : ApiController
    {
        public MenuController(IMenuService menuService)
        {
            _menuService = menuService;
        }

        [Route("add")]
        [HttpPost]
        [ResponseType(typeof(MenuAddOrUpdateResponseDto))]
        public IHttpActionResult Add(MenuAddOrUpdateRequestDto dto) { return Ok(_menuService.AddOrUpdate(dto)); }

        [Route("update")]
        [HttpPut]
        [ResponseType(typeof(MenuAddOrUpdateResponseDto))]
        public IHttpActionResult Update(MenuAddOrUpdateRequestDto dto) { return Ok(_menuService.AddOrUpdate(dto)); }

        [Route("get")]
        [AllowAnonymous]
        [HttpGet]
        [ResponseType(typeof(ICollection<MenuDto>))]
        public IHttpActionResult Get() { return Ok(_menuService.Get()); }

        [Route("getById")]
        [HttpGet]
        [ResponseType(typeof(MenuDto))]
        public IHttpActionResult GetById(int id) { return Ok(_menuService.GetById(id)); }

        [Route("remove")]
        [HttpDelete]
        [ResponseType(typeof(int))]
        public IHttpActionResult Remove(int id) { return Ok(_menuService.Remove(id)); }

        protected readonly IMenuService _menuService;


    }
}
