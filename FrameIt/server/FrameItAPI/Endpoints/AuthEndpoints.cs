
using FrameItAPI.Entities;
using FrameItAPI.Services.interfaces;


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
            }
        }

        public class LoginModel
        {
            //public string UserName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class RegisterModel
        {
            public string UserName { get; set; }
            public string Password { get; set; }
            public string Email { get; set; }
            public string RoleName { get; set; }
        }
    }
