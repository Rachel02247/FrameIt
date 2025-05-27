using FrameItAPI.Services.interfaces;
using FrameItAPI.DataAccess;
using Microsoft.EntityFrameworkCore;

namespace FrameItAPI.Services.services
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly DataContext _context;

        public AnalyticsService(DataContext context)
        {
            _context = context;
        }

        public async Task<object> GetSummaryStatsAsync()
        {
            var users = await _context.Users.CountAsync();
            var files = await _context.Files.CountAsync();
            var usedStorageBytes = await _context.Files.Where(f => !f.IsDeleted).SumAsync(f => (long?)f.Size) ?? 0L;
            var usedStorage = Math.Round(usedStorageBytes / (1024.0 * 1024.0), 2);



            return new { users, files, usedStorage };
        }

        public async Task<object> GetStorageUsageStatsAsync()
        {
            var totalStorage = 1024L * 1024 * 1024 * 5;
            var usedStorage = await _context.Files.Where(f => !f.IsDeleted).SumAsync(f => (long?)f.Size) ?? 0L;

            return new { totalStorage, usedStorage };
        }

        public async Task<object> GetUserActivityStatsAsync(int days)
        {
            var since = DateTime.UtcNow.AddDays(-days);
            var activeUsers = await _context.Users
                .Where(u => u.UpdatedAt >= since)
                .CountAsync();

            return new { activeUsers, days };
        }

        public async Task<object> GetCollageCreationStatsAsync(int days)
        {
            var since = DateTime.UtcNow.AddDays(-days);
            var collagesCreated = await _context.Collages
                .Where(c => c.CreatedAt != null && c.CreatedAt >= since)
                .CountAsync();

            return new { collagesCreated, days };
        }
    }
}
