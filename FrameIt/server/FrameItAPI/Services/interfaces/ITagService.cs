using FrameItAPI.Entities;

namespace FrameItAPI.Services.interfaces
{
    public interface ITagService
    {
        Task<Tag> GetTag(int id);
        Task<IEnumerable<Tag>> GetAllTags();
        Task<IEnumerable<Tag>> GetTagsByUserId(int userId);
        Task<Tag> CreateTag(Tag tag);
        Task<Tag> UpdateTag(Tag tag);
        Task<bool> DeleteTag(int id);

    }
}
