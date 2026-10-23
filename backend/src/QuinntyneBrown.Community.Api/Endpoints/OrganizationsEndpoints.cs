using QuinntyneBrown.Community.Application.Organizations;

namespace QuinntyneBrown.Community.Api.Endpoints;

/// <summary>An org's members and Org Leads (L2-143, ADR 0041); org, type and catalogue admin (L2-134, L2-156).</summary>
public static class OrganizationsEndpoints
{
    public static IEndpointRouteBuilder MapOrganizationsEndpoints(this IEndpointRouteBuilder app)
    {
        var members = app.MapGroup("/api/organizations/{orgId:guid}/members");

        members.MapGet("", async (Guid orgId, string? q, bool? includeAgents, MembersHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, list) = await handler.ListAsync(orgId, q, includeAgents ?? false, cancellationToken);
            return result.ToHttp(() => Results.Ok(list));
        });

        members.MapPost("", async (Guid orgId, AddMemberCommand command, MembersHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, member) = await handler.AddAsync(orgId, command, cancellationToken);
            return result.ToHttp(() => Results.Created($"/api/organizations/{orgId}/members/{member!.ProfileId}", member));
        });

        members.MapDelete("/{profileId:guid}", async (Guid orgId, Guid profileId, MembersHandler handler, CancellationToken cancellationToken) =>
            (await handler.RemoveAsync(orgId, profileId, cancellationToken)).ToHttp(Results.NoContent));

        members.MapPut("/{profileId:guid}/org-lead", async (Guid orgId, Guid profileId, MembersHandler handler, CancellationToken cancellationToken) =>
            (await handler.SetOrgLeadAsync(orgId, profileId, isLead: true, cancellationToken)).ToHttp(Results.NoContent));

        members.MapDelete("/{profileId:guid}/org-lead", async (Guid orgId, Guid profileId, MembersHandler handler, CancellationToken cancellationToken) =>
            (await handler.SetOrgLeadAsync(orgId, profileId, isLead: false, cancellationToken)).ToHttp(Results.NoContent));

        var branding = app.MapGroup("/api/organizations/{orgId:guid}/branding");

        branding.MapPut("", async (Guid orgId, SaveBrandingCommand command, BrandingHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, saved) = await handler.SaveAsync(orgId, command, cancellationToken);
            return result.ToHttp(() => Results.Ok(saved));
        });

        branding.MapPut("/logo", async (Guid orgId, IFormFile? file, BrandingHandler handler, CancellationToken cancellationToken) =>
            {
                if (file is null)
                {
                    return Results.ValidationProblem(new Dictionary<string, string[]> { ["logo"] = ["Choose a logo to upload."] });
                }

                await using var content = file.OpenReadStream();
                var (result, saved) = await handler.UploadLogoAsync(orgId, new UploadLogoCommand(content, file.FileName, file.Length), cancellationToken);
                return result.ToHttp(() => Results.Ok(saved));
            })
            .DisableAntiforgery();

        branding.MapDelete("/logo", async (Guid orgId, BrandingHandler handler, CancellationToken cancellationToken) =>
            (await handler.DeleteLogoAsync(orgId, cancellationToken)).ToHttp(Results.NoContent));

        var portfolioTypes = app.MapGroup("/api/portfolios/{portfolioId:guid}/org-types");

        portfolioTypes.MapGet("", async (Guid portfolioId, OrgTypesHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, types) = await handler.ListAsync(portfolioId, cancellationToken);
            return result.ToHttp(() => Results.Ok(types));
        });

        portfolioTypes.MapPost("", async (Guid portfolioId, CreateOrgTypeCommand command, OrgTypesHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, type) = await handler.CreateAsync(portfolioId, command, cancellationToken);
            return result.ToHttp(() => Results.Created($"/api/org-types/{type!.Id}", type));
        });

        var orgTypes = app.MapGroup("/api/org-types/{id:guid}");

        orgTypes.MapGet("", async (Guid id, OrgTypesHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, type) = await handler.GetAsync(id, cancellationToken);
            return result.ToHttp(() => Results.Ok(type));
        });

        orgTypes.MapPut("", async (Guid id, UpdateOrgTypeCommand command, OrgTypesHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, type) = await handler.UpdateAsync(id, command, cancellationToken);
            return result.ToHttp(() => Results.Ok(type));
        });

        orgTypes.MapPut("/features", async (Guid id, SetFeaturesCommand command, OrgTypesHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, type) = await handler.SetFeaturesAsync(id, command, cancellationToken);
            return result.ToHttp(() => Results.Ok(type));
        });

        orgTypes.MapPost("/roles", async (Guid id, RoleDefinitionRequest request, OrgTypesHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, role) = await handler.CreateRoleAsync(id, request, cancellationToken);
            return result.ToHttp(() => Results.Created($"/api/org-types/{id}/roles/{role!.Id}", role));
        });

        orgTypes.MapPut("/roles/order", async (Guid id, ReorderRolesCommand command, OrgTypesHandler handler, CancellationToken cancellationToken) =>
            (await handler.ReorderAsync(id, command, cancellationToken)).ToHttp(Results.NoContent));

        orgTypes.MapPut("/roles/{roleId:guid}", async (Guid id, Guid roleId, RoleDefinitionRequest request, OrgTypesHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, role) = await handler.UpdateRoleAsync(id, roleId, request, cancellationToken);
            return result.ToHttp(() => Results.Ok(role));
        });

        orgTypes.MapDelete("/roles/{roleId:guid}", async (Guid id, Guid roleId, OrgTypesHandler handler, CancellationToken cancellationToken) =>
            (await handler.DeleteRoleAsync(id, roleId, cancellationToken)).ToHttp(Results.NoContent));

        var portfolioOrgs = app.MapGroup("/api/portfolios/{portfolioId:guid}/organizations");

        portfolioOrgs.MapGet("", async (Guid portfolioId, bool? archived, OrganizationAdminHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, orgs) = await handler.ListAsync(portfolioId, archived ?? false, cancellationToken);
            return result.ToHttp(() => Results.Ok(orgs));
        });

        portfolioOrgs.MapPost("", async (Guid portfolioId, CreateOrganizationCommand command, OrganizationAdminHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, org) = await handler.CreateAsync(portfolioId, command, cancellationToken);
            return result.ToHttp(() => Results.Created($"/api/organizations/{org!.Id}", org));
        });

        var organization = app.MapGroup("/api/organizations/{orgId:guid}");

        organization.MapGet("", async (Guid orgId, OrganizationAdminHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, org) = await handler.GetAsync(orgId, cancellationToken);
            return result.ToHttp(() => Results.Ok(org));
        });

        organization.MapPut("", async (Guid orgId, UpdateOrganizationCommand command, OrganizationAdminHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, org) = await handler.UpdateAsync(orgId, command, cancellationToken);
            return result.ToHttp(() => Results.Ok(org));
        });

        organization.MapPost("/archive", async (Guid orgId, OrganizationAdminHandler handler, CancellationToken cancellationToken) =>
            (await handler.ArchiveAsync(orgId, archive: true, cancellationToken)).ToHttp(Results.NoContent));

        organization.MapPost("/restore", async (Guid orgId, OrganizationAdminHandler handler, CancellationToken cancellationToken) =>
            (await handler.ArchiveAsync(orgId, archive: false, cancellationToken)).ToHttp(Results.NoContent));

        var portfolioCrossOrg = app.MapGroup("/api/portfolios/{portfolioId:guid}/cross-org-roles");

        portfolioCrossOrg.MapGet("", async (Guid portfolioId, CrossOrgRolesHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, roles) = await handler.ListAsync(portfolioId, cancellationToken);
            return result.ToHttp(() => Results.Ok(roles));
        });

        portfolioCrossOrg.MapPost("", async (Guid portfolioId, CrossOrgRoleRequest request, CrossOrgRolesHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, role) = await handler.CreateAsync(portfolioId, request, cancellationToken);
            return result.ToHttp(() => Results.Created($"/api/cross-org-roles/{role!.Id}", role));
        });

        var crossOrg = app.MapGroup("/api/cross-org-roles/{id:guid}");

        crossOrg.MapPut("", async (Guid id, CrossOrgRoleRequest request, CrossOrgRolesHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, role) = await handler.UpdateAsync(id, request, cancellationToken);
            return result.ToHttp(() => Results.Ok(role));
        });

        crossOrg.MapGet("/assignments", async (Guid id, CrossOrgRolesHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, assignments) = await handler.AssignmentsAsync(id, cancellationToken);
            return result.ToHttp(() => Results.Ok(assignments));
        });

        crossOrg.MapPost("/assignments", async (Guid id, AssignCrossOrgCommand command, CrossOrgRolesHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, assignment) = await handler.AssignAsync(id, command, cancellationToken);
            return result.ToHttp(() => Results.Created($"/api/cross-org-roles/{id}/assignments/{assignment!.Id}", assignment));
        });

        crossOrg.MapPut("/assignments/{assignmentId:guid}", async (Guid id, Guid assignmentId, NarrowAssignmentCommand command, CrossOrgRolesHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, assignment) = await handler.NarrowAsync(id, assignmentId, command, cancellationToken);
            return result.ToHttp(() => Results.Ok(assignment));
        });

        crossOrg.MapDelete("/assignments/{assignmentId:guid}", async (Guid id, Guid assignmentId, CrossOrgRolesHandler handler, CancellationToken cancellationToken) =>
            (await handler.UnassignAsync(id, assignmentId, cancellationToken)).ToHttp(Results.NoContent));

        var agents = app.MapGroup("/api/agents");

        agents.MapGet("", async (Guid portfolioId, AgentsHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, list) = await handler.ListAsync(portfolioId, cancellationToken);
            return result.ToHttp(() => Results.Ok(list));
        });

        agents.MapPost("", async (CreateAgentCommand command, AgentsHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, agent) = await handler.CreateAsync(command, cancellationToken);
            return result.ToHttp(() => Results.Created($"/api/agents/{agent!.ProfileId}", agent));
        });

        agents.MapGet("/{agentId:guid}/tokens", async (Guid agentId, AgentsHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, list) = await handler.ListTokensAsync(agentId, cancellationToken);
            return result.ToHttp(() => Results.Ok(list));
        });

        agents.MapPost("/{agentId:guid}/tokens", async (Guid agentId, IssueTokenCommand command, AgentsHandler handler, CancellationToken cancellationToken) =>
        {
            var (result, token) = await handler.IssueAsync(agentId, command, cancellationToken);
            return result.ToHttp(() => Results.Created($"/api/agents/{agentId}/tokens/{token!.Id}", token));
        });

        agents.MapDelete("/{agentId:guid}/tokens/{tokenId:guid}", async (Guid agentId, Guid tokenId, AgentsHandler handler, CancellationToken cancellationToken) =>
            (await handler.RevokeAsync(agentId, tokenId, cancellationToken)).ToHttp(Results.NoContent));

        return app;
    }
}
