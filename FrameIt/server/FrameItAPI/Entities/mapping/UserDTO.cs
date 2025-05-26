namespace FrameItAPI.Entities.mapping
{
    public class UserDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string RoleName { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

}
