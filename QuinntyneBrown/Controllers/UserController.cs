using QuinntyneBrown.Data;
using QuinntyneBrown.Dtos;
using QuinntyneBrown.Services;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;
using System.Linq;
using QuinntyneBrown.Models;

namespace QuinntyneBrown.Controllers
{
    [Authorize]
    [RoutePrefix("api/user")]
    public class UserController : ApiController
    {
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [Route("add")]
        [HttpPost]
        [ResponseType(typeof(UserAddOrUpdateResponseDto))]
        public IHttpActionResult Add(UserAddOrUpdateRequestDto dto) { return Ok(_userService.AddOrUpdate(dto)); }

        [Route("update")]
        [HttpPut]
        [ResponseType(typeof(UserAddOrUpdateResponseDto))]
        public IHttpActionResult Update(UserAddOrUpdateRequestDto dto) { return Ok(_userService.AddOrUpdate(dto)); }

        [Route("get")]
        [AllowAnonymous]
        [HttpGet]
        [ResponseType(typeof(ICollection<UserDto>))]
        public IHttpActionResult Get() { return Ok(_userService.Get()); }

        [Route("getById")]
        [HttpGet]
        [ResponseType(typeof(UserDto))]
        public IHttpActionResult GetById(int id) { return Ok(_userService.GetById(id)); }

        [Route("remove")]
        [HttpDelete]
        [ResponseType(typeof(int))]
        public IHttpActionResult Remove(int id) { return Ok(_userService.Remove(id)); }

        [HttpPost]
        [Route("register")]
        [AllowAnonymous]
        public IHttpActionResult Register(RegistrationRequestDto request)
        {
            return Ok(_userService.Register(request));
        }

        [HttpGet]
        [Route("current")]
        [AllowAnonymous]
        [ResponseType(typeof(CurrentUserResponseDto))]
        public IHttpActionResult Current()
        {
            if (!User.Identity.IsAuthenticated)
                return Ok();

            return Ok(_userService.Current(User.Identity.Name));
        }

        protected readonly IUserService _userService;
        protected readonly Uow uow;   
    }
}
