using Owin;
using System.Web.Http;
using Microsoft.Owin;
using Unity.WebApi;
using static QuinntyneBrown.Helpers.StartupHelper;

[assembly: OwinStartup(typeof(QuinntyneBrown.Web.Startup))]

namespace QuinntyneBrown.Web
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {            
            GlobalConfiguration.Configure(config =>
            {
                var container = UnityConfiguration.GetContainer();
                InitLogging(container);
                config.DependencyResolver = new UnityDependencyResolver(container);
                QuinntyneBrown.ApiConfiguration.Install(config, app);
            });
        }
    }
}
