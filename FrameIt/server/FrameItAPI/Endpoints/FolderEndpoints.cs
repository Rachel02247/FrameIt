using FrameItAPI.Entities;
using FrameItAPI.Services.interfaces;
using Microsoft.AspNetCore.Mvc;

public static class FolderEndpoints
{
    public static void MapFolderEndpoints(this IEndpointRouteBuilder routes)
    {
        routes.MapGet("/folders", async (IFolderService folderService) =>
        {
            var folders = await folderService.GetAllFolders();
            return Results.Ok(folders);
        });//.RequireAuthorization();

        routes.MapGet("/folders/{id}", async (IFolderService folderService, int id) =>
        {
            var folder = await folderService.GetFolder(id);
            return folder is not null ? Results.Ok(folder) : Results.NotFound();
        }).RequireAuthorization();

        routes.MapGet("/folders/{id?}/contents", async (int? id, IFolderService folderService, IFileService fileService) =>
        {
            int folderId = id ?? 0;

            var folder = folderId == 0 ? null : await folderService.GetFolder(folderId);
            if (folderId != 0 && folder == null) 
                return Results.NotFound("Folder not found");

            var subFolders = await folderService.GetSubFoldersByFolderId(folderId); 
            var files = await fileService.GetFilesByFolderId(folderId); 

            return Results.Ok(new { folders = subFolders, files = files });
        });

        routes.MapGet("/folders/{id}/parent", async (int id, IFolderService folderService) =>
        {
            var parentFolder = await folderService.GetParentFolder(id);
            return parentFolder != null ? Results.Ok(parentFolder) : Results.NotFound();
        });

        routes.MapGet("/folders/{id?}/breadcrumb", async (int id, IFolderService folderService) =>
        {
            var breadcrumb = await folderService.GetBreadcrumb(id);
            return breadcrumb != null ? Results.Ok(breadcrumb) : Results.NotFound();
        });

        routes.MapPost("/folders", async (IFolderService folderService, [FromBody] Folder folder) =>
        {
            var createdFolder = await folderService.CreateFolder(folder);
            return Results.Created($"/folders/{createdFolder.Id}", createdFolder);
        });
        //.RequireAuthorization("admin", "editor");

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
