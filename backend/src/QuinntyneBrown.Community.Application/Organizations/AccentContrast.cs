using System.Globalization;

namespace QuinntyneBrown.Community.Application.Organizations;

/// <summary>
/// The org accent rule (ADR 0037, L2-149): the accent is a fill behind its foreground, white or <c>#111111</c>,
/// whichever contrasts more, and the pair must reach WCAG 2.2 AA for text, 4.5:1.
/// </summary>
public static class AccentContrast
{
    public const double Minimum = 4.5;
    public const string Light = "#ffffff";
    public const string Dark = "#111111";

    public static bool IsColour(string? value) =>
        value is { Length: 7 } && value[0] == '#' && int.TryParse(value[1..], NumberStyles.HexNumber, CultureInfo.InvariantCulture, out _);

    public static string ForegroundFor(string accent) => Ratio(accent, Light) >= Ratio(accent, Dark) ? Light : Dark;

    /// <summary>The better of the two ratios, rounded down to two decimals as the form shows it.</summary>
    public static double BestRatio(string accent) => Math.Floor(Math.Max(Ratio(accent, Light), Ratio(accent, Dark)) * 100) / 100;

    public static bool Passes(string accent) => Math.Max(Ratio(accent, Light), Ratio(accent, Dark)) >= Minimum;

    public static double Ratio(string a, string b)
    {
        var (la, lb) = (Luminance(a), Luminance(b));
        return (Math.Max(la, lb) + 0.05) / (Math.Min(la, lb) + 0.05);
    }

    private static double Luminance(string hex)
    {
        double Channel(int start)
        {
            var c = int.Parse(hex.AsSpan(start, 2), NumberStyles.HexNumber, CultureInfo.InvariantCulture) / 255.0;
            return c <= 0.03928 ? c / 12.92 : Math.Pow((c + 0.055) / 1.055, 2.4);
        }

        return (0.2126 * Channel(1)) + (0.7152 * Channel(3)) + (0.0722 * Channel(5));
    }
}
