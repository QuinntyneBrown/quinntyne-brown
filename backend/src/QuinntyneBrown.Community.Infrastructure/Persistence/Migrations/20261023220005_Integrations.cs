using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace QuinntyneBrown.Community.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Integrations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DataProtectionKeys",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FriendlyName = table.Column<string>(type: "text", nullable: true),
                    Xml = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DataProtectionKeys", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IntegrationApps",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OrganizationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    SourceId = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    SecretCiphertext = table.Column<string>(type: "text", nullable: false),
                    SecretPrefix = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    PreviousSecretCiphertext = table.Column<string>(type: "text", nullable: true),
                    PreviousSecretExpiresAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    CreatedById = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    RotatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    RevokedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    RevokedById = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IntegrationApps", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IntegrationEvents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IntegrationAppId = table.Column<Guid>(type: "uuid", nullable: false),
                    OrganizationId = table.Column<Guid>(type: "uuid", nullable: false),
                    EventId = table.Column<Guid>(type: "uuid", nullable: false),
                    EventType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    OccurredAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ReceivedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    DataJson = table.Column<string>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IntegrationEvents", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_IntegrationApps_OrganizationId",
                table: "IntegrationApps",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_IntegrationApps_SourceId",
                table: "IntegrationApps",
                column: "SourceId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_IntegrationEvents_IntegrationAppId_EventId",
                table: "IntegrationEvents",
                columns: new[] { "IntegrationAppId", "EventId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_IntegrationEvents_IntegrationAppId_ReceivedAt",
                table: "IntegrationEvents",
                columns: new[] { "IntegrationAppId", "ReceivedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_IntegrationEvents_OrganizationId",
                table: "IntegrationEvents",
                column: "OrganizationId");

            // The seed inserts only what is missing, so rows it created earlier gain the integrations feature and the
            // Staff and Portfolio roles gain integrations.view here (ADR 0042). Ids are HierarchySeed's.
            migrationBuilder.Sql("""
                UPDATE "OrgTypes" SET "EnabledFeatures" = array_append("EnabledFeatures", 'integrations')
                WHERE "Id" IN ('0a7e6c41-0000-4000-8000-000000000010', '0a7e6c41-0000-4000-8000-000000000020')
                  AND NOT ('integrations' = ANY("EnabledFeatures"));
                UPDATE "CrossOrgRoles" SET "Permissions" = array_append("Permissions", 'integrations.view')
                WHERE "Id" IN ('0a7e6c41-0000-4000-8000-000000001001', '0a7e6c41-0000-4000-8000-000000001002')
                  AND NOT ('integrations.view' = ANY("Permissions"));
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE "OrgTypes" SET "EnabledFeatures" = array_remove("EnabledFeatures", 'integrations');
                UPDATE "CrossOrgRoles" SET "Permissions" = array_remove(array_remove("Permissions", 'integrations.view'), 'integrations.manage');
                UPDATE "OrgTypes" SET "MemberPermissions" = array_remove(array_remove("MemberPermissions", 'integrations.view'), 'integrations.manage');
                UPDATE "RoleDefinitions" SET "Permissions" = array_remove(array_remove("Permissions", 'integrations.view'), 'integrations.manage');
                """);

            migrationBuilder.DropTable(
                name: "DataProtectionKeys");

            migrationBuilder.DropTable(
                name: "IntegrationApps");

            migrationBuilder.DropTable(
                name: "IntegrationEvents");
        }
    }
}
