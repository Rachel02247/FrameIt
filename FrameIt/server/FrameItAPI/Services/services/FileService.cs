using FrameItAPI.Services.interfaces;
using FrameItAPI.Entities;
using FrameItAPI.DataAccess;
using Microsoft.EntityFrameworkCore;
using Amazon.S3;
using Amazon.S3.Model;
using System;
using System.IO;
using System.Threading.Tasks;
using FrameItAPI.Migrations;

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
            _bucketName = "001687204140frameit";// קבלת שם הדלי מה-ENV
        }

        public async Task<FrameItAPI.Entities.File> CreateFile(FrameItAPI.Entities.File file, Stream fileStream)
        {
           
            if (string.IsNullOrEmpty(_bucketName))
            {
                throw new Exception("Bucket name is not configured.");
            }

            // יצירת שם ייחודי לקובץ ב-S3
            string fileKey = $"{Guid.NewGuid()}_{file.FileName}";

            try
            {
                // העלאת הקובץ ל-S3
                var putRequest = new PutObjectRequest
                {
                    BucketName = _bucketName,
                    Key = fileKey, // שימוש בשם הקובץ החדש
                    InputStream = fileStream,
                    ContentType = file.FileType,
                    AutoCloseStream = true
                };
                Console.WriteLine($"Uploading file: Bucket={putRequest.BucketName}, Key={putRequest.Key}, ContentType={putRequest.ContentType}");

                Console.WriteLine("📤 Trying to upload file to S3...");
                await _s3Client.PutObjectAsync(putRequest);
                Console.WriteLine("✅ Upload successful!");
            }
            catch (Exception ex)
            {
                throw new Exception($"Error uploading file to S3: {ex.Message}");
            }

            // שמירת הנתונים בבסיס הנתונים
            file.S3Key = fileKey;
            file.S3Url = $"https://{_bucketName}.s3.amazonaws.com/{fileKey}"; // URL תקין
            _context.Files.Add(file);
            await _context.SaveChangesAsync();

            return file;
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

        //public async Task<Stream> DownloadFile(int id)
        //{
        //    var file = await _context.Files.FindAsync(id);
        //    if (file == null || file.IsDeleted) return null;

        //    var request = new GetObjectRequest
        //    {
        //        BucketName = _bucketName,
        //        Key = file.S3Key
        //    };

        //    var response = await _s3Client.GetObjectAsync(request);

        //    return response.ResponseStream; // זהו ה-Stream שחוזר מהבקשה
        //}


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

        //public async Task<FrameItAPI.Entities.File> CreateFile(FrameItAPI.Entities.File file)
        //{

        //    _context.Files.Add(file);
        //    await _context.SaveChangesAsync();
        //    return file;
        //}


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

        //הורדה
        public async Task<Stream> DownloadFile(int id)
        {
            var file = await _context.Files.FindAsync(id);
            if (file == null || file.IsDeleted) return null;

            // יצירת בקשה להורדת הקובץ מ-S3
            var request = new GetObjectRequest
            {
                BucketName = _bucketName,
                Key = file.S3Key // המפתח של הקובץ ב-S3
            };

            // קבלת התגובה עם זרם הקובץ
            var response = await _s3Client.GetObjectAsync(request);

            return response.ResponseStream; // מחזיר את הזרם של הקובץ
        }

        public async Task<Entities.File> UploadFileToS3(Entities.File file, Stream fileStream)
        {
            if (string.IsNullOrEmpty(_bucketName))
            {
                throw new Exception("Bucket name is not configured.");
            }

            // יצירת שם ייחודי לקובץ ב-S3
            string fileKey = $"{file.FolderId}/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            try
            {
                // העלאת הקובץ ל-S3
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
