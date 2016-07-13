using QuinntyneBrown.Dtos;
using QuinntyneBrown.Services;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;

namespace QuinntyneBrown.Controllers
{
    [Authorize]
    [RoutePrefix("api/contact")]
    public class ContactController : ApiController
    {
        public ContactController(IContactService contactService)
        {
            _contactService = contactService;
        }

        [Route("add")]
        [HttpPost]
        [AllowAnonymous]
        [ResponseType(typeof(ContactAddOrUpdateResponseDto))]
        public IHttpActionResult Add(ContactAddOrUpdateRequestDto dto) { return Ok(_contactService.AddOrUpdate(dto)); }

        [Route("update")]
        [HttpPut]
        [ResponseType(typeof(ContactAddOrUpdateResponseDto))]
        public IHttpActionResult Update(ContactAddOrUpdateRequestDto dto) { return Ok(_contactService.AddOrUpdate(dto)); }

        [Route("get")]
        [AllowAnonymous]
        [HttpGet]
        [ResponseType(typeof(ICollection<ContactDto>))]
        public IHttpActionResult Get() { return Ok(_contactService.Get()); }

        [Route("getById")]
        [HttpGet]
        [ResponseType(typeof(ContactDto))]
        public IHttpActionResult GetById(int id) { return Ok(_contactService.GetById(id)); }

        [Route("remove")]
        [HttpDelete]
        [ResponseType(typeof(int))]
        public IHttpActionResult Remove(int id) { return Ok(_contactService.Remove(id)); }

        protected readonly IContactService _contactService;


    }
}
