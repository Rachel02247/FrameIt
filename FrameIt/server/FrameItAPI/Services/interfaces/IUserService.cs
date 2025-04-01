using FrameItAPI.Endpoints;
using FrameItAPI.Entities;

namespace FrameItAPI.Services.interfaces
{
    public interface IUserService
    {
        Task<User> GetUser(int Id);
        Task<User> GetUserByEmail(string email);
        Task<IEnumerable<User>> GetAllUsers();
        Task<User> CreateUser(RegisterModel model);
        Task<User> UpdateUser(User user);
        Task<bool> DeleteUser(int Id);
        Task<string> AuthenticateAsync(string username, string password);

    }
}
