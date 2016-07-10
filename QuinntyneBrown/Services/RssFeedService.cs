using System;
using System.Linq;
using System.ServiceModel.Syndication;

namespace QuinntyneBrown.Services
{
    public class RssFeedService : IRssFeedService
    {
        public RssFeedService(ICacheProvider cacheProvider, IArticleService articleService)
        {
            _cache = cacheProvider.GetCache();
            _articleService = articleService;
        }

        public SyndicationFeed Get()
        {
            return new SyndicationFeed("Digital Architecture","A blog about Digital Architecture",new Uri("http://QuinntyneBrown.ca"))
            {
                Items = _articleService.Get().Select(x => new SyndicationItem(
                    x.Headline,
                    x.Excerpt,
                    new Uri(x.Url),
                    $"{x.Id}",
                    x.DateModified.Value)).ToList()
            };              
        }

        protected readonly ICache _cache;
        protected readonly IArticleService _articleService;
    }
}
