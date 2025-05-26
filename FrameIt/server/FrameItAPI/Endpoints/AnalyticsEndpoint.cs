using FrameItAPI.Services.interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace FrameItAPI.Endpoints
{
    public static class AnalyticsEndpoint
    {
        public static void MapAnalyticsEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGet("/analytics/summary", async (IAnalyticsService analyticsService) =>
            {
                var summary = await analyticsService.GetSummaryStatsAsync();
                return Results.Ok(summary);
            });

            app.MapGet("/analytics/storage-usage", async (IAnalyticsService analyticsService) =>
            {
                var usage = await analyticsService.GetStorageUsageStatsAsync();
                return Results.Ok(usage);
            });

            app.MapGet("/analytics/user-activity", async (IAnalyticsService analyticsService, int days) =>
            {
                var activity = await analyticsService.GetUserActivityStatsAsync(days);
                return Results.Ok(activity);
            });

            app.MapGet("/analytics/collage-creation", async (IAnalyticsService analyticsService, int days) =>
            {
                var stats = await analyticsService.GetCollageCreationStatsAsync(days);
                return Results.Ok(stats);
            });
        }
    }
}
