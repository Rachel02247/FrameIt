
using FrameItAPI.DataAccess;
using FrameItAPI.Entities;
using FrameItAPI.Entities.mapping;
using FrameItAPI.Services.interfaces;
using Microsoft.EntityFrameworkCore;
using static FrameItAPI.Entities.mapping.Auth;



namespace FrameItAPI.Endpoints
{
    public static class AuthEndpoints
    {
        public static void MapAuthEndpoints(this IEndpointRouteBuilder routes)
        {

            routes.MapPost("/auth/login", async (LoginModel model, AuthService authService, IUserService userService) =>
            {
                Console.WriteLine($"username: {model.Email}, Password: {model.Password}");

                var roleName = await userService.AuthenticateAsync(model.Email, model.Password);
                Console.WriteLine("Roles: " + string.Join(", ", roleName));

                var user = await userService.GetUserByEmail(model.Email);

                if (string.IsNullOrEmpty(roleName))
                {
                    Console.WriteLine("not found role");
                    return Results.Unauthorized();
                }

                var roles = roleName.Split(",");

                if (roles.Contains("Admin"))
                {
                    var token = authService.GenerateJwtToken(model.Email, roles);
                    return Results.Ok(new { Token = token, User = user });
                }
                else if (roles.Contains("Editor"))
                {
                    var token = authService.GenerateJwtToken(model.Email, roles);
                    return Results.Ok(new
                    {
                        Token = token,
                        User = new
                        {
                            Name = user.Name,
                            Email = user.Email,
                            Id = user.Id,
                            RoleName = user.Role
                        }
                    });
                }
                else if (roles.Contains("Viewer"))
                {
                    var token = authService.GenerateJwtToken(model.Email, roles);
                    return Results.Ok(new { Token = token, User = user });
                }
                return Results.Ok(new { Message = "Unauthorized access", User = user });
            });


            routes.MapPost("/auth/register", async (RegisterModel model, AuthService authService, IUserService userService) =>
                {
                    if (model == null)
                    {
                        return Results.Conflict("User is not valid");
                    }


                    var existingUser = await userService.CreateUser(model);

                    if (existingUser == null)
                        return Results.BadRequest("Failed to create user or assign role");

                    var token = authService.GenerateJwtToken(model.UserName, new[] { model.RoleName });
                    return Results.Ok(new { Token = token, User = existingUser });
                });

            routes.MapPost("/api/change-password", async (ChangePasswordRequest req, DataContext db) =>
            {
                var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
                if (user == null)
                    return Results.NotFound("User not found");

                if (!BCrypt.Net.BCrypt.Verify(req.CurrentPassword, user.PasswordHash))
                    return Results.BadRequest("Current password is incorrect");

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
                user.UpdatedAt = DateTime.UtcNow;

                await db.SaveChangesAsync();
                return Results.Ok("Password changed successfully");
            });

            routes.MapPost("/auth/google-login", async (GoogleLoginRequest request, IGoogleAuthService googleAuthService) =>
            {
                var result = await googleAuthService.LoginOrRegisterWithGoogleAsync(request.Credential);
                if (!result.IsSuccess)
                    return Results.Unauthorized();

                return Results.Ok(new
                {
                    Token = result.Token,
                    User = result.User
                });
            });



        }
    }

   
}
