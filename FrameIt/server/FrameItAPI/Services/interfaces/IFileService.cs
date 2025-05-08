using Amazon.S3.Model;
using FrameItAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace FrameItAPI.Services.interfaces
{
    public interface IFileService
    {
        Task<FrameItAPI.Entities.File> GetFile(int id);
        Task<IEnumerable<FrameItAPI.Entities.File>> GetAllFiles();
        Task<FrameItAPI.Entities.File> CreateFile(FrameItAPI.Entities.File file, Stream fileStream);
        Task<FrameItAPI.Entities.File> UpdateFile(FrameItAPI.Entities.File file);
        Task<bool> DeleteFile(int id);
        Task<bool> RestoreFile(int id);
        Task<List<Entities.File>> GetFilesWithNullParent();
        Task<List<Entities.File>> GetFilesByFolderId(int folderId, int userId);
        Task<Stream> DownloadFile(int id);
        Task<string> Download(string fileName);
        Task<string> GetPresignedUrl(string fileName);
        Task<IEnumerable<FrameItAPI.Entities.File>> GetFilesByTag(int tagId);
        Task<byte[]> GetFileContent(int fileId);




    }
}
