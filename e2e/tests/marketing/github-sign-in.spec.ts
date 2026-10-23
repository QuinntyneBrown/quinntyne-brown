import { expect, test } from '../../fixtures/app';
import { MarketingPage } from '../../pages/marketing.page';

// Traces to: L2-110, L2-079 AC4 (docs/detailed-designs/identity/github-sign-in).
test.describe('Sign in with GitHub from the marketing page', () => {
  test('a new GitHub account gets an account with no role and lands in the community app', async ({
    page,
    api,
    axe,
  }) => {
    api.github.account = {
      email: 'leah@example.org',
      name: 'Leah Thompson',
      login: 'leah-t',
      emailVerified: true,
    };
    const marketing = new MarketingPage(page);
    await marketing.open();
    await expect(marketing.signInWithGitHub).toBeVisible();
    await axe.check();

    await marketing.signInWithGitHub.click();

    await expect(page).toHaveURL('http://localhost:4200/');
    expect(api.accounts.get('leah@example.org')).toMatchObject({
      name: 'Leah Thompson',
      verified: true,
      roles: [],
    });
    const authorize = new URL(api.github.authorizeUrls[0]);
    expect(authorize.searchParams.get('code_challenge_method')).toBe('S256');
    expect(authorize.searchParams.get('scope')).toBe('read:user user:email');
  });

  test('a GitHub account with no name is named by its login', async ({ page, api }) => {
    api.github.account = {
      email: 'leah@example.org',
      name: null,
      login: 'leah-builds',
      emailVerified: true,
    };
    const marketing = new MarketingPage(page);
    await marketing.open();

    await marketing.signInWithGitHub.click();

    await expect(page).toHaveURL('http://localhost:4200/');
    expect(api.accounts.get('leah@example.org')?.name).toBe('leah-builds');
  });

  test('a GitHub account with a matching email signs into the existing account', async ({
    page,
    api,
  }) => {
    api.addAccount({ email: 'grace@example.org', name: 'Grace Okonkwo', roles: ['CityLead'] });
    api.github.account = {
      email: 'grace@example.org',
      name: 'Grace O.',
      login: 'grace-o',
      emailVerified: true,
    };
    const marketing = new MarketingPage(page);
    await marketing.open('?returnUrl=%2Fevents');

    await marketing.signInWithGitHub.click();

    await expect(page).toHaveURL('http://localhost:4200/events');
    expect(api.accounts.size).toBe(1);
  });

  test('Sign up with GitHub on the join form starts the same flow', async ({ page, api }) => {
    api.github.account = {
      email: 'leah@example.org',
      name: 'Leah Thompson',
      login: 'leah-t',
      emailVerified: true,
    };
    const marketing = new MarketingPage(page);
    await marketing.open('?join');

    await marketing.signUpWithGitHub.click();

    await expect(page).toHaveURL('http://localhost:4200/');
    expect(api.callsTo('GET', '/api/account/github/start')).toHaveLength(1);
  });

  test('a GitHub primary email that is not verified is refused', async ({ page, api, axe }) => {
    api.github.account = {
      email: 'leah@example.org',
      name: 'Leah Thompson',
      login: 'leah-t',
      emailVerified: false,
    };
    const marketing = new MarketingPage(page);
    await marketing.open();

    await marketing.signInWithGitHub.click();

    await expect(page).toHaveURL('http://localhost:4300/?github=failed');
    await expect(marketing.alert).toContainText('GitHub sign-in didn’t finish');
    expect(api.accounts.has('leah@example.org')).toBe(false);
    await axe.check();
  });

  test('a suspended account is refused with the same message as password sign-in', async ({
    page,
    api,
  }) => {
    api.addAccount({ email: 'grace@example.org', suspended: true });
    api.github.account = {
      email: 'grace@example.org',
      name: 'Grace',
      login: 'grace-o',
      emailVerified: true,
    };
    const marketing = new MarketingPage(page);
    await marketing.open();

    await marketing.signInWithGitHub.click();

    await expect(marketing.alert).toContainText('This account is suspended');
  });

  test('cancelling at GitHub returns to the page with the failure message', async ({
    page,
    api,
  }) => {
    api.github.account = null;
    const marketing = new MarketingPage(page);
    await marketing.open();

    await marketing.signInWithGitHub.click();

    await expect(marketing.alert).toContainText('GitHub sign-in didn’t finish');
    await expect(marketing.signInWithGitHub).toBeVisible();
  });

  test('the page only talks to its own origin, the community app and GitHub', async ({
    page,
    api,
  }) => {
    const hosts = new Set<string>();
    page.on('request', (request) => hosts.add(new URL(request.url()).host));
    api.github.account = {
      email: 'leah@example.org',
      name: 'Leah Thompson',
      login: 'leah-t',
      emailVerified: true,
    };
    const marketing = new MarketingPage(page);

    await marketing.open();
    await marketing.signInWithGitHub.click();
    await expect(page).toHaveURL('http://localhost:4200/');

    expect([...hosts].sort()).toEqual(['github.com', 'localhost:4200', 'localhost:4300']);
  });
});
