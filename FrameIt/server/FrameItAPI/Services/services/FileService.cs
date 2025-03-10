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

        public async Task<FrameItAPI.Entities.File> GetFile(int id)
        {
            return await _context.Files.FindAsync(id);
        }

        public async Task<IEnumerable<FrameItAPI.Entities.File>> GetAllFiles()
        {
            return await _context.Files.ToListAsync();
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
            FrameItAPI.Entities.File file = await GetFile(id);
            if (file == null) return false;

            _context.Files.Remove(file);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
