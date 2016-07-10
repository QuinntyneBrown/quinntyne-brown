using QuinntyneBrown.Services;
using System.ServiceModel.Syndication;
using System.Web.Http;
using System.Web.Http.Description;

namespace QuinntyneBrown.Controllers
{
    [AllowAnonymous]
    [RoutePrefix("api/rss")]
    public class RssFeedController: ApiController
    {
        public RssFeedController(IRssFeedService rssFeedService)
        {
            _rssFeedService = rssFeedService;
        }

        [Route("get")]
        [ResponseType(typeof(Rss20FeedFormatter))]
        public Rss20FeedFormatter Get() => new Rss20FeedFormatter(_rssFeedService.Get());

        protected readonly IRssFeedService _rssFeedService;
    }
}
