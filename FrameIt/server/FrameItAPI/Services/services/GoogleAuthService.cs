
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using FrameItAPI.DataAccess;
using FrameItAPI.Entities;
using FrameItAPI.Services.interfaces;
using static FrameItAPI.Entities.mapping.Auth;

namespace FrameItAPI.Services.services
{
    public class GoogleAuthService : IGoogleAuthService
    {
        private readonly DataContext _db;
        private readonly AuthService _authService;
        private readonly IUserRoleService _userRoleService;
        private readonly IConfiguration _config;

        public GoogleAuthService(DataContext db, AuthService authService, IUserRoleService userRoleService, IConfiguration config)
        {
            _db = db;
            _authService = authService;
            _userRoleService = userRoleService;
            _config = config;
        }

        public async Task<GoogleLoginResult> LoginOrRegisterWithGoogleAsync(string credential)
        {
            var clientId = _config["Google:ClientId"];
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { clientId }
            };

            GoogleJsonWebSignature.Payload payload;

            try
            {
                payload = await GoogleJsonWebSignature.ValidateAsync(credential, settings);
            }
            catch
            {
                return new GoogleLoginResult { IsSuccess = false };
            }

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == payload.Email);

            if (user == null)
            {
                user = new User
                {
                    Name = payload.Name,
                    Email = payload.Email,
                    Role = "Editor",
                    CreatedAt = DateTime.UtcNow
                };

                _db.Users.Add(user);
                await _db.SaveChangesAsync();

                var role = await _db.Roles.FirstOrDefaultAsync(r => r.RoleName == user.Role);
                if (role != null)
                {
                    await _userRoleService.AddUserRole(user.Id, role.Id);
                    await _db.SaveChangesAsync();
                }
            }

            var roles = new[] { user.Role ?? "Editor" };
            var token = _authService.GenerateJwtToken(user.Email, roles);

            return new GoogleLoginResult
            {
                IsSuccess = true,
                Token = token,
                User = new
                {
                    Name = user.Name,
                    Email = user.Email,
                    Id = user.Id,
                    RoleName = user.Role
                }
            };
        }
    }

}
