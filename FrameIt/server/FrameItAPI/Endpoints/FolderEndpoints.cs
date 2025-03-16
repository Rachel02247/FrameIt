using FrameItAPI.Entities;
using FrameItAPI.Services.interfaces;

public static class FolderEndpoints
{
    public static void MapFolderEndpoints(this IEndpointRouteBuilder routes)
    {
        routes.MapGet("/folders", async (IFolderService folderService) =>
        {
            var folders = await folderService.GetAllFolders();
            return Results.Ok(folders);
        }).RequireAuthorization();

        routes.MapGet("/folders/{id}", async (IFolderService folderService, int id) =>
        {
            var folder = await folderService.GetFolder(id);
            return folder is not null ? Results.Ok(folder) : Results.NotFound();
        }).RequireAuthorization();

        routes.MapPost("/folders", async (IFolderService folderService, Folder folder) =>
        {
            var createdFolder = await folderService.CreateFolder(folder);
            return Results.Created($"/folders/{createdFolder.Id}", createdFolder);
        }).RequireAuthorization("admin", "editor");

        routes.MapPut("/folders/{id}", async (IFolderService folderService, int id, Folder folder) =>
        {
            folder.Id = id; // עדכון ה-ID של התיקייה
            var updatedFolder = await folderService.UpdateFolder(folder);
            return Results.Ok(updatedFolder);
        }).RequireAuthorization("admin", "editor");

        routes.MapDelete("/folders/{id}", async (IFolderService folderService, int id) =>
        {
            var result = await folderService.DeleteFolder(id);
            return result ? Results.NoContent() : Results.NotFound();
        }).RequireAuthorization("admin", "editor");
    }
}
