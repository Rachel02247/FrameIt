namespace FrameItAPI.Entities
{
    public class File
    {
        public int Id { get; set; } 
        public int UserId { get; set; }
        public int FolderId { get; set; }
        public string Filename { get; set; } 
        public string Url { get; set; } 
        public int Size { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}
