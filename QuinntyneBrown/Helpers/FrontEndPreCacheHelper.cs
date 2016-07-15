using Microsoft.Practices.Unity;
using QuinntyneBrown.Services;
using System.Linq;

namespace QuinntyneBrown.Helpers
{
    public static class FrontEndPreCacheHelper
    {
        public static void PreCache() {
            var uow = UnityConfiguration.GetContainer().Resolve<IAppService>();
            var app = uow.Get().FirstOrDefault();
            var serializedApp = Newtonsoft.Json.JsonConvert.SerializeObject(app);
        }
    }
}
