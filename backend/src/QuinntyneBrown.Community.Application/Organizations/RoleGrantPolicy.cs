using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Domain.Organizations;

namespace QuinntyneBrown.Community.Application.Organizations;

/// <summary>
/// The grant chain (ADR 0033, L2-136): who may grant or remove which role where. The one place that answers it;
/// the web app only hides options.
/// </summary>
public class RoleGrantPolicy(ICurrentUser current)
{
    private CallerAccess Access => current.Access;

    /// <summary>System Admin and Portfolio Lead are granted by System Admins only.</summary>
    public bool CanGrantPlatformTiers => Access.IsSystemAdmin;

    /// <summary>Org Lead is granted by the Portfolio Lead or a System Admin.</summary>
    public bool CanGrantOrgLead(Guid orgId) => Access.IsSystemAdmin || Access.IsPortfolioLead(orgId);

    /// <summary>Cross-org roles are granted by the portfolio's Portfolio Lead or a System Admin.</summary>
    public bool CanGrantCrossOrg(Guid portfolioId) => Access.IsSystemAdmin || Access.LedPortfolios.Contains(portfolioId);

    /// <summary>A catalogue role: System Admin, Portfolio Lead and Org Lead grant any; others only their roles' <c>CanGrant</c>.</summary>
    public bool CanGrant(Guid orgId, RoleDefinition role, IEnumerable<RoleDefinition> catalogue)
    {
        if (!Access.Covers(orgId))
        {
            return false;
        }

        if (Access.LeadsOrg(orgId))
        {
            return true;
        }

        if (!Access.HasByRole(orgId, Permissions.RolesGrant))
        {
            return false;
        }

        var held = Access.Orgs[orgId].RoleIds;
        return catalogue.Where(r => held.Contains(r.Id)).Any(r => r.CanGrant.Contains(role.Id));
    }

    /// <summary>Whether the caller may change any role in the org at all (opens the role dialog).</summary>
    public bool CanChangeRolesIn(Guid orgId) => Access.LeadsOrg(orgId) || Access.HasByRole(orgId, Permissions.RolesGrant);

    /// <summary>Grants by the Portfolio Lead or a System Admin are audited instead of notifying (L2-136).</summary>
    public bool NotifiesOwner(Guid orgId) => !Access.IsSystemAdmin && !Access.IsPortfolioLead(orgId);
}
