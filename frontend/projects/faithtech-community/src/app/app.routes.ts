import { Routes } from '@angular/router';

import {
  accessGuard,
  authGuard,
  featureGuard,
  legacySection,
  orgGuard,
  orgRedirectGuard,
  publicEventMatch,
} from './guards';
import {
  AuthCallbackPage,
  AuthContinuePage,
  ForbiddenPage,
  ForgotPasswordPage,
  HomePage,
  NotFoundPage,
  ResetPasswordPage,
  ServerErrorPage,
  SignInPage,
  SignUpPage,
  VerifyEmailPage,
  WaitingPage,
} from './pages';
import { AppShellComponent, PublicShellComponent } from './shell';

/** The pages of one org, or of "All orgs", under /o/{slug} (ADR 0037). */
const ORG_ROUTES: Routes = [
  { path: '', pathMatch: 'full', component: HomePage },
  {
    path: 'people',
    loadChildren: () => import('@faithtech-community/profiles').then((m) => m.PROFILES_ROUTES),
  },
  {
    path: 'contacts',
    canActivate: [featureGuard('contacts')],
    loadChildren: () => import('@faithtech-community/contacts').then((m) => m.CONTACTS_ROUTES),
  },
  {
    path: 'partners',
    canActivate: [featureGuard('partners')],
    loadChildren: () => import('@faithtech-community/partners').then((m) => m.PARTNERS_ROUTES),
  },
  {
    path: 'workspaces',
    canActivate: [featureGuard('agile')],
    loadChildren: () => import('@faithtech-community/agile').then((m) => m.AGILE_ROUTES),
  },
  {
    path: 'team',
    canActivate: [featureGuard('team')],
    loadChildren: () => import('@faithtech-community/team').then((m) => m.TEAM_ROUTES),
  },
  {
    path: 'events',
    canActivate: [featureGuard('events')],
    loadChildren: () => import('@faithtech-community/events').then((m) => m.EVENTS_ROUTES),
  },
  {
    path: 'search',
    loadChildren: () => import('@faithtech-community/search').then((m) => m.SEARCH_ROUTES),
  },
  {
    path: 'announcements',
    canActivate: [featureGuard('announcements')],
    loadChildren: () =>
      import('@faithtech-community/announcements').then((m) => m.ANNOUNCEMENTS_ROUTES),
  },
  {
    path: 'resources',
    canActivate: [featureGuard('resources')],
    loadChildren: () => import('@faithtech-community/resources').then((m) => m.RESOURCES_ROUTES),
  },
  {
    path: 'reports',
    canActivate: [featureGuard('reports')],
    loadChildren: () => import('@faithtech-community/reports').then((m) => m.REPORTS_ROUTES),
  },
  {
    path: 'notes',
    loadChildren: () => import('@faithtech-community/notes').then((m) => m.NOTES_ROUTES),
  },
  {
    path: 'my-work',
    canActivate: [featureGuard('agile')],
    loadChildren: () => import('@faithtech-community/agile').then((m) => m.MY_WORK_ROUTES),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('@faithtech-community/organizations').then((m) => m.ORG_SETTINGS_ROUTES),
  },
  {
    path: 'invites',
    canActivate: [featureGuard('invites')],
    loadChildren: () => import('@faithtech-community/invites').then((m) => m.INVITES_ROUTES),
  },
];

export const routes: Routes = [
  { path: 'sign-in', component: SignInPage },
  { path: 'auth/callback', component: AuthCallbackPage },
  // The marketing page and Google sign-in hand their session over here (ADR 0018).
  { path: 'auth/continue', component: AuthContinuePage },
  { path: 'sign-up', component: SignUpPage },
  { path: 'verify-email', component: VerifyEmailPage },
  { path: 'forgot-password', component: ForgotPasswordPage },
  { path: 'reset-password', component: ResetPasswordPage },
  // A public event's page is addressed by its org (L2-149); /public/events/:id redirects there.
  {
    path: 'o',
    component: PublicShellComponent,
    canMatch: [publicEventMatch],
    loadChildren: () =>
      import('@faithtech-community/events').then((m) => m.ORG_PUBLIC_EVENT_ROUTES),
  },
  {
    path: 'public/events',
    component: PublicShellComponent,
    loadChildren: () => import('@faithtech-community/events').then((m) => m.PUBLIC_EVENT_ROUTES),
  },
  {
    path: 'accept-invite',
    loadChildren: () => import('@faithtech-community/invites').then((m) => m.ACCEPT_INVITE_ROUTES),
  },
  // A City Lead's QR code opens /meet/:token; /connect/* belongs to the identity server (ADR 0021).
  {
    path: 'meet',
    loadChildren: () => import('@faithtech-community/invites').then((m) => m.CONNECT_ROUTES),
  },
  // The unsubscribe link in announcement emails works without a sign-in (L2-030 AC3).
  {
    path: 'unsubscribe',
    loadChildren: () =>
      import('@faithtech-community/announcements').then((m) => m.UNSUBSCRIBE_ROUTES),
  },
  { path: 'forbidden', component: ForbiddenPage },
  { path: 'error', component: ServerErrorPage },
  { path: 'not-found', component: NotFoundPage },
  // Someone who belongs to no org waits to be added (L2-142).
  { path: 'waiting', component: WaitingPage, canActivate: [authGuard, accessGuard] },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard, accessGuard],
    children: [
      // Home and the old addresses move under the active org (ADR 0037).
      { path: '', pathMatch: 'full', canActivate: [orgRedirectGuard], children: [] },
      { matcher: legacySection, canActivate: [orgRedirectGuard], children: [] },
      { path: 'o/:orgSlug', canActivate: [orgGuard], children: ORG_ROUTES },
      // A person's own profile works without an org, for someone waiting to be added (L2-140 AC4).
      {
        path: 'profile',
        loadChildren: () => import('@faithtech-community/profiles').then((m) => m.PROFILES_ROUTES),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('@faithtech-community/notifications').then((m) => m.NOTIFICATIONS_ROUTES),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('@faithtech-community/notifications').then((m) => m.SETTINGS_ROUTES),
      },
      {
        path: 'admin',
        loadChildren: () => import('@faithtech-community/admin').then((m) => m.ADMIN_ROUTES),
      },
    ],
  },
  { path: '**', component: NotFoundPage },
];
