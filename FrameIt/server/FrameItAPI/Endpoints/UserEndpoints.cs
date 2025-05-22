using FrameItAPI.Endpoints;
using FrameItAPI.Entities;
using FrameItAPI.Services.interfaces;
using FrameItAPI.Services.services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this IEndpointRouteBuilder routes)
    {
        routes.MapGet("/users", async (IUserService userService) =>
        {
            var users = await userService.GetAllUsers();
            return Results.Ok(users);
        });
        //.RequireAuthorization("all");

        routes.MapGet("/users/{id}", async (IUserService userService, int id) =>
        {
            var user = await userService.GetUser(id);
            return user is not null ? Results.Ok(user) : Results.NotFound();
        }).RequireAuthorization("all");

        routes.MapPost("/users", async (IUserService userService, RegisterModel user) =>
        {
            var createdUser = await userService.CreateUser(user);
            return Results.Created($"/users/{createdUser.Id}", createdUser);
        });
        //.RequireAuthorization("EditorOrAdmin");

        routes.MapPut("/users/{id}", async (IUserService userService, int id, User user) =>
        {
            user.Id = id;
            var updatedUser = await userService.UpdateUser(user);
            return Results.Ok(updatedUser);
        }).RequireAuthorization("EditorOrAdmin");

        routes.MapDelete("/users/{id}", async (IUserService userService, int id) =>
        {
            var result = await userService.DeleteUser(id);
            return result ? Results.NoContent() : Results.NotFound();
        }).RequireAuthorization("EditorOrAdmin");

    

    }
}
