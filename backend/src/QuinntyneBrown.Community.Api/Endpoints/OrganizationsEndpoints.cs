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

        return app;
    }
}
