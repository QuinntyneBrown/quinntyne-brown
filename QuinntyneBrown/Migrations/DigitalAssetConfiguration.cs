using QuinntyneBrown.Data;
using static System.IO.File;
using static System.IO.Directory;
using System.Linq;
using QuinntyneBrown.Models;
using System.IO;
using System;

namespace QuinntyneBrown.Migrations
{
    public class DigitalAssetConfiguration
    {
        public static void Seed(DataContext context) {
            foreach (var file in GetFiles(@"C:\QuinntyneBrownPhotos"))
            {
                byte[] bytes = ReadAllBytes(file);
                var fileName = new FileInfo(file).Name;
                if (context.DigitalAssets.Where(x=>x.Name == fileName).FirstOrDefault() == null)
                {
                    var digitalAsset = new DigitalAsset();
                    digitalAsset.Name = fileName;
                    digitalAsset.ContentType = GetContentType(file);
                    digitalAsset.Bytes = bytes;
                    context.DigitalAssets.Add(digitalAsset);
                }             
            }
            context.SaveChanges();
        }
        public static string GetContentType(string file)
        {
            if (System.IO.Path.GetExtension(file) == ".jpg")
                return "image/jpeg";

            throw new NotSupportedException();
        }
    }


}
