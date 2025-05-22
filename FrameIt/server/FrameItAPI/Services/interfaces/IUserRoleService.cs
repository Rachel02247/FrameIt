using FrameItAPI.Entities;

namespace FrameItAPI.Services.interfaces
{
    public interface IUserRoleService
    {
        Task<UserRole> AddUserRole(int userId, int roleId);

    }
}
