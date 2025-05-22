using System.ComponentModel.DataAnnotations.Schema;

namespace FrameItAPI.Entities
{
    [Table("Role")]

    public class Role
    {
        public int Id { get; set; }
        public string RoleName { get; set; }
    }
}
