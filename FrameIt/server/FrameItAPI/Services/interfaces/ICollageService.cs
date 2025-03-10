using FrameItAPI.Entities;

namespace FrameItAPI.Services.interfaces
{
    public interface ICollageService
    {
        Task<Collage> GetCollage(int id);
        Task<IEnumerable<Collage>> GetAllCollages();
        Task<Collage> CreateCollage(Collage collage);
        Task<Collage> UpdateCollage(Collage collage);
        Task<bool> DeleteCollage(int id);
    }
}
