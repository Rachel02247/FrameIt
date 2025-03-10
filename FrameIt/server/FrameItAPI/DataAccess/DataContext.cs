﻿using FrameItAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace FrameItAPI.DataAccess
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users => Set<User>();
        public DbSet<FrameItAPI.Entities.File> Files { get; set; }
        public DbSet<Folder> Folders { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Collage> Collages { get; set; }
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }
    }
}
