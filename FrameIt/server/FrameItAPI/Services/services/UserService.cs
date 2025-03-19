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

        public async Task<User> CreateUser(User user)
        {
            var userExists = await _context.Users
                     .AnyAsync(u => u.Email == user.Email);
            if (!userExists)
            {
                user.PasswordHash = user.Password.GetHashCode().ToString();

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }
            return user;
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
        public async Task<string> AuthenticateAsync(string email, string password)
        {
            User user = await _context.Users.FindAsync(email) ?? null;
            if (user == null || !user.Password.Equals(password))
            {
                return null;
            }
           
            return "succed";
        }
    }
}
