using QuinntyneBrown.Dtos;
using QuinntyneBrown.Services;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;

namespace QuinntyneBrown.Controllers
{
    [Authorize]
    [RoutePrefix("api/menuItem")]
    public class MenuItemController : ApiController
    {
        public MenuItemController(IMenuItemService menuItemService)
        {
            _menuItemService = menuItemService;
        }

        [Route("add")]
        [HttpPost]
        [ResponseType(typeof(MenuItemAddOrUpdateResponseDto))]
        public IHttpActionResult Add(MenuItemAddOrUpdateRequestDto dto) { return Ok(_menuItemService.AddOrUpdate(dto)); }

        [Route("update")]
        [HttpPut]
        [ResponseType(typeof(MenuItemAddOrUpdateResponseDto))]
        public IHttpActionResult Update(MenuItemAddOrUpdateRequestDto dto) { return Ok(_menuItemService.AddOrUpdate(dto)); }

        [Route("get")]
        [AllowAnonymous]
        [HttpGet]
        [ResponseType(typeof(ICollection<MenuItemDto>))]
        public IHttpActionResult Get() { return Ok(_menuItemService.Get()); }

        [Route("getById")]
        [HttpGet]
        [ResponseType(typeof(MenuItemDto))]
        public IHttpActionResult GetById(int id) { return Ok(_menuItemService.GetById(id)); }

        [Route("remove")]
        [HttpDelete]
        [ResponseType(typeof(int))]
        public IHttpActionResult Remove(int id) { return Ok(_menuItemService.Remove(id)); }

        protected readonly IMenuItemService _menuItemService;


    }
}
