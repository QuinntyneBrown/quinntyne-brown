import { expect, test } from '../../fixtures/app';
import { MarketingPage } from '../../pages/marketing.page';
import { BREAKPOINTS, hasHorizontalScroll, undersizedTargets } from '../../pages/viewport';

// Traces to: L2-074 (docs/detailed-designs/marketing/landing-page).
test.describe('Marketing page', () => {
  test('an anonymous visitor sees the marketing page', async ({ page, axe }) => {
    const marketing = new MarketingPage(page);

    await marketing.open();

    await expect(marketing.heading).toBeVisible();
    await expect(marketing.lead).toBeVisible();
    await expect(marketing.topBarJoin).toBeVisible();
    await expect(marketing.topBarSignIn).toBeVisible();
    await expect(marketing.panel).toContainText('First time here?');
    await expect(marketing.panelJoin).toBeVisible();
    await expect(marketing.callToAction).toContainText(
      'Make a profile so we can keep building together.',
    );
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

  // Traces to: L2-132 AC4
  test('what I’m building in the open lists the pinned projects, each linking to GitHub', async ({
    page,
  }) => {
    const marketing = new MarketingPage(page);

    await marketing.open();

    await expect(marketing.building).toBeVisible();
    expect(await marketing.projectCards()).toEqual(
      [
        [
          'Shelfie',
          'shelfie',
          'TypeScript · .NET',
          'A reading habit tracker for a young reader, with parent rewards.',
        ],
        ['Saturdaze', 'saturdaze', 'TypeScript · .NET', 'A weekend planner for a family of four.'],
        [
          'TwinkleTune',
          'TwinkleTune',
          'TypeScript · .NET',
          'A singing buddy for kids. Every song is tuned to their voice.',
        ],
        [
          'Fullstack with Claude',
          'fullstack-with-claude',
          'Python',
          'A narrated video series on building a full-stack app with Claude.',
        ],
        [
          'Loupe',
          'loupe',
          'C# · TypeScript',
          'AI critiques for photographers, plus a library of the work that inspires them.',
        ],
        [
          'Studio',
          'quinntyne-brown-studio',
          'C# · TypeScript · Azure',
          'Photography studio platform: galleries, quotes, client albums, prints.',
        ],
      ].map(([name, repo, language, description]) => ({
        name,
        href: `https://github.com/QuinntyneBrown/${repo}`,
        language,
        description,
        links: 1,
      })),
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
      'What I’m building in the open. Jump in anywhere.',
      'Let’s stay connected.',
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
