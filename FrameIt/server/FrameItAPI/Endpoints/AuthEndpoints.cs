
using FrameItAPI.Entities;
using FrameItAPI.Services.interfaces;


namespace FrameItAPI.Endpoints
{
    public static class AuthEndpoints
    {
        public static void MapAuthEndpoints(WebApplication app)
        {
            app.MapPost("/auth/login", async (LoginModel model, AuthService authService, IUserService userService) =>
            {
                var roleName = await userService.AuthenticateAsync(model.UserEmail, model.Password);
                if (roleName == "admin")
                {
                    var token = authService.GenerateJwtToken(model.UserEmail, new[] { "Admin" });
                    return Results.Ok(new { Token = token });
                }
                else if (roleName == "editor")
                {
                    var token = authService.GenerateJwtToken(model.UserEmail, new[] { "Editor" });
                    return Results.Ok(new { Token = token });
                }
                else if (roleName == "viewer")
                {
                    var token = authService.GenerateJwtToken(model.UserEmail, new[] { "Viewer" });
                    return Results.Ok(new { Token = token });
                }

                return Results.Unauthorized();
            });

            app.MapPost("/auth/register", async (RegisterModel model, AuthService authService, IUserService userService) =>
            {
                if (model == null)
                {
                    return Results.Conflict("User is not valid");
                }

                // הוספת המשתמש ישירות
                var existingUser = await userService.CreateUser(new User
                {
                    Name = model.Name,
                    Password = model.Password, // יש לוודא שהסיסמה נשמרת בצורה מאובטחת
                    Email = model.Email,
                    Role = model.RoleName
                });

                if (existingUser == null)
                    return Results.BadRequest();

                var token = authService.GenerateJwtToken(model.Name, new[] { model.RoleName });
                return Results.Ok(new { Token = token });
            });
        }
    }

    public class LoginModel
    {
        public string UserEmail { get; set; }
        public string Password { get; set; }
    }

    public class RegisterModel
    {
        public string Name { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string RoleName { get; set; }
    }
}
