using System;
using System.Linq;
using System.ServiceModel.Syndication;
using static QuinntyneBrown.Common.Constants;

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
            return new SyndicationFeed(BlogTitle,BlogDescription,new Uri(BlogUrl))
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
