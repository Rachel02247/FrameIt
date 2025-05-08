using Amazon.S3.Model;
using Amazon.S3;
using FrameItAPI.Services.interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.StaticFiles;

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


        routes.MapPost("/files", async (IFileService fileService, HttpContext httpContext) =>
        {
            try
            {
                var form = await httpContext.Request.ReadFormAsync();
                var file = form.Files.GetFile("file"); // קבלת הקובץ מהבקשה

                if (file == null)
                    return Results.BadRequest("No file uploaded.");

                if (file.Length > 5 * 1024 * 1024)
                    return Results.BadRequest("The file size exceeds the maximum limit of 5MB.");

                // יצירת אובייקט FrameItAPI.Entities.File מהנתונים שהתקבלו
                var newFile = new FrameItAPI.Entities.File
                {
                    FileName = file.FileName,
                    FileType = file.ContentType,
                    FolderId = int.TryParse(form["FolderId"], out var folderId) ? folderId : (int?)null,
                    IsDeleted = false,
                    Size = file.Length,
                    S3Key = $"{form["FolderId"]}/{file.FileName}", // יצירת נתיב לקובץ
                    OwnerId = int.Parse(form["OwnerId"])
                };

                using var fileStream = file.OpenReadStream();
                var createdFile = await fileService.CreateFile(newFile, fileStream);

                return Results.Created($"/files/{createdFile.Id}", createdFile);
            }
            catch (Exception ex)
            {
                // החזרת תשובה עם פרטי השגיאה
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
        }).RequireAuthorization("admin", "editor");


        routes.MapGet("/files/{fileName}/download", async (string fileName, IFileService fileService) =>
        {
            try
            {
                var fileUrl = await fileService.Download(fileName); // מקבל את ה-URL

                if (string.IsNullOrEmpty(fileUrl))
                    return Results.NotFound("File not found.");

                using var httpClient = new HttpClient();
                var response = await httpClient.GetAsync(fileUrl);

                if (!response.IsSuccessStatusCode)
                    return Results.Problem("Failed to fetch file from S3.");

                var fileBytes = await response.Content.ReadAsByteArrayAsync();
                var contentType = response.Content.Headers.ContentType?.ToString() ?? "application/octet-stream";

                return Results.File(fileBytes, contentType, fileName);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return Results.Problem("An error occurred.");
            }
        });



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

    }
}
