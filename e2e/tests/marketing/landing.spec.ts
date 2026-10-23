import { expect, test } from '../../fixtures/app';
import { MarketingPage } from '../../pages/marketing.page';
import { BREAKPOINTS, hasHorizontalScroll, undersizedTargets } from '../../pages/viewport';

// Traces to: L2-074 (docs/detailed-designs/marketing/landing-page).
test.describe('Marketing page', () => {
  test('an anonymous visitor sees the marketing page', async ({ page, axe }) => {
    const marketing = new MarketingPage(page);

    await marketing.open();

    await expect(marketing.heading).toBeVisible();
    await expect(marketing.eyebrow).toBeVisible();
    await expect(marketing.lead).toBeVisible();
    await expect(marketing.topBarJoin).toBeVisible();
    await expect(marketing.topBarSignIn).toBeVisible();
    await expect(marketing.benefitsHeading).toBeVisible();
    await expect(marketing.benefits).toHaveText([
      'Find your city team',
      'Show up together',
      'Build what matters',
    ]);
    await expect(marketing.callToActionJoin).toBeVisible();
    await expect(marketing.footer).toContainText('© 2026 Quinntyne Brown');
    await axe.check();
  });

  // Traces to: L2-132 AC1, AC2
  test('the hero introduces Quinntyne Brown with LinkedIn, GitHub and résumé links', async ({
    page,
  }) => {
    const marketing = new MarketingPage(page);

    await marketing.open();

    await expect(marketing.eyebrow).toBeVisible();
    await expect(marketing.heading).toBeVisible();
    await expect(marketing.lead).toBeVisible();
    await expect(marketing.linkedIn).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/quinntynebrown',
    );
    await expect(marketing.linkedIn).toHaveAttribute('target', '_blank');
    await expect(marketing.gitHub).toHaveAttribute('href', 'https://github.com/QuinntyneBrown');
    await expect(marketing.gitHub).toHaveAttribute('target', '_blank');
    await expect(marketing.downloadResume).toHaveAttribute(
      'href',
      '/resume/quinntyne-brown-resume.pdf',
    );
    await expect(marketing.downloadResume).toHaveAttribute('download', '');
    await expect(marketing.signInHeading).toBeVisible();
    await expect(marketing.video).toBeAttached();
  });

  // Traces to: L2-132 AC2
  test('the résumé downloads as a PDF', async ({ page }) => {
    const marketing = new MarketingPage(page);
    await marketing.open();

    const download = page.waitForEvent('download');
    await marketing.downloadResume.click();

    expect((await download).suggestedFilename()).toBe('quinntyne-brown-resume.pdf');
  });

  // Traces to: L2-132 AC3
  test('the work section shows the figures and the employers', async ({ page }) => {
    const marketing = new MarketingPage(page);

    await marketing.open();

    await expect(marketing.workEyebrow).toBeVisible();
    expect(await marketing.figureTexts()).toEqual([
      { value: '15+', label: 'years' },
      { value: '2×', label: 'faster Canadarm3 software' },
      { value: '10×', label: 'serialization throughput' },
      { value: '~30', label: 'developers mentored' },
    ]);
    await expect(marketing.employers).toHaveText([
      'MDA',
      'Protiviti',
      'RBC Ventures',
      'AutoTrader.ca',
      'Corus',
    ]);
  });

  // Traces to: L2-132 AC4
  test('things I’m building lists the pinned projects, each linking to GitHub', async ({
    page,
  }) => {
    const marketing = new MarketingPage(page);

    await marketing.open();

    await expect(marketing.buildingEyebrow).toBeVisible();
    const search = (name: string) =>
      `https://github.com/QuinntyneBrown?tab=repositories&q=${encodeURIComponent(name)}`;
    expect(await marketing.projectCards()).toEqual(
      [
        ['Shelfie', 'TypeScript'],
        ['Saturdaze', 'C#'],
        ['TwinkleTune', 'TypeScript'],
        ['Fullstack with Claude', 'HTML'],
        ['Loupe', 'C#'],
        ['Studio', 'C#'],
      ].map(([name, language]) => ({ name, href: search(name), language, links: 1 })),
    );
    await expect(marketing.allOnGitHub).toHaveAttribute(
      'href',
      'https://github.com/QuinntyneBrown',
    );
  });

  // Traces to: L2-132 AC5
  test('the sections follow the hero in order', async ({ page }) => {
    const marketing = new MarketingPage(page);

    await marketing.open();

    await expect(marketing.sectionHeadings).toHaveText([
      'Fifteen years shipping.',
      'Things I’m building.',
      'Why join',
      'Ready to build with us?',
    ]);
  });

  for (const [name, viewport] of Object.entries(BREAKPOINTS)) {
    for (const colorScheme of ['light', 'dark'] as const) {
      test(`fits without sideways scroll at ${name} in ${colorScheme}`, async ({ page, axe }) => {
        const marketing = new MarketingPage(page);
        await page.setViewportSize(viewport);
        await page.emulateMedia({ colorScheme });

        await marketing.open();

        await expect(marketing.heading).toBeVisible();
        expect(await hasHorizontalScroll(page)).toBe(false);
        expect(await undersizedTargets(page)).toEqual([]);
        await axe.check();
      });
    }
  }
});
