using System.ComponentModel.DataAnnotations.Schema;

namespace FrameItAPI.Entities
{
    [Table("File")]
    public class File
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public long Size { get; set; }
        public string S3Key { get; set; }
        public string S3Url { get; set; }
        public int? FolderId { get; set; }
        public int OwnerId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int? TagId { get; set; }
        public bool IsDeleted { get; set; }
    }
}
