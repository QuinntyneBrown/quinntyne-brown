namespace QuinntyneBrown.Community.Application.Common;

public class MarketingOptions
{
    public const string Section = "Marketing";

    /// <summary>Origin of the marketing page (www.quinntynebrown.com), allowed by CORS and used for Google sign-in outcomes.</summary>
    public string Origin { get; set; } = string.Empty;

    /// <summary>The bare domain (quinntynebrown.com), every request to which is redirected to <see cref="Origin"/>; unset, nothing is redirected (L2-133).</summary>
    public string? ApexHost { get; set; }
}
