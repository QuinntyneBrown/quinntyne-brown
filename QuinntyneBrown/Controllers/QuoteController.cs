using QuinntyneBrown.Dtos;
using QuinntyneBrown.Services;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;

namespace QuinntyneBrown.Controllers
{
    [Authorize]
    [RoutePrefix("api/quote")]
    public class QuoteController : ApiController
    {
        public QuoteController(IQuoteService quoteService)
        {
            _quoteService = quoteService;
        }

        [Route("add")]
        [HttpPost]
        [ResponseType(typeof(QuoteAddOrUpdateResponseDto))]
        public IHttpActionResult Add(QuoteAddOrUpdateRequestDto dto) { return Ok(_quoteService.AddOrUpdate(dto)); }

        [Route("update")]
        [HttpPut]
        [ResponseType(typeof(QuoteAddOrUpdateResponseDto))]
        public IHttpActionResult Update(QuoteAddOrUpdateRequestDto dto) { return Ok(_quoteService.AddOrUpdate(dto)); }

        [Route("get")]
        [AllowAnonymous]
        [HttpGet]
        [ResponseType(typeof(ICollection<QuoteDto>))]
        public IHttpActionResult Get() { return Ok(_quoteService.Get()); }

        [Route("getById")]
        [HttpGet]
        [ResponseType(typeof(QuoteDto))]
        public IHttpActionResult GetById(int id) { return Ok(_quoteService.GetById(id)); }

        [Route("remove")]
        [HttpDelete]
        [ResponseType(typeof(int))]
        public IHttpActionResult Remove(int id) { return Ok(_quoteService.Remove(id)); }

        protected readonly IQuoteService _quoteService;


    }
}
