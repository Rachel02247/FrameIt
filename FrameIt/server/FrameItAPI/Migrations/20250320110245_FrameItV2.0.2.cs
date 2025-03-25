using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FrameItAPI.Migrations
{
    /// <inheritdoc />
    public partial class FrameItV202 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "S3Url",
                table: "Files",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "S3Url",
                table: "Files");
        }
    }
}
