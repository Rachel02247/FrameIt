using FrameItAPI.Entities;
using FrameItAPI.Services.interfaces;
using FrameItAPI.DataAccess;
using Microsoft.EntityFrameworkCore;

namespace FrameItAPI.Services.services
{
    public class FolderService : IFolderService
    {
        private readonly DataContext _context;

        public FolderService(DataContext context)
        {
            _context = context;
        }
        public async Task<Folder> GetFolder(int id)
        {
            return await _context.Folders.FindAsync(id);
        }

        public async Task<IEnumerable<Folder>> GetAllFolders()
        {
            return await _context.Folders.ToListAsync();
        }

        public async Task<Folder> CreateFolder(Folder folder)
        {
            _context.Folders.Add(folder);
            await _context.SaveChangesAsync();
            return folder;
        }

        public async Task<Folder> UpdateFolder(Folder folder)
        {
            _context.Folders.Update(folder);
            await _context.SaveChangesAsync();
            return folder;
        }

        public async Task<bool> DeleteFolder(int id)
        {
            var folder = await GetFolder(id);
            if (folder == null) return false;

            _context.Folders.Remove(folder);
            await _context.SaveChangesAsync();
            return true;
        }
    }

}
