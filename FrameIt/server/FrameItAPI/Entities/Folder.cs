﻿namespace FrameItAPI.Entities
{
    public class Folder
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int? ParentId { get; set; } 
        public string Name { get; set; } 
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now; 
    }
}
