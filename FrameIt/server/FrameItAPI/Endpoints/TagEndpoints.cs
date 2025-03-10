using FrameItAPI.Entities;
using FrameItAPI.Services.interfaces;

public static class TagEndpoints
{
    public static void MapTagEndpoints(this IEndpointRouteBuilder routes)
    {
        routes.MapGet("/tags", async (ITagService tagService) =>
        {
            var tags = await tagService.GetAllTags();
            return Results.Ok(tags);
        });

        routes.MapGet("/tags/{id}", async (ITagService tagService, int id) =>
        {
            var tag = await tagService.GetTag(id);
            return tag is not null ? Results.Ok(tag) : Results.NotFound();
        });

        routes.MapPost("/tags", async (ITagService tagService, Tag tag) =>
        {
            var createdTag = await tagService.CreateTag(tag);
            return Results.Created($"/tags/{createdTag.Id}", createdTag);
        });

        routes.MapPut("/tags/{id}", async (ITagService tagService, int id, Tag tag) =>
        {
            tag.Id = id; // עדכון ה-ID של התג
            var updatedTag = await tagService.UpdateTag(tag);
            return Results.Ok(updatedTag);
        });

        routes.MapDelete("/tags/{id}", async (ITagService tagService, int id) =>
        {
            var result = await tagService.DeleteTag(id);
            return result ? Results.NoContent() : Results.NotFound();
        });
    }
}
