using System.Data.Entity.Migrations;
using WebActivatorEx;

[assembly: PostApplicationStartMethod(typeof(QuinntyneBrown.AppActivator), "PostStart")]

namespace QuinntyneBrown
{
    public class AppActivator
    {
        public static void PostStart()
        {
            //var dbMigrator = new DbMigrator(new Migrations.Configuration());
            //dbMigrator.Update();            
        }
    }
}
