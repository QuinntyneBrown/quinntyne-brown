using QuinntyneBrown.Models;
using System.Data.Entity;

namespace QuinntyneBrown.Data
{
    public class DataContext: DbContext, IDbContext
    {
        public DataContext()
            : base(nameOrConnectionString: "QuinntyneBrownDataContext")
        {
            Configuration.ProxyCreationEnabled = false;
            Configuration.LazyLoadingEnabled = false;
            Configuration.AutoDetectChangesEnabled = true;
        }

        public DbSet<Article> Articles { get; set; }
        public DbSet<App> Apps { get; set; }
        public DbSet<UI> UIs { get; set; }
        public DbSet<Section> Sections { get; set; }
        public DbSet<Property> Properties { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Gallery> Galleries { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {

        } 
    }
}
