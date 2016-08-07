using System;
using System.Collections.Generic;

namespace QuinntyneBrown.Models
{
    public class DigitalAsset
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string FileName { get; set; }
        public string Description { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? FileModified { get; set; }
        public long? Size { get; set; }
        public string ContentType { get; set; }
        public string RelativePath { get { return $"api/digitalasset/serve?name={Name}"; } }
        public Byte[] Bytes { get; set; } = new byte[0];
        public Guid? UniqueId { get; set; } = Guid.NewGuid();
        public bool IsDeleted { get; set; }
        public ICollection<GalleryDigitalAsset> GalleryDigitalAssets { get; set; } = new HashSet<GalleryDigitalAsset>();
        public ICollection<ArticleDigitalAsset> ArticleDigitalAssets { get; set; } = new HashSet<ArticleDigitalAsset>();
        public ICollection<ServiceProviderDigitalAsset> ServiceProviderDigitalAssets { get; set; } = new HashSet<ServiceProviderDigitalAsset>();
    }
}
