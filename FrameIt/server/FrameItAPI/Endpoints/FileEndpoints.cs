using Amazon.S3.Model;
using Amazon.S3;
using FrameItAPI.Services.interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.AspNetCore.Mvc;
using FrameItAPI.Entities.mapping;
using FrameItAPI.Entities.DTOs;
using System.Text.Json;

public static class FileEndpoints
{
    public static void MapFileEndpoints(this IEndpointRouteBuilder routes)
    {
        routes.MapGet("/files", async (IFileService fileService) =>
        {

            var files = await fileService.GetAllFiles();
            return Results.Ok(files);
        });//.RequireAuthorization();

        routes.MapGet("/files/{id}", async (IFileService fileService, int id) =>
        {
            var file = await fileService.GetFile(id);
            return file is not null ? Results.Ok(file) : Results.NotFound();
        }).RequireAuthorization();



        routes.MapPost("/files", async (HttpContext httpContext, IFileService fileService) =>
        {
            try
            {
                var form = await httpContext.Request.ReadFormAsync();
                Console.WriteLine($"in post file: {string.Join(", ", form.Select(kv => $"{kv.Key}={kv.Value}"))}");

                var file = form.Files.GetFile("file");
                if (file == null)
                    return Results.BadRequest("No file uploaded.");

                int? folderId = null;
                int ownerId = 0;
                string? fileMetadataJson = form.TryGetValue("fileMetadata", out var metaVal) ? metaVal.ToString() : null;

                if (int.TryParse(form["folderId"], out var parsedFolderId))
                    folderId = parsedFolderId;
                if (int.TryParse(form["ownerId"], out var parsedOwnerId))
                    ownerId = parsedOwnerId;

                if ((ownerId == 0 || folderId == null) && !string.IsNullOrEmpty(fileMetadataJson))
                {
                    try
                    {
                        var metadata = JsonSerializer.Deserialize<FileMetadataDto>(fileMetadataJson);
                        if (metadata != null)
                        {
                            if (ownerId == 0)
                                ownerId = metadata.OwnerId;
                            if (folderId == null)
                                folderId = metadata.FolderId;
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Metadata parse error: " + ex);
                        return Results.BadRequest("Invalid fileMetadata JSON: " + ex.Message);
                    }
                }

                //if (ownerId == 0)
                //    return Results.BadRequest("Missing OwnerId.");
                if (folderId == null)
                    return Results.BadRequest("Missing FolderId.");

                var fileType = file.ContentType.ToLower();
                var newFile = new FrameItAPI.Entities.File
                {
                    FileName = file.FileName,
                    FolderId = folderId,
                    IsDeleted = false,
                    S3Key = file.FileName,
                    OwnerId = ownerId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    FileType = file.ContentType,
                    Size = file.Length
                };

                using var stream = file.OpenReadStream();
                FrameItAPI.Entities.File createdFile;

                if (fileType.StartsWith("image/"))
                {
                    createdFile = await fileService.CreateImageFileWithResize(newFile, stream);
                }
                else
                {
                    createdFile = await fileService.CreateFile(newFile, stream);
                }

                return Results.Created($"/files/{createdFile.Id}", createdFile);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(ex.Message);
            }
        });



        routes.MapPut("/files/{id}", async (IFileService fileService, int id, FrameItAPI.Entities.File file) =>
        {
            file.Id = id;
            var updatedFile = await fileService.UpdateFile(file);
            return Results.Ok(updatedFile);
        });//.RequireAuthorization("admin", "editor");

        routes.MapDelete("/files/{id}", async (IFileService fileService, int id) =>
        {
            var result = await fileService.DeleteFile(id);
            return result ? Results.NoContent() : Results.NotFound();
        });//.RequireAuthorization("admin", "editor");


        routes.MapGet("/files/{s3Key}/download", async (string s3Key, IFileService fileService) =>
        {
           
                Console.WriteLine($" in mapget download");
                Console.WriteLine($" in mapget file name: {s3Key}");
                var fileUrl = await fileService.Download(s3Key); // מקבל את ה-URL
                Console.WriteLine($" in mapget file url after download: {fileUrl}");
                Console.WriteLine($" ------------------------"); Console.WriteLine();
                return fileUrl;

            
        });
        //routes.MapGet("/files/{s3Key}/download", async (string s3Key, IFileService fileService) =>
        //{
        //    try
        //    {
        //        Console.WriteLine($" in mapget download");
        //        Console.WriteLine($" in mapget file name: {s3Key}");
        //        var fileUrl = await fileService.Download(s3Key); // מקבל את ה-URL
        //        Console.WriteLine($" in mapget file url after download: {fileUrl}");
        //        Console.WriteLine($" ------------------------"); Console.WriteLine();
        //        return fileUrl;

        //        if (string.IsNullOrEmpty(fileUrl))
        //            return Results.NotFound("File not found.");

        //        using var httpClient = new HttpClient();
        //        var response = await httpClient.GetAsync(fileUrl);

        //        if (!response.IsSuccessStatusCode)
        //            return Results.Problem("Failed to fetch file from S3.");

        //        var fileBytes = await response.Content.ReadAsByteArrayAsync();
        //        var contentType = response.Content.Headers.ContentType?.ToString() ?? "application/octet-stream";

        //        return Results.File(fileBytes, contentType, s3Key);
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"Error: {ex.Message}");
        //        return Results.Problem("An error occurred.");
        //    }
        //    return ;
        //});



        routes.MapGet("/files/{id}/downloadToComputer", async (int id, IFileService fileService) =>
        {
            try
            {
                var fileStream = await fileService.DownloadFile(id);
                if (fileStream == null)
                {
                    return Results.NotFound("File not found");
                }

                // החזרת הקובץ ללקוח (עם סוג MIME שמזוהה לפי הסיומת)
                return Results.File(fileStream, "application/octet-stream", "downloadedFile");

            }
            catch (Exception ex)
            {
                return Results.NotFound(ex.Message);
            }
        });

        routes.MapGet("/files/generate-url", async (string s3Key, IFileService fileService) =>
        {
            return await fileService.GetPresignedUrl(s3Key);
        });

        routes.MapGet("/files/myfiles/{userId}", async (int userId, IFileService fileService) =>
        {
            return await fileService.GetFilesByaUserId(userId);
        });
           // .RequireAuthorization("admin", "editor");

    }
}
