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

        public async Task<IEnumerable<Folder>> GetAllFolders()
        {
            return await _context.Folders.Where(f => !f.IsDeleted).ToListAsync();
        }

        public async Task<List<Folder>> GetFoldersByUserId(int userId)
        {
            return await _context.Folders.Where(f => !f.IsDeleted && f.OwnerId == userId).ToListAsync();

        }

        public async Task<Folder> GetFolder(int id)
        {

            return await _context.Folders.FindAsync(id);
        }

        public async Task<List<Folder>> GetRootFolders()
        {
            return await _context.Folders
                .Where(f => f.ParentFolderId == null)
                .ToListAsync();
        }

        public async Task<List<Folder>> GetSiblings(int parentId)
        {
            return await _context.Folders
                .Where(f => f.ParentFolderId == parentId)
                .ToListAsync();
        }

        public async Task<List<Folder>> GetFoldersWithNullParent()
        {
            return await _context.Folders
                .Where(f => f.ParentFolderId == null)
                .ToListAsync();
        }


        public async Task<List<Folder>> GetSubFoldersByFolderId(int folderId, int userId)
        {
            return await _context.Folders
                .Where(f => (f.ParentFolderId == folderId || folderId == 0 && f.ParentFolderId == null) && f.OwnerId == userId)
                .ToListAsync();
        }

        public async Task<Folder> GetParentFolder(int fileId)
        {
            var file = await _context.Files.FindAsync(fileId);
            return await _context.Folders.FindAsync(file.FolderId) ?? null;
        }

        public async Task<List<Folder>> GetBreadcrumb(int folderId)
        {
            var breadcrumbs = new List<Folder>();
            var currentFolderId = folderId;

            while (currentFolderId != null)
            {
                var folder = await _context.Folders
                    .Where(f => f.Id == currentFolderId && !f.IsDeleted)
                    .FirstOrDefaultAsync();

                if (folder == null)
                    break; // אם לא מצאנו תיקיה, יציאה מהלולאה

                breadcrumbs.Add(folder); // הוסף את התיקיה לרשימה

                if (folder.ParentFolderId == null)
                    break; // אם ParentFolderId הוא null, יציאה מהלולאה

                currentFolderId = folder.ParentFolderId.Value; // עבור לתיקיית האב
            }

            breadcrumbs.Reverse(); // הפוך את הרשימה כך שהשורש יהיה ראשון
            return breadcrumbs;
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

            var childFolders = await _context.Folders
                .Where(f => f.ParentFolderId == id && !f.IsDeleted)
                .ToListAsync();
            foreach (var child in childFolders)
            {
                await DeleteFolder(child.Id); 
            }

            var files = await _context.Files
                .Where(f => f.FolderId == id && !f.IsDeleted)
                .ToListAsync();
            foreach (var file in files)
            {
                file.IsDeleted = true; 
                _context.Files.Update(file);
            }

            folder.IsDeleted = true;
            _context.Folders.Update(folder);
            await _context.SaveChangesAsync();
            return true;
        }
    }

}
