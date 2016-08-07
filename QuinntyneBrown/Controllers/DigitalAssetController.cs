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
        public DigitalAssetController(IDigitalAssetService photoService, IUow uow, ICacheProvider cacheProvider)
        {
            _photoService = photoService;
            _uow = uow;
            _repository = uow.Photos;
            _cache = cacheProvider.GetCache();
        }

        [Route("add")]
        [HttpPost]
        [ResponseType(typeof(DigitalAssetAddOrUpdateResponseDto))]
        public IHttpActionResult Add(DigitalAssetAddOrUpdateRequestDto dto) { return Ok(_photoService.AddOrUpdate(dto)); }

        [Route("update")]
        [HttpPut]
        [ResponseType(typeof(DigitalAssetAddOrUpdateResponseDto))]
        public IHttpActionResult Update(DigitalAssetAddOrUpdateRequestDto dto) { return Ok(_photoService.AddOrUpdate(dto)); }

        [Route("get")]
        [AllowAnonymous]
        [HttpGet]
        [ResponseType(typeof(ICollection<DigitalAssetDto>))]
        public IHttpActionResult Get() { return Ok(_photoService.Get()); }

        [Route("getById")]
        [HttpGet]
        [ResponseType(typeof(DigitalAssetDto))]
        public IHttpActionResult GetById(int id) { return Ok(_photoService.GetById(id)); }

        [Route("remove")]
        [HttpDelete]
        [ResponseType(typeof(int))]
        public IHttpActionResult Remove(int id) { return Ok(_photoService.Remove(id)); }

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
        [CacheOutput(ClientTimeSpan = 1000, ServerTimeSpan = 1000)]
        public HttpResponseMessage Serve([FromUri]Guid uniqueId, int? height = null)
        {
            DigitalAsset digitalAsset = _cache.FromCacheOrService(() => _repository.GetAll().FirstOrDefault(x => x.UniqueId == uniqueId), uniqueId.ToString());
            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            if (digitalAsset == null)
                return result;
            result.Content = new ByteArrayContent(digitalAsset.Bytes);
            result.Content.Headers.ContentType = new MediaTypeHeaderValue(digitalAsset.ContentType);
            return result;
        }
        
        protected readonly IDigitalAssetService _photoService;
        protected readonly IRepository<DigitalAsset> _repository;
        protected readonly IUow _uow;
        protected readonly ICache _cache;        
    }
}
