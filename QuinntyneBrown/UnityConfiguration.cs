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
            container.RegisterType<IDigitalAssetService, DigitalAssetService>();
            container.RegisterType<IGalleryService, GalleryService>();            
            container.RegisterType<ICustomerService, CustomerService>();
            container.RegisterType<IRssFeedService, RssFeedService>();
            container.RegisterType<IUserService, UserService>();
            container.RegisterType<IContactService, ContactService>();

            container.RegisterType<IProductService, ProductService>();
            container.RegisterType<IOrderService, OrderService>();
            container.RegisterType<IQuoteService, QuoteService>();
            container.RegisterType<ISocialShareItemService, SocialShareItemService>();
            container.RegisterType<IServiceProviderService, ServiceProviderService>();
            container.RegisterType<IProfessionalServiceService, ProfessionalServiceService>();
            container.RegisterType<IMenuItemService, MenuItemService>();
            container.RegisterType<IMenuService, MenuService>();

            container.RegisterInstance(AuthConfiguration.LazyConfig);
            container.RegisterInstance(TraceConfiguration.LazyConfig);

            return container;
        }
    }
}
