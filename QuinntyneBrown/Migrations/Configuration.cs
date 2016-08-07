namespace QuinntyneBrown.Migrations
{
    using System.Data.Entity.Migrations;

    internal sealed class Configuration : DbMigrationsConfiguration<QuinntyneBrown.Data.DataContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }

        protected override void Seed(QuinntyneBrown.Data.DataContext context)
        {
            UserConfiguration.Seed(context);
            DigitalAssetConfiguration.Seed(context);
        }
    }
}
