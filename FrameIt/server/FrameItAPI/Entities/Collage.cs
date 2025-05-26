
using System.ComponentModel.DataAnnotations.Schema;

namespace FrameItAPI.Entities
{
    [Table("Collage")]
    public class Collage
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string? Template { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
