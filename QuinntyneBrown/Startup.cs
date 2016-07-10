using Owin;
using System.Web.Http;
using Unity.WebApi;
using static QuinntyneBrown.Helpers.StartupHelper;

namespace QuinntyneBrown
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var config = new HttpConfiguration();
            var container = UnityConfiguration.GetContainer();
            InitLogging(container);
            config.DependencyResolver = new UnityDependencyResolver(container);
            ApiConfiguration.Install(config, app);
            app.UseWebApi(config);
        }
    }
}
