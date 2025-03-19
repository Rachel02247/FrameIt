using FrameItAPI.Services.interfaces;
using FrameItAPI.Entities;
using FrameItAPI.DataAccess;
using Microsoft.EntityFrameworkCore;

namespace FrameItAPI.Services.services
{
    public class FileService : IFileService
    {
        private readonly DataContext _context;

        public FileService(DataContext context)
        {
            _context = context;
        }

        public async Task<List<Entities.File>> GetFilesWithNullParent()
        {
            return await _context.Files
                .Where(f => f.FolderId == null)
                .ToListAsync();
        }

        public async Task<List<Entities.File>> GetFilesByFolderId(int folderId)
        {
            return await _context.Files
                .Where(f => f.FolderId == folderId)
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

        public async Task<FrameItAPI.Entities.File> CreateFile(FrameItAPI.Entities.File file)
        {

           
            _context.Files.Add(file);
            await _context.SaveChangesAsync(); 
            return file;
        }


        public async Task<FrameItAPI.Entities.File> UpdateFile(FrameItAPI.Entities.File file)
        {
            _context.Files.Update(file);
            await _context.SaveChangesAsync();
            return file;
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
    }
}
