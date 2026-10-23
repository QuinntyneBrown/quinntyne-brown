import { expect, test } from '../../fixtures/app';
import { SignInPage } from '../../pages/sign-in.page';
import { SignUpPage } from '../../pages/sign-up.page';

// Traces to: L2-131 (docs/detailed-designs/identity/github-sign-in, google-sign-in).
test.describe('Google and GitHub sign-in on the community app', () => {
  test('the sign-in page offers both, and a new GitHub account lands in the app', async ({
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
    const signIn = new SignInPage(page);
    await signIn.open();
    await expect(signIn.signInWithGoogle).toBeVisible();
    await expect(signIn.signInWithGitHub).toBeVisible();
    await axe.check();

    await signIn.signInWithGitHub.click();

    await expect(page).toHaveURL('http://localhost:4200/');
    expect(api.accounts.get('leah@example.org')).toMatchObject({ verified: true, roles: [] });
  });

  test('a signed-out visitor who continues with Google lands on the page they asked for', async ({
    page,
    api,
  }) => {
    api.addAccount({ email: 'grace@example.org', name: 'Grace Okonkwo', roles: ['CityLead'] });
    api.google.account = { email: 'grace@example.org', name: 'Grace O.', emailVerified: true };
    const signIn = new SignInPage(page);

    await page.goto('/events');
    await expect(signIn.heading).toBeVisible();
    await signIn.signInWithGoogle.click();

    await expect(page).toHaveURL(/\/events$/);
    expect(api.accounts.size).toBe(1);
  });

  test('a GitHub failure returns to the community app’s sign-in page', async ({
    page,
    api,
    axe,
  }) => {
    api.github.account = {
      email: 'leah@example.org',
      name: 'Leah Thompson',
      login: 'leah-t',
      emailVerified: false,
    };
    const signIn = new SignInPage(page);
    await signIn.open('/team');

    await signIn.signInWithGitHub.click();

    await expect(page).toHaveURL('http://localhost:4200/sign-in?github=failed&returnUrl=%2Fteam');
    await expect(signIn.alert).toContainText('GitHub sign-in didn’t finish');
    expect(api.accounts.has('leah@example.org')).toBe(false);
    await axe.check();
  });

  test('a suspended account is refused on the sign-in page with the usual message', async ({
    page,
    api,
  }) => {
    api.addAccount({ email: 'grace@example.org', suspended: true });
    api.google.account = { email: 'grace@example.org', name: 'Grace', emailVerified: true };
    const signIn = new SignInPage(page);
    await signIn.open();

    await signIn.signInWithGoogle.click();

    await expect(page).toHaveURL(/^http:\/\/localhost:4200\/sign-in\?google=suspended/);
    await expect(signIn.alert).toContainText('This account is suspended');
  });

  test('cancelling at Google returns to the sign-in page with the failure message', async ({
    page,
    api,
  }) => {
    api.google.account = null;
    const signIn = new SignInPage(page);
    await signIn.open();

    await signIn.signInWithGoogle.click();

    await expect(signIn.alert).toContainText('Google sign-in didn’t finish');
    await expect(signIn.signInWithGoogle).toBeVisible();
  });

  test('Sign up with GitHub on the sign-up page creates the account and lands in the app', async ({
    page,
    api,
    axe,
  }) => {
    api.github.account = {
      email: 'leah@example.org',
      name: null,
      login: 'leah-builds',
      emailVerified: true,
    };
    const signUp = new SignUpPage(page);
    await signUp.open();
    await expect(signUp.signUpWithGoogle).toBeVisible();
    await axe.check();

    await signUp.signUpWithGitHub.click();

    await expect(page).toHaveURL('http://localhost:4200/');
    expect(api.accounts.get('leah@example.org')?.name).toBe('leah-builds');
  });
});
