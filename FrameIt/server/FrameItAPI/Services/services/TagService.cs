using FrameItAPI.Entities;
using FrameItAPI.Services.interfaces;
using FrameItAPI.DataAccess;
using Microsoft.EntityFrameworkCore;

namespace FrameItAPI.Services.services
{
    public class TagService : ITagService
    {
        private readonly DataContext _context;

        public TagService(DataContext context)
        {
            _context = context;
        }

        public async Task<Tag> GetTag(int id) => await _context.Tags.FindAsync(id);

        public async Task<IEnumerable<Tag>> GetAllTags()
        {
            return await _context.Tags.ToListAsync();
        }
        public async Task<IEnumerable<Tag>> GetTagsByUserId(int userId)
        {
            return await _context.Tags.Where(t => t.UserId == userId).ToListAsync();
        }

        public async Task<Tag> CreateTag(Tag tag)
        {
            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();
            return tag;
        }

        public async Task<Tag> UpdateTag(Tag tag)
        {
            _context.Tags.Update(tag);
            await _context.SaveChangesAsync();
            return tag;
        }

        public async Task<bool> DeleteTag(int id)
        {
            var tag = await GetTag(id);
            if (tag == null) return false;

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
