using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FrameItAPI.Migrations
{
    /// <inheritdoc />
    public partial class FrameItV310 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TagId",
                table: "Files",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TagId",
                table: "Files");
        }
    }
}
