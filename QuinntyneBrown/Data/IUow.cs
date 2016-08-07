using QuinntyneBrown.Models;

namespace QuinntyneBrown.Data
{
    public interface IUow
    {
        IRepository<App> Apps { get; }
        IRepository<UI> UIs { get; }
        IRepository<Section> Sections { get; }
        IRepository<Property> Properties { get; }
        IRepository<Article> Articles { get; }
        IRepository<DigitalAsset> DigitalAssets { get; }
        IRepository<Gallery> Galleries { get; }
        IRepository<User> Users { get; }
        IRepository<Role> Roles { get; }
        IRepository<ServiceProvider> ServiceProviders { get; }
        IRepository<Customer> Customers { get; }
        IRepository<Category> Categories { get; }
        IRepository<Contact> Contacts { get; }
        IRepository<Product> Products { get; }
        IRepository<Order> Orders { get; }
        IRepository<Quote> Quotes { get; }
        IRepository<SocialShareItem> SocialShareItems { get; }
        IRepository<ProfessionalService> ProfessionalServices { get; }
        IRepository<Menu> Menus { get;}
        IRepository<MenuItem> MenuItems { get; }
        void SaveChanges();
    }
}
