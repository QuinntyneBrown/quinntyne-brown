import { ALL_ORGS, AccessService, Feature, Permission } from '@faithtech-community/api';

export interface Section {
  label: string;
  /** The section's path under the org (`events`), or an absolute path for personal and platform pages. */
  path: string;
  icon: string;
  /** Hidden from the top bar between 768px and 1023px (design system, top bar). */
  secondary?: boolean;
  /** Personal and platform pages live outside /o/{slug} (ADR 0037). */
  orgless?: boolean;
  /**
   * Whether the caller may open the section in `org` (a slug or `all`); it only hides links, and
   * the API refuses the rest (ADR 0037).
   */
  opens: (access: AccessService, org: string) => boolean;
}

const anyone = () => true;
const feature = (name: Feature) => (access: AccessService, org: string) =>
  access.feature(name, org);
const can =
  (...permissions: Permission[]) =>
  (access: AccessService, org: string) =>
    permissions.some((p) => access.can(p, org));

/**
 * Every section in the order the top bar, the tab bar and the menu show them, opened by the
 * caller's permissions and the org's features (ADR 0037, refining ADR 0009).
 */
export const SECTIONS: readonly Section[] = [
  { label: 'Home', path: '', icon: 'home', opens: anyone },
  { label: 'Events', path: 'events', icon: 'events', opens: feature('events') },
  // Private contacts belong to the person who created them (L2-012).
  {
    label: 'Contacts',
    path: 'contacts',
    icon: 'contacts',
    opens: can(Permission.ContactsPrivate),
  },
  { label: 'Partners', path: 'partners', icon: 'partners', opens: can(Permission.PartnersRead) },
  {
    label: 'Workspaces',
    path: 'workspaces',
    icon: 'workspaces',
    secondary: true,
    // Any workspace permission, or a cross-org role that may join work there (L2-155 AC3).
    opens: (access, org) =>
      can(
        Permission.WorkspacesJoin,
        Permission.WorkspacesCreate,
        Permission.WorkspacesReadAll,
      )(access, org) ||
      access.orgs().some((o) => (org === ALL_ORGS || o.slug === org) && o.canJoinWork),
  },
  { label: 'Team', path: 'team', icon: 'team', secondary: true, opens: feature('team') },
  {
    label: 'Announcements',
    path: 'announcements',
    icon: 'announcements',
    secondary: true,
    opens: feature('announcements'),
  },
  {
    label: 'Resources',
    path: 'resources',
    icon: 'resources',
    secondary: true,
    opens: feature('resources'),
  },
  // Docs & notes are on in every org (ADR 0038).
  { label: 'Notes', path: 'notes', icon: 'notes', secondary: true, opens: anyone },
  {
    label: 'People',
    path: 'people',
    icon: 'team',
    secondary: true,
    opens: can(Permission.PeopleView),
  },
  {
    label: 'Reports',
    path: 'reports',
    icon: 'reports',
    secondary: true,
    opens: can(Permission.ReportsView),
  },
  // Only System Admins see the admin area (L2-040).
  {
    label: 'Admin',
    path: '/admin',
    icon: 'admin',
    secondary: true,
    orgless: true,
    opens: (access) => access.isSystemAdmin(),
  },
];

export const SEARCH_SECTION: Section = {
  label: 'Search',
  path: 'search',
  icon: 'search',
  opens: anyone,
};

/** The section's address in `org`. */
export function hrefFor(section: Section, org: string | null): string {
  if (section.orgless || !org) return section.path || '/';
  return section.path ? `/o/${org}/${section.path}` : `/o/${org}`;
}

/** The sections the caller may open in `org` (a slug or `all`), in order. */
export function sectionsFor(access: AccessService, org: string | null): Section[] {
  const scope = org ?? ALL_ORGS;
  return SECTIONS.filter((s) => s.opens(access, scope));
}

/**
 * The phone tab bar's links: Home, Events, Search and the member's next section. A More tab
 * follows them and opens the menu of every section.
 */
export function tabsFor(access: AccessService, org: string | null): Section[] {
  const [home, ...rest] = sectionsFor(access, org);
  const events = rest.find((s) => s.path === 'events');
  const others = rest.filter((s) => s !== events);
  return [home, ...(events ? [events] : []), SEARCH_SECTION, ...others.slice(0, events ? 1 : 2)];
}

/** The section a path is in: `events` for /o/toronto/events/123. */
export function sectionOf(path: string): string {
  const match = /^\/o\/[^/]+\/?([^/?#]*)/.exec(path);
  return match ? match[1] : '';
}
