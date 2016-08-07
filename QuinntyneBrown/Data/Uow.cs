using QuinntyneBrown.Models;
using System;

namespace QuinntyneBrown.Data
{
    public class Uow : IUow
    {
        protected IDbContext dbContext;

        protected IRepositoryProvider RepositoryProvider { get; set; }

        public Uow(IDbContext dbContext = null)
        {
            this.dbContext = dbContext;
            ConfigureDbContext(this.dbContext);
            var repositoryProvider = new RepositoryProvider(new RepositoryFactories());
            repositoryProvider.dbContext = this.dbContext;
            RepositoryProvider = repositoryProvider;
        }

        public Uow(IRepositoryProvider repositoryProvider, IDbContext dbContext = null)
        {
            this.dbContext = dbContext;
            ConfigureDbContext(this.dbContext);
            repositoryProvider.dbContext = this.dbContext;
            RepositoryProvider = repositoryProvider;
        }

        public IRepository<App> Apps { get { return GetStandardRepo<App>(); } }
        public IRepository<UI> UIs { get { return GetStandardRepo<UI>(); } }
        public IRepository<Section> Sections { get { return GetStandardRepo<Section>(); } }
        public IRepository<Property> Properties { get { return GetStandardRepo<Property>(); } }
        public IRepository<Article> Articles { get { return GetStandardRepo<Article>(); } }
        public IRepository<DigitalAsset> DigitalAssets { get { return GetStandardRepo<DigitalAsset>(); } }
        public IRepository<Gallery> Galleries { get { return GetStandardRepo<Gallery>(); } }
        public IRepository<User> Users { get { return GetStandardRepo<User>(); } }
        public IRepository<Role> Roles { get { return GetStandardRepo<Role>(); } }
        public IRepository<ServiceProvider> ServiceProviders { get { return GetStandardRepo<ServiceProvider>(); } }
        public IRepository<Customer> Customers { get { return GetStandardRepo<Customer>(); } }
        public IRepository<Category> Categories { get { return GetStandardRepo<Category>(); } }
        public IRepository<Contact> Contacts { get { return GetStandardRepo<Contact>(); } }
        public IRepository<Product> Products { get { return GetStandardRepo<Product>(); } }
        public IRepository<Order> Orders { get { return GetStandardRepo<Order>(); } }
        public IRepository<Quote> Quotes { get { return GetStandardRepo<Quote>(); } }
        public IRepository<SocialShareItem> SocialShareItems { get { return GetStandardRepo<SocialShareItem>(); } }
        public IRepository<ProfessionalService> ProfessionalServices { get { return GetStandardRepo<ProfessionalService>(); } }
        public IRepository<Menu> Menus { get { return GetStandardRepo<Menu>(); } }
        public IRepository<MenuItem> MenuItems { get { return GetStandardRepo<MenuItem>(); } }

        protected void ConfigureDbContext(IDbContext dbContext)
        {
            dbContext.Configuration.ProxyCreationEnabled = false;
            dbContext.Configuration.LazyLoadingEnabled = false;
            dbContext.Configuration.ValidateOnSaveEnabled = false;
        }
        
        public void SaveChanges()
        {
            this.dbContext.SaveChanges();
        }

        protected IRepository<T> GetStandardRepo<T>() where T : class
        {
            return RepositoryProvider.GetRepositoryForEntityType<T>();
        }

        protected T GetRepo<T>() where T : class
        {
            return RepositoryProvider.GetRepository<T>();
        }

        #region IDisposable

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (this.dbContext != null)
                {
                    this.dbContext.Dispose();
                }
            }
        }

        #endregion
        
        public void Add<T>(T entity)
        {
            throw new NotImplementedException();
        }

        public void Update<T>(T entity)
        {
            throw new NotImplementedException();
        }
    }
}
