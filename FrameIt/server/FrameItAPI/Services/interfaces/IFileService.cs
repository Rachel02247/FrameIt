using FrameItAPI.Entities;

namespace FrameItAPI.Services.interfaces
{
    public interface IFileService
    {
        Task<FrameItAPI.Entities.File> GetFile(int id);
        Task<IEnumerable<FrameItAPI.Entities.File>> GetAllFiles();
        Task<FrameItAPI.Entities.File> CreateFile(FrameItAPI.Entities.File file);
        Task<FrameItAPI.Entities.File> UpdateFile(FrameItAPI.Entities.File file);
        Task<bool> DeleteFile(int id);
    }
}
