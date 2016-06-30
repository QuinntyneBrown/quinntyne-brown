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

        void SaveChanges();
    }
}
