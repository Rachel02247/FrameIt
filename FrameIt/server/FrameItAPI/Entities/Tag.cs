using System.ComponentModel.DataAnnotations.Schema;

namespace FrameItAPI.Entities
{
    [Table("Tag")]

    public class Tag
    {
        public int Id { get; set; } 
        public string Name { get; set; }
        public int UserId { get; set; }
    }
}
