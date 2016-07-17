using System;
using System.Collections.Generic;

namespace QuinntyneBrown.Models
{
    public class Photo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string FileName { get; set; }
        public string Description { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? FileModified { get; set; }
        public long? Size { get; set; }
        public string ContentType { get; set; }
        public string RelativePath { get { return $"api/photo/serve?uniqueid={UniqueId}"; } }
        public Byte[] Bytes { get; set; } = new byte[0];
        public Guid? UniqueId { get; set; } = Guid.NewGuid();
        public bool IsDeleted { get; set; }
        public ICollection<GalleryPhoto> GalleryPhotos { get; set; } = new HashSet<GalleryPhoto>();
        public ICollection<ArticlePhoto> ArticlePhotos { get; set; } = new HashSet<ArticlePhoto>();
        public ICollection<ServiceProviderPhoto> ServiceProviderPhotos { get; set; } = new HashSet<ServiceProviderPhoto>();
    }
}
