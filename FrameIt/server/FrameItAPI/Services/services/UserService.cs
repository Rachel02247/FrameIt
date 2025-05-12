using FrameItAPI.Entities;
using Microsoft.EntityFrameworkCore;
using FrameItAPI.Services.interfaces;
using FrameItAPI.DataAccess;
using FrameItAPI.Endpoints;
using Org.BouncyCastle.Crypto.Generators;
using Sprache;

namespace FrameItAPI.Services.services
{
    public class UserService : IUserService
    {
        private readonly DataContext _context;
        private readonly IUserRoleService _userRoleService;


        public UserService(DataContext context, IUserRoleService userRoleService)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _userRoleService = userRoleService ?? throw new ArgumentNullException(nameof(userRoleService));
        }
        public async Task<User> GetUser(int id) => await _context.Users.FindAsync(id);
        public async Task<User> GetUserByEmail(string email)
        {
            return await _context.Users.SingleOrDefaultAsync(u => u.Email == email);
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> CreateUser(RegisterModel model)
        {
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);
            var user = new User
            {
                Name = model.UserName,
                Password = hashedPassword,
                Email = model.Email,
                Role = model.RoleName ?? "Editor"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();


            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == user.Role);
            Console.WriteLine($"find role:  {user.Role}");

            if (role == null)
            {
                Console.WriteLine("not found");
                return null; 
            }

            await _userRoleService.AddUserRole(user.Id, role.Id);
            await _context.SaveChangesAsync();  
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
            Console.WriteLine("find user");
            User user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                Console.WriteLine("not found or wrong password");
                return null;
            }
            Console.WriteLine("user!!!: " + user.Id);
            var roles = await _context.UserRoles
                .Where(ur => ur.UserId == user.Id)
                .Include(ur => ur.Role)
                .Select(ur => ur.Role.RoleName)
                .ToArrayAsync();

            Console.WriteLine($"user roles: {string.Join(", ", roles)}");

            return roles.Length > 0 ? string.Join(",", roles) : user.Role;
        }

  
    }
}

