using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Domain.Profiles;

namespace QuinntyneBrown.Community.Application.Reports;

/// <summary>
/// Reports are for Staff and System Admins (L2-123); every other member, the lead roles included, is refused.
/// Reading a report is not an admin action, so nothing is audited.
/// </summary>
public class ReportAccess(ICurrentUser current)
{
    public bool CanRead => current.HasRole(Role.Staff) || current.HasRole(Role.SystemAdmin);
}
