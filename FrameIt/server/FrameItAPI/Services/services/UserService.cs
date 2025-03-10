using FrameItAPI.Entities;
using Microsoft.EntityFrameworkCore;
using FrameItAPI.Services.interfaces;
using FrameItAPI.DataAccess;

namespace FrameItAPI.Services.services
{
    public class UserService : IUserService
    {
        private readonly DataContext _context;

        public UserService(DataContext context)
        {
            _context = context;
        }
        public async Task<User> GetUser(int id) => await _context.Users.FindAsync(id);

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> CreateUser(User User)
        {
            _context.Users.Add(User);
            await _context.SaveChangesAsync();
            return User;
        }

        public async Task<User> UpdateUser(User User)
        {
            _context.Users.Update(User);
            await _context.SaveChangesAsync();
            return User;
        }

        public async Task<bool> DeleteUser(int id)
        {
            var User = await GetUser(id);
            if (User == null) return false;

            _context.Users.Remove(User);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
