using System.ServiceModel.Syndication;

namespace QuinntyneBrown.Services
{
    public interface IRssFeedService
    {
        SyndicationFeed Get();
    }
}
