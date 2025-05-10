using FrameItAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace FrameItAPI.DataAccess
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Entities.File> Files { get; set; }
        public DbSet<Folder> Folders { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Collage> Collages { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }
     
    }
}
