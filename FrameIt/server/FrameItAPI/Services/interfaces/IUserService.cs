using FrameItAPI.Entities;

namespace FrameItAPI.Services.interfaces
{
    public interface IUserService
    {
        Task<User> GetUser(int Id);
        Task<IEnumerable<User>> GetAllUsers();
        Task<User> CreateUser(User user);
        Task<User> UpdateUser(User user);
        Task<bool> DeleteUser(int Id);
    }
}
