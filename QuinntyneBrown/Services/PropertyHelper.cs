using System;
using System.Collections.Generic;
using System.Linq;
using static System.String;
using System.Net.Http;
using QuinntyneBrown.Models;
using static Newtonsoft.Json.JsonConvert;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;


namespace QuinntyneBrown.Services
{
    public static class PropertyHelper
    {
        public static HttpClient CreateHttpClient(string baseUri)
        {
            var httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri(baseUri);
            return httpClient;
        }

        public static string ResolveUri(string uri, Dictionary<string, object> context)
        {
            if (context == null)
                context = new Dictionary<string, object>();

            return uri.Contains("?")
            ? $"{uri}&{Join("&", context.Select(x => $"{x.Key}={x.Value}"))}"
            : $"{uri}?{Join("&", context.Select(x => $"{x.Key}={x.Value}"))}";
        }

        public static void ResolveDynamicProperties(ICollection<UIProperty> uiProperties, Dictionary<string, object> context = null)
        {
            foreach (var dynamicProperty in uiProperties.Where(x => x.Property.IsDynamic))
            {
                var httpClient = CreateHttpClient(dynamicProperty.Property.BaseUri);
                var response = httpClient.GetAsync($"{ResolveUri(dynamicProperty.Property.Uri, context)}").Result;
                var dynamicData = response.Content.ReadAsAsync<dynamic>().Result;
                dynamicProperty.Property.Value = SerializeObject(dynamicData, new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                });
            }
        }

        public static void ResolveDynamicProperties(ICollection<UISection> uiSections, Dictionary<string, object> context = null)
        {
            foreach (var uiSection in uiSections)
            {
                if (uiSection.Section.IsDynamic)
                {
                    foreach (var dynamicProperty in uiSection.Section.SectionProperties.Where(x => x.Property.IsDynamic))
                    {
                        var httpClient = CreateHttpClient(dynamicProperty.Property.BaseUri);
                        var response = httpClient.GetAsync($"{ResolveUri(dynamicProperty.Property.Uri, context)}").Result;
                        var dynamicData = response.Content.ReadAsAsync<dynamic>().Result;
                        dynamicProperty.Property.Value = SerializeObject(dynamicData, new JsonSerializerSettings
                        {
                            ContractResolver = new CamelCasePropertyNamesContractResolver()
                        });
                    }
                }
            }
        }

        public static void ResolveDynamicProperties(ICollection<SectionProperty> sectionProperties, Dictionary<string, object> context = null)
        {
            foreach (var dynamicProperty in sectionProperties.Where(x => x.Property.IsDynamic))
            {
                var httpClient = CreateHttpClient(dynamicProperty.Property.BaseUri);
                var response = httpClient.GetAsync($"{ResolveUri(dynamicProperty.Property.Uri, context)}").Result;
                var dynamicData = response.Content.ReadAsAsync<dynamic>().Result;
                dynamicProperty.Property.Value = SerializeObject(dynamicData, new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                });
            }
        }
    }
}
