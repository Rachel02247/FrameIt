using FrameItAPI.Services.interfaces;

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

        routes.MapPost("/files", async (IFileService fileService, FrameItAPI.Entities.File file) =>
        {
            if (file.Size > 5 * 1024 * 1024)
                return Results.BadRequest("The file size exceeds the maximum limit of 5MB.");

            var createdFile = await fileService.CreateFile(file);
            return Results.Created($"/files/{createdFile.Id}", createdFile);
        });//.RequireAuthorization("admin", "editor");

        routes.MapPut("/files/{id}", async (IFileService fileService, int id, FrameItAPI.Entities.File file) =>
        {
            file.Id = id;
            var updatedFile = await fileService.UpdateFile(file);
            return Results.Ok(updatedFile);
        }).RequireAuthorization("admin", "editor");

        routes.MapDelete("/files/{id}", async (IFileService fileService, int id) =>
        {
            var result = await fileService.DeleteFile(id);
            return result ? Results.NoContent() : Results.NotFound();
        }).RequireAuthorization("admin", "editor");
    }
}
