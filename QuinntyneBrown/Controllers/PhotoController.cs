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
    [RoutePrefix("api/photo")]
    public class PhotoController : ApiController
    {
        public PhotoController(IPhotoService photoService, IUow uow, ICacheProvider cacheProvider)
        {
            _photoService = photoService;
            _uow = uow;
            _repository = uow.Photos;
            _cache = cacheProvider.GetCache();
        }

        [Route("add")]
        [HttpPost]
        [ResponseType(typeof(PhotoAddOrUpdateResponseDto))]
        public IHttpActionResult Add(PhotoAddOrUpdateRequestDto dto) { return Ok(_photoService.AddOrUpdate(dto)); }

        [Route("update")]
        [HttpPut]
        [ResponseType(typeof(PhotoAddOrUpdateResponseDto))]
        public IHttpActionResult Update(PhotoAddOrUpdateRequestDto dto) { return Ok(_photoService.AddOrUpdate(dto)); }

        [Route("get")]
        [AllowAnonymous]
        [HttpGet]
        [ResponseType(typeof(ICollection<PhotoDto>))]
        public IHttpActionResult Get() { return Ok(_photoService.Get()); }

        [Route("getById")]
        [HttpGet]
        [ResponseType(typeof(PhotoDto))]
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
            var photos = new List<Photo>();
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
                    var photo = new Photo();
                    photo.FileName = filename;
                    photo.Bytes = bytes;
                    photo.ContentType = System.Convert.ToString(file.Headers.ContentType);
                    _repository.Add(photo);
                    photos.Add(photo);
                }

                _uow.SaveChanges();
            }
            catch (Exception exception)
            {
                var e = exception;
            }

            return Request.CreateResponse(HttpStatusCode.OK, new PhotoUploadResponseDto(photos));
        }

        [Route("serve")]
        [HttpGet]
        [AllowAnonymous]
        [CacheOutput(ClientTimeSpan = 1000, ServerTimeSpan = 1000)]
        public HttpResponseMessage Serve([FromUri]Guid uniqueId, int? height = null)
        {
            Photo photo = _cache.FromCacheOrService(() => _repository.GetAll().FirstOrDefault(x => x.UniqueId == uniqueId), uniqueId.ToString());
            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            if (photo == null)
                return result;
            result.Content = new ByteArrayContent(photo.Bytes);
            result.Content.Headers.ContentType = new MediaTypeHeaderValue(photo.ContentType);
            return result;
        }
        
        protected readonly IPhotoService _photoService;
        protected readonly IRepository<Photo> _repository;
        protected readonly IUow _uow;
        protected readonly ICache _cache;        
    }
}
