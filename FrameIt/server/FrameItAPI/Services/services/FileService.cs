using FrameItAPI.Services.interfaces;
using FrameItAPI.Entities;
using FrameItAPI.DataAccess;
using Microsoft.EntityFrameworkCore;
using Amazon.S3;
using Amazon.S3.Model;
using System;
using System.IO;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace FrameItAPI.Services.services
{
    public class FileService : IFileService
    {
        private readonly DataContext _context;
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public FileService(DataContext context, IAmazonS3 s3Client, IConfiguration configuration)
        {
            _context = context;
            _s3Client = s3Client;
            _bucketName = "001687204140frameit";
        }

        public async Task<FrameItAPI.Entities.File> CreateFile(FrameItAPI.Entities.File file, Stream fileStream)
        {
           
            if (string.IsNullOrEmpty(_bucketName))
            {
                throw new Exception("Bucket name is not configured.");
            }

            string fileKey = $"{Guid.NewGuid()}_{file.FileName}";

            try
            {
                var putRequest = new PutObjectRequest
                {
                    BucketName = _bucketName,
                    Key = file.S3Key,
                    InputStream = fileStream,
                    ContentType = file.FileType,
                    AutoCloseStream = true
                };

                Console.WriteLine("File upload request created.");
                Console.WriteLine($"File Key: {fileKey}");

                Console.WriteLine($"Uploading file: Bucket={putRequest.BucketName}, Key={putRequest.Key}, ContentType={putRequest.ContentType}");

                Console.WriteLine("📤 Trying to upload file to S3...");
                await _s3Client.PutObjectAsync(putRequest);
                Console.WriteLine("✅ Upload successful!");
            }
            catch (Exception ex)
            {
                throw new Exception($"Error uploading file to S3: {ex.Message}");
            }

            file.S3Key = fileKey;
            file.S3Url = $"https://{_bucketName}.s3.amazonaws.com/{fileKey}"; 
            _context.Files.Add(file);
            await _context.SaveChangesAsync();

            return file;
        }

        public async Task<Entities.File> CreateImageFileWithResize(Entities.File file, Stream originalImageStream)
        {
            using var image = await SixLabors.ImageSharp.Image.LoadAsync(originalImageStream);
            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Mode = ResizeMode.Max,
                Size = new Size(1024, 1024)
            }));

            using var resizedStream = new MemoryStream();
            await image.SaveAsJpegAsync(resizedStream);
            resizedStream.Seek(0, SeekOrigin.Begin);

            file.FileType = "image/jpeg";
            file.Size = resizedStream.Length;

            return await CreateFile(file, resizedStream);
        }

        public async Task<string> Download(string fileName)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddDays(300),
            };

            return _s3Client.GetPreSignedURL(request);
        }

        public async Task<string> GetPresignedUrl(string s3Key)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = s3Key,
                Expires = DateTime.UtcNow.AddMinutes(30),
                Verb = HttpVerb.GET
            };

            return _s3Client.GetPreSignedURL(request);
            
        }


        public async Task<byte[]> GetFileContent(int fileId)
        {
            var file = await _context.Files.FindAsync(fileId);
            if (file == null || file.IsDeleted) return null;
            var request = new GetObjectRequest
            {
                BucketName = _bucketName,
                Key = file.S3Key
            };
            using var response = await _s3Client.GetObjectAsync(request);
            using var memoryStream = new MemoryStream();
            await response.ResponseStream.CopyToAsync(memoryStream);
            return memoryStream.ToArray();
        }

        public async Task<List<Entities.File>> GetFilesWithNullParent()
        {
            return await _context.Files
                .Where(f => f.FolderId == null)
                .ToListAsync();
        }

        public async Task<List<Entities.File>> GetFilesByFolderId(int folderId, int userId)
        {
            return await _context.Files
                .Where(f => f.FolderId == folderId && f.OwnerId == userId)
                .ToListAsync();
        } 
        
        public async Task<List<Entities.File>> GetFilesByaUserId(int userId)
        {
            return await _context.Files
                .Where(f => !f.IsDeleted && f.OwnerId == userId)
                .ToListAsync();
        }

        public async Task<IEnumerable<FrameItAPI.Entities.File>> GetFilesByTag(int tagId)
        {
            var tag = await _context.Tags.FindAsync(tagId);
            int userId = tag.UserId;
            return await _context.Files
                .Where(f => !f.IsDeleted && f.TagId == tagId && f.OwnerId == userId )
                .ToListAsync();
        }

        public async Task<FrameItAPI.Entities.File> GetFile(int id)
        {
            return await _context.Files.Where(f => f.Id == id && !f.IsDeleted).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<FrameItAPI.Entities.File>> GetAllFiles()
        {
            return await _context.Files.Where(f => !f.IsDeleted).ToListAsync();
        }

       

        public async Task<FrameItAPI.Entities.File> UpdateFile(FrameItAPI.Entities.File file)
        {
            var existingFile = await _context.Files.FindAsync(file.Id);

            if (existingFile == null)
            {
                return null;
            }

            if (file.FileName != null && existingFile.FileName != file.FileName )
                existingFile.FileName = file.FileName;

            if (file.FileType != null && existingFile.FileType != file.FileType)
                existingFile.FileType = file.FileType;

            if (file.Size != null && existingFile.Size != file.Size)
                existingFile.Size = file.Size;

            if (file.S3Key != null && existingFile.S3Key != file.S3Key)
                existingFile.S3Key = file.S3Key;

            if (file.S3Url != null && existingFile.S3Url != file.S3Url)
                existingFile.S3Url = file.S3Url;

            if (file.FolderId != null && existingFile.FolderId != file.FolderId)
                existingFile.FolderId = file.FolderId;

            if (file.OwnerId != 0)
                existingFile.OwnerId = file.OwnerId;

            if (file.TagId != 0 && existingFile.TagId != file.TagId)
                existingFile.TagId = file.TagId;

            if (existingFile.IsDeleted != file.IsDeleted)
                existingFile.IsDeleted = file.IsDeleted;

            existingFile.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return existingFile;
        }


        public async Task<bool> DeleteFile(int id)
        {
            var file = await GetFile(id);
            if (file == null) 
                return false;

            file.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RestoreFile(int id)
        {
            var file = await _context.Files
                .Where(f => f.Id == id && f.IsDeleted)
                .FirstOrDefaultAsync();
            if (file == null) return false;

            file.IsDeleted = false; 
            _context.Files.Update(file);
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<IEnumerable<Entities.File>> GetFilesByFolderId(int folderId)
        {
            return await _context.Files
                .Where(f => f.FolderId == folderId) // הנחה שיש לך שדה FolderId
                .ToListAsync();
        }

        public async Task<Stream> DownloadFile(int id)
        {
            var file = await _context.Files.FindAsync(id);
            if (file == null || file.IsDeleted) return null;

            var request = new GetObjectRequest
            {
                BucketName = _bucketName,
                Key = file.S3Key 
            };

            var response = await _s3Client.GetObjectAsync(request);

            return response.ResponseStream; 
        }

        public async Task<Entities.File> UploadFileToS3(Entities.File file, Stream fileStream)
        {
            if (string.IsNullOrEmpty(_bucketName))
            {
                throw new Exception("Bucket name is not configured.");
            }

            string fileKey = $"{file.FolderId}/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            try
            {
                var putRequest = new PutObjectRequest
                {
                    BucketName = _bucketName,
                    Key = fileKey,
                    InputStream = fileStream,
                    ContentType = file.FileType,
                    AutoCloseStream = true
                };

                await _s3Client.PutObjectAsync(putRequest);

                // עדכון S3Key ו-CreatedAt
                file.S3Key = fileKey;
                file.CreatedAt = DateTime.UtcNow;

                // שמירת הנתונים בבסיס הנתונים
                _context.Files.Add(file);
                await _context.SaveChangesAsync();

                return file;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error uploading file to S3: {ex.Message}");
            }
        }
    }
}
