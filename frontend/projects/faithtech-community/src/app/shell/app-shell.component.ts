import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ACCESS_SERVICE, ALL_ORGS, AUTH_SERVICE } from '@faithtech-community/api';
import {
  avatarColorFor,
  AvatarComponent,
  BannerComponent,
  BreakpointService,
  ButtonComponent,
  ContainerComponent,
  MenuComponent,
  MenuEntry,
  NavDrawerComponent,
  NavDrawerLink,
  OrgSwitcherComponent,
  OrgSwitcherOption,
  SkipLinkComponent,
  TabBarComponent,
  TabBarItem,
  TopBarComponent,
  TopBarLink,
} from '@faithtech-community/components';
import { filter, firstValueFrom, map } from 'rxjs';

import { SECTIONS, Section, hrefFor, sectionOf, sectionsFor, tabsFor } from './navigation';
import { ShellNotificationsComponent } from './shell-notifications.component';

/** The signed-in chrome around every member page (docs/design-system/patterns/navigation.html). */
@Component({
  selector: 'ft-app-shell',
  imports: [
    RouterOutlet,
    AvatarComponent,
    SkipLinkComponent,
    TopBarComponent,
    NavDrawerComponent,
    TabBarComponent,
    BannerComponent,
    ButtonComponent,
    ContainerComponent,
    MenuComponent,
    OrgSwitcherComponent,
    ShellNotificationsComponent,
  ],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  private readonly auth = inject(AUTH_SERVICE);
  private readonly access = inject(ACCESS_SERVICE);
  private readonly announcer = inject(LiveAnnouncer);
  private readonly router = inject(Router);
  private readonly breakpoint = inject(BreakpointService);

  protected readonly user = this.auth.currentUser;
  protected readonly avatarColor = computed(() => avatarColorFor(this.user()?.profileId));
  /** Unverified members can browse but must verify to RSVP, create content or invite (L2-002 AC3). */
  protected readonly unverified = computed(() => this.user()?.emailVerified === false);
  protected readonly resend = signal<'idle' | 'sending' | 'sent' | 'limited'>('idle');

  /** Under 768px the navigation collapses into the menu and the tab bar (L2-045 AC2). */
  protected readonly phone = computed(() => ['base', 'sm'].includes(this.breakpoint.current()));
  /** From 768px to 1023px the secondary links hide, so More in the top bar opens the menu. */
  protected readonly tablet = computed(() => this.breakpoint.current() === 'md');
  protected readonly menuOpen = signal(false);

  private readonly path = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects.split(/[?#]/)[0]),
    ),
    { initialValue: this.router.url.split(/[?#]/)[0] },
  );

  /** The org in the URL, or the last one opened on personal pages. */
  protected readonly activeSlug = computed(() => this.access.activeSlug());
  protected readonly portfolioName = computed(
    () => this.access.access()?.portfolios[0]?.name ?? '',
  );
  protected readonly switcherOrgs = computed<OrgSwitcherOption[]>(() =>
    this.access.orgs().map((o) => ({
      slug: o.slug,
      name: o.branding.displayName || o.name,
      typeName: o.typeName,
      logoUrl: o.branding.logoUrl,
      accent: o.branding.accent,
      accentForeground: o.branding.accentForeground,
    })),
  );

  /** One rule builds the top bar, the tab bar and the menu from the caller's access (ADR 0037). */
  private readonly sections = computed(() => sectionsFor(this.access, this.activeSlug()));

  protected readonly topLinks = computed<TopBarLink[]>(() =>
    this.sections().map((s) => ({ ...this.link(s), secondary: s.secondary })),
  );
  protected readonly drawerLinks = computed<NavDrawerLink[]>(() =>
    this.sections().map((s) => ({ ...this.link(s), icon: s.icon })),
  );
  /** The avatar's account menu, at every width (L2-003 AC9, design system components/menu). */
  protected readonly accountEntries = computed<MenuEntry[]>(() => [
    {
      kind: 'header',
      title: this.user()?.name ?? '',
      caption: this.roleCaption(),
    },
    { kind: 'divider' },
    { kind: 'item', id: 'profile', label: 'Your profile', icon: 'team', href: '/people/me' },
    { kind: 'item', id: 'settings', label: 'Settings', icon: 'settings', href: '/settings' },
    { kind: 'divider' },
    { kind: 'item', id: 'sign-out', label: 'Sign out', icon: 'sign-out' },
  ]);
  protected readonly tabs = computed<TabBarItem[]>(() =>
    tabsFor(this.access, this.activeSlug()).map((s) => ({ ...this.link(s), icon: s.icon })),
  );
  /** More is the current tab while the page is outside the link tabs (design system, tab bar). */
  protected readonly moreCurrent = computed(() => !this.tabs().some((t) => t.current));

  protected search(query: string): void {
    const org = this.activeSlug();
    void this.router.navigate(org ? ['/o', org, 'search'] : ['/search'], {
      queryParams: query ? { q: query } : {},
    });
  }

  /**
   * Opens the same section in the chosen org when it has it, else the org's home (L2-147), with
   * the caller's access refreshed and the switch announced.
   */
  protected async switchOrg(slug: string): Promise<void> {
    await this.access.refresh();
    const section = SECTIONS.find((s) => !s.orgless && s.path === sectionOf(this.path()));
    const keep = section && section.opens(this.access, slug) ? section.path : '';
    await this.router.navigateByUrl(keep ? `/o/${slug}/${keep}` : `/o/${slug}`);
    const name =
      slug === ALL_ORGS ? 'All orgs' : this.switcherOrgs().find((o) => o.slug === slug)?.name;
    void this.announcer.announce(`Switched to ${name}`);
  }

  /** The caller's roles in the active org, or System Admin. */
  private roleCaption(): string {
    const org = this.access.activeOrg();
    const roles = [
      ...(this.access.isSystemAdmin() ? ['System Admin'] : []),
      ...(org?.isPortfolioLead && !this.access.isSystemAdmin() ? ['Portfolio Lead'] : []),
      ...(org?.roles ?? []),
    ];
    return roles.join(', ') || 'No role yet';
  }

  protected async accountAction(id: string): Promise<void> {
    if (id === 'sign-out') await firstValueFrom(this.auth.signOut());
  }

  protected async sendAgain(): Promise<void> {
    const email = this.user()?.email;
    if (!email) return;
    this.resend.set('sending');
    try {
      await firstValueFrom(this.auth.resendVerification(email));
      this.resend.set('sent');
    } catch (error) {
      const limited = error instanceof HttpErrorResponse && error.status === 429;
      this.resend.set(limited ? 'limited' : 'idle');
    }
  }

  private link(section: Section) {
    const href = hrefFor(section, this.activeSlug());
    return { label: section.label, href, current: this.isCurrent(section, href) };
  }

  private isCurrent(section: Section, href: string): boolean {
    const path = this.path();
    if (!section.orgless && section.path === '') return path === href;
    return path === href || path.startsWith(`${href}/`);
  }
}
