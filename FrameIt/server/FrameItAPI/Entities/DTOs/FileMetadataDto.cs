namespace FrameItAPI.Entities.DTOs
{
    public class FileMetadataDto
    {
        public string Id { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public long Size { get; set; }
        public string S3Key { get; set; }
        public bool IsDeleted { get; set; }
        public int? FolderId { get; set; }
        public int OwnerId { get; set; }
    }
}
