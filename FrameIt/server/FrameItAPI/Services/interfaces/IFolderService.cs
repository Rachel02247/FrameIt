using FrameItAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace FrameItAPI.Services.interfaces
{
    public interface IFolderService
    {
        Task<Folder> GetFolder(int id);
        Task<IEnumerable<Folder>> GetAllFolders();
        Task<Folder> CreateFolder(Folder folder);
        Task<Folder> UpdateFolder(Folder folder);
        Task<bool> DeleteFolder(int id);
        Task<List<Folder>> GetRootFolders();
        Task<List<Folder>> GetSiblings(int parentId);
        Task<List<Folder>> GetFoldersWithNullParent();
        Task<List<Folder>> GetSubFoldersByFolderId(int folderId);
        Task<Folder> GetParentFolder(int fileId);
        Task<List<Folder>> GetBreadcrumb(int folderId);


    }
}
