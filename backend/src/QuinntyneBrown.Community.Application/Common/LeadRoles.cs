using QuinntyneBrown.Community.Domain.Profiles;

namespace QuinntyneBrown.Community.Application.Common;

/// <summary>The lead roles (ADR 0014): the people who own contacts and work the partner pipeline.</summary>
public static class LeadRoles
{
    public static IReadOnlyList<Role> All { get; } = [Role.CityLead, Role.EventLead, Role.CreateLead, Role.CommunicationsLead];

    public static bool HoldsLeadRole(this ICurrentUser current) => All.Any(current.HasRole);
}
