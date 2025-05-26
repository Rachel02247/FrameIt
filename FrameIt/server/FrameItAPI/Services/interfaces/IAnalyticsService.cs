namespace FrameItAPI.Services.interfaces
{
    public interface IAnalyticsService
    {
        Task<object> GetSummaryStatsAsync();
        Task<object> GetStorageUsageStatsAsync();
        Task<object> GetUserActivityStatsAsync(int days);
        Task<object> GetCollageCreationStatsAsync(int days);
    }
}
