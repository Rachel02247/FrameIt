using System.ComponentModel.DataAnnotations;

namespace FrameItAPI.Entities
{
    public class Collage
    {
        public int Id { get; set; } 
        public int? UserId { get; set; }

        [MaxLength(255)]
        public string? Template { get; set; } 
        public DateTime? CreatedAt { get; set; } = DateTime.Now; 
    }
}
