using QuinntyneBrown.Configuration;
using QuinntyneBrown.Data;
using QuinntyneBrown.Services;
using QuinntyneBrown.Utilities;
using Microsoft.Practices.Unity;
using Microsoft.Practices.Unity.InterceptionExtension;

namespace QuinntyneBrown
{
    public class UnityConfiguration
    {
        public static IUnityContainer GetContainer()
        {
            var container = new UnityContainer().AddNewExtension<Interception>();
            container.RegisterType<IDbContext, DataContext>();
            container.RegisterType<IUow, Uow>();
            container.RegisterType<IRepositoryProvider, RepositoryProvider>();
            container.RegisterType<IIdentityService, IdentityService>();
            container.RegisterType<ILoggerFactory, LoggerFactory>();
            container.RegisterType<ICacheProvider, CacheProvider>();
            container.RegisterType<IEncryptionService, EncryptionService>();
            container.RegisterType<ILogger, Logger>();

            container.RegisterType<IAppService, AppService>();
            container.RegisterType<IUIService, UIService>();
            container.RegisterType<ISectionService, SectionService>();
            container.RegisterType<IPropertyService, PropertyService>();
            container.RegisterType<IArticleService, ArticleService>();

            container.RegisterInstance(AuthConfiguration.LazyConfig);            
            return container;
        }
    }
}
