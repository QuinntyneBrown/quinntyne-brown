using QuinntyneBrown.Models;
using System.Collections.Generic;

namespace QuinntyneBrown.Dtos
{
    public class DigitalAssetUploadResponseDto
    {
        public DigitalAssetUploadResponseDto()
        {

        }

        public DigitalAssetUploadResponseDto(ICollection<DigitalAsset> digitalAssets)
        {
            foreach (var digitalAsset in digitalAssets)
            {
                Files.Add(new DigitalAssetDto(digitalAsset));
            }
        }

        public IList<DigitalAssetDto> Files { get; set; } = new List<DigitalAssetDto>();
    }
}
