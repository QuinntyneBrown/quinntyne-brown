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
        IRepository<Photo> Photos { get; }
        IRepository<Gallery> Galleries { get; }
        IRepository<User> Users { get; }
        IRepository<Role> Roles { get; }
        IRepository<Photographer> Photographers { get; }
        IRepository<Customer> Customers { get; }

        void SaveChanges();
    }
}
