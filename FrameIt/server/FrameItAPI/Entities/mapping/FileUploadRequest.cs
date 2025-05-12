namespace FrameItAPI.Entities.mapping
{
    public class FileUploadRequest
    {
        public string FileName { get; set; }
        public string FileType { get; set; }
        public long Size { get; set; }
        public string S3Key { get; set; }
        public int FolderId { get; set; }
        public int OwnerId { get; set; }
        public bool IsDeleted { get; set; }
    }

}
