using QuinntyneBrown.Data;
using QuinntyneBrown.Dtos;
using QuinntyneBrown.Models;
using QuinntyneBrown.Services;
using QuinntyneBrown.UploadHandlers;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using WebApi.OutputCache.V2;

namespace QuinntyneBrown.Controllers
{
    [Authorize]
    [RoutePrefix("api/digitalasset")]
    public class DigitalAssetController : ApiController
    {
        public DigitalAssetController(IDigitalAssetService digitalAssetService, IUow uow, ICacheProvider cacheProvider)
        {
            __digitalAssetService = digitalAssetService;
            _uow = uow;
            _repository = uow.DigitalAssets;
            _cache = cacheProvider.GetCache();
        }

        [Route("add")]
        [HttpPost]
        [ResponseType(typeof(DigitalAssetAddOrUpdateResponseDto))]
        public IHttpActionResult Add(DigitalAssetAddOrUpdateRequestDto dto) { return Ok(__digitalAssetService.AddOrUpdate(dto)); }

        [Route("update")]
        [HttpPut]
        [ResponseType(typeof(DigitalAssetAddOrUpdateResponseDto))]
        public IHttpActionResult Update(DigitalAssetAddOrUpdateRequestDto dto) { return Ok(__digitalAssetService.AddOrUpdate(dto)); }

        [Route("get")]
        [AllowAnonymous]
        [HttpGet]
        [ResponseType(typeof(ICollection<DigitalAssetDto>))]
        public IHttpActionResult Get() { return Ok(__digitalAssetService.Get()); }

        [Route("getById")]
        [HttpGet]
        [ResponseType(typeof(DigitalAssetDto))]
        public IHttpActionResult GetById(int id) { return Ok(__digitalAssetService.GetById(id)); }

        [Route("remove")]
        [HttpDelete]
        [ResponseType(typeof(int))]
        public IHttpActionResult Remove(int id) { return Ok(__digitalAssetService.Remove(id)); }

        [AllowAnonymous]
        [Route("upload")]
        [HttpPost]
        public async Task<HttpResponseMessage> Upload(HttpRequestMessage request)
        {
            var digitalAssets = new List<DigitalAsset>();
            try
            {
                if (!Request.Content.IsMimeMultipartContent("form-data"))
                    throw new HttpResponseException(HttpStatusCode.BadRequest);

                var provider = await Request.Content.ReadAsMultipartAsync(new InMemoryMultipartFormDataStreamProvider());

                NameValueCollection formData = provider.FormData;
                IList<HttpContent> files = provider.Files;

                foreach (var file in files)
                {
                    var filename = new FileInfo(file.Headers.ContentDisposition.FileName.Trim(new char[] { '"' })
                        .Replace("&", "and")).Name;
                    Stream stream = await file.ReadAsStreamAsync();
                    var bytes = StreamHelper.ReadToEnd(stream);
                    var digitalAsset = new DigitalAsset();
                    digitalAsset.FileName = filename;
                    digitalAsset.Bytes = bytes;
                    digitalAsset.ContentType = System.Convert.ToString(file.Headers.ContentType);
                    _repository.Add(digitalAsset);
                    digitalAssets.Add(digitalAsset);
                }

                _uow.SaveChanges();
            }
            catch (Exception exception)
            {
                var e = exception;
            }

            return Request.CreateResponse(HttpStatusCode.OK, new DigitalAssetUploadResponseDto(digitalAssets));
        }

        [Route("serve")]
        [HttpGet]
        [AllowAnonymous]
        [CacheOutput(ClientTimeSpan = 0, ServerTimeSpan = 0)]
        public HttpResponseMessage Serve([FromUri]Guid? uniqueId = null, int? height = null, string name = null)
        {
            var s = _repository.GetAll().FirstOrDefault();

            var digitalAsset = uniqueId.HasValue ?
                _cache.FromCacheOrService(() => _repository.GetAll().FirstOrDefault(x => x.UniqueId == uniqueId), uniqueId.ToString())
                : _cache.FromCacheOrService(() => _repository.GetAll().FirstOrDefault(x => x.Name == name), name);

            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            if (digitalAsset == null)
                return result;
            result.Content = new ByteArrayContent(digitalAsset.Bytes);
            result.Content.Headers.ContentType = new MediaTypeHeaderValue(digitalAsset.ContentType);
            return result;
        }
        
        protected readonly IDigitalAssetService __digitalAssetService;
        protected readonly IRepository<DigitalAsset> _repository;
        protected readonly IUow _uow;
        protected readonly ICache _cache;        
    }
}
