using FrameItAPI.Entities;
using FrameItAPI.Services.interfaces;
using Microsoft.AspNetCore.Mvc;
using System.IO.Compression;

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

        routes.MapGet("/folders/myFiles/{userId}", async (IFolderService folderService, int userId) =>
        {
            var folders = await folderService.GetFoldersByUserId(userId);
            return Results.Ok(folders);
        });//.RequireAuthorization();

        routes.MapGet("/folders/{folderId?}/contents/{userId}", async (int? folderId, int userId, IFolderService folderService, IFileService fileService) =>
        {
            int cur_folderId = folderId ?? 0;

            var folder = cur_folderId == 0 ? null : await folderService.GetFolder(cur_folderId);
            if (cur_folderId != 0 && folder == null)
                return Results.NotFound("Folder not found");

            var subFolders = await folderService.GetSubFoldersByFolderId(cur_folderId, userId);
            var files = await fileService.GetFilesByFolderId(cur_folderId, userId);

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

        routes.MapGet("/folders/{id}/download", async (int id, IFolderService folderService, IFileService fileService) =>
        {
            var folder = await folderService.GetFolder(id);
            if (folder == null) return Results.NotFound("Folder not found");

            var allFiles = await folderService.GetAllFilesInFolder(id, folder.Name);

            using var memoryStream = new MemoryStream();
            using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
            {
                foreach (var (relativePath, file) in allFiles)
                {
                    var entry = archive.CreateEntry(relativePath);
                    using var entryStream = entry.Open();

                    var fileContent = await fileService.GetFileContent(file.Id);
                    if (fileContent != null)
                    {
                        await entryStream.WriteAsync(fileContent, 0, fileContent.Length);
                    }
                }
            }
            memoryStream.Seek(0, SeekOrigin.Begin);
            return Results.File(memoryStream.ToArray(), "application/zip", $"{folder.Name}.zip");
        });
    }
}
