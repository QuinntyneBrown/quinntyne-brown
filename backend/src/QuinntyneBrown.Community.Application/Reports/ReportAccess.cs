using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Domain.Organizations;

namespace QuinntyneBrown.Community.Application.Reports;

/// <summary>
/// Reports are for holders of <c>reports.view</c> (Staff, the Org Lead, the Portfolio Lead, System Admin), for the orgs
/// where they hold it (L2-123, L2-150); every other member, the lead roles included, is refused. Reading a report is
/// not an admin action, so nothing is audited.
/// </summary>
public class ReportAccess(ICurrentUser current)
{
    /// <summary>The orgs in the request's scope where the caller may read reports.</summary>
    public IReadOnlyList<Guid> Scope =>
        [.. current.Access.ReadScope(Features.Reports).Where(org => current.Access.Has(org, Permissions.ReportsView))];

    public bool CanRead => Scope.Count > 0;
}
