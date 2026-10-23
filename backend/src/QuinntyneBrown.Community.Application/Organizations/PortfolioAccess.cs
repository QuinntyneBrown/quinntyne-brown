using QuinntyneBrown.Community.Application.Common;

namespace QuinntyneBrown.Community.Application.Organizations;

/// <summary>
/// Who administers a portfolio's Org Types, catalogues, orgs and cross-org roles (L2-137 AC2, L2-156 AC5): its
/// Portfolio Lead or a System Admin. A portfolio the caller covers no part of is not found; anyone else is refused.
/// </summary>
public static class PortfolioAccess
{
    public static Result? Refusal(CallerAccess access, Guid portfolioId)
    {
        if (access.IsSystemAdmin || access.LedPortfolios.Contains(portfolioId))
        {
            return null;
        }

        return access.Orgs.Values.Any(o => o.PortfolioId == portfolioId) ? Result.Forbidden() : Result.NotFound();
    }
}
