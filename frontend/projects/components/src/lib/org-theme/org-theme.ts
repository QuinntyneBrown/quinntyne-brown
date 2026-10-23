/** An org's accent and the foreground the server chose for it (ADR 0037). */
export interface OrgAccent {
  accent: string | null;
  accentForeground: string | null;
}

/** The scoped org tokens for an accent pair; empty, so the brand tokens apply, when there is none. */
export function orgAccentStyle(pair: OrgAccent | null | undefined): Record<string, string> {
  if (!pair?.accent || !pair.accentForeground) return {};
  return {
    '--color-org-accent': pair.accent,
    '--color-org-accent-foreground': pair.accentForeground,
  };
}

export const ACCENT_LIGHT = '#ffffff';
export const ACCENT_DARK = '#111111';
/** WCAG 2.2 AA for text. */
export const ACCENT_MINIMUM_RATIO = 4.5;

/** `#rrggbb`, either case. */
export function isHexColour(value: string | null | undefined): value is string {
  return !!value && /^#[0-9a-f]{6}$/i.test(value);
}

/** The WCAG 2.2 contrast ratio of two `#rrggbb` colours. */
export function contrastRatio(a: string, b: string): number {
  const [la, lb] = [luminance(a), luminance(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** White or `#111111`, whichever contrasts more with the accent, as the server picks it. */
export function accentForeground(accent: string): string {
  return contrastRatio(accent, ACCENT_LIGHT) >= contrastRatio(accent, ACCENT_DARK)
    ? ACCENT_LIGHT
    : ACCENT_DARK;
}

/** A ratio rounded down to two decimals, as the colour field shows it: "4.47". */
export function formatRatio(ratio: number): string {
  return (Math.floor(ratio * 100) / 100).toFixed(2);
}

function luminance(hex: string): number {
  const channel = (start: number) => {
    const c = parseInt(hex.slice(start, start + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}
