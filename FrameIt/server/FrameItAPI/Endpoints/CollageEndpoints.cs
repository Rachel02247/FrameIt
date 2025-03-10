using FrameItAPI.Entities;
using FrameItAPI.Services.interfaces;

public static class CollageEndpoints
{
    public static void MapCollageEndpoints(this IEndpointRouteBuilder routes)
    {
        routes.MapGet("/collages", async (ICollageService collageService) =>
        {
            var collages = await collageService.GetAllCollages();
            return Results.Ok(collages);
        });

        routes.MapGet("/collages/{id}", async (ICollageService collageService, int id) =>
        {
            var collage = await collageService.GetCollage(id);
            return collage is not null ? Results.Ok(collage) : Results.NotFound();
        });

        routes.MapPost("/collages", async (ICollageService collageService, Collage collage) =>
        {
            var createdCollage = await collageService.CreateCollage(collage);
            return Results.Created($"/collages/{createdCollage.Id}", createdCollage);
        });

        routes.MapPut("/collages/{id}", async (ICollageService collageService, int id, Collage collage) =>
        {
            collage.Id = id; 
            var updatedCollage = await collageService.UpdateCollage(collage);
            return Results.Ok(updatedCollage);
        });

        routes.MapDelete("/collages/{id}", async (ICollageService collageService, int id) =>
        {
            var result = await collageService.DeleteCollage(id);
            return result ? Results.NoContent() : Results.NotFound();
        });
    }
}
