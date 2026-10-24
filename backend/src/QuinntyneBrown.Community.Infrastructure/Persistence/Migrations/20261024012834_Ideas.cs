using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuinntyneBrown.Community.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Ideas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Ideas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OrganizationId = table.Column<Guid>(type: "uuid", nullable: false),
                    AuthorProfileId = table.Column<Guid>(type: "uuid", nullable: true),
                    SubmitterName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    SubmitterEmail = table.Column<string>(type: "character varying(254)", maxLength: 254, nullable: false),
                    Problem = table.Column<string>(type: "character varying(600)", maxLength: 600, nullable: false),
                    Audience = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Title = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    Pitch = table.Column<string>(type: "character varying(140)", maxLength: 140, nullable: false),
                    Solution = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Stage = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    Platform = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    Topics = table.Column<List<string>>(type: "text[]", nullable: false),
                    Skills = table.Column<List<string>>(type: "text[]", nullable: false),
                    Involvement = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    Commitment = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    Status = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    SubmittedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ideas", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ideas_OrganizationId_SubmittedAt",
                table: "Ideas",
                columns: new[] { "OrganizationId", "SubmittedAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Ideas");
        }
    }
}
