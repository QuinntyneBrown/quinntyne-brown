/** The permission codes the server checks (Domain/Organizations/Permissions.cs, ADR 0033). */
export const Permission = {
  PeopleView: 'people.view',
  RolesGrant: 'roles.grant',
  InvitesSend: 'invites.send',
  ConnectLinkOwn: 'connectLink.own',
  ContactsPrivate: 'contacts.private',
  PartnersRead: 'partners.read',
  PartnersWrite: 'partners.write',
  EventsManage: 'events.manage',
  EventsRsvpList: 'events.rsvpList',
  EventsRsvpListEmails: 'events.rsvpListEmails',
  EventsCheckIn: 'events.checkIn',
  AnnouncementsSend: 'announcements.send',
  ResourcesCreate: 'resources.create',
  NotesCreate: 'notes.create',
  WorkspacesCreate: 'workspaces.create',
  WorkspacesJoin: 'workspaces.join',
  WorkspacesReadAll: 'workspaces.readAll',
  ReportsView: 'reports.view',
  IntegrationsView: 'integrations.view',
  IntegrationsManage: 'integrations.manage',
  TeamMember: 'team.member',
  TeamLead: 'team.lead',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

/** The features an Org Type switches on or off (Domain/Organizations/Features.cs, ADR 0038). */
export const Feature = {
  Profiles: 'profiles',
  Notes: 'notes',
  Contacts: 'contacts',
  Partners: 'partners',
  Team: 'team',
  Events: 'events',
  Announcements: 'announcements',
  Invites: 'invites',
  Resources: 'resources',
  Agile: 'agile',
  Reports: 'reports',
  Integrations: 'integrations',
} as const;

export type Feature = (typeof Feature)[keyof typeof Feature];

/** What each feature is, for the features panel (docs/mocks/pages/org-type/features). */
export const FEATURE_LABELS: Record<Feature, { name: string; description: string }> = {
  profiles: { name: 'Profiles', description: 'Always on' },
  notes: { name: 'Docs & notes', description: 'Always on' },
  contacts: { name: 'Contacts', description: 'Each lead’s private contacts.' },
  partners: { name: 'Partners', description: 'The shared partner pipeline.' },
  team: { name: 'Team', description: 'The team page of leads and volunteers.' },
  events: { name: 'Events', description: 'Events, RSVPs, check-in and public event pages.' },
  announcements: { name: 'Announcements', description: 'Announcements to the org, with email.' },
  invites: { name: 'Invites', description: 'Email invites and connect QR codes.' },
  resources: { name: 'Resources', description: 'Uploaded files and links.' },
  agile: { name: 'Workspaces', description: 'Agile workspaces, boards and Planning Poker.' },
  reports: { name: 'Reports', description: 'The read-only Reports page.' },
  integrations: {
    name: 'Applications',
    description: 'Signed events from other applications, such as contact requests.',
  },
};

/** Profiles and Docs & notes cannot be switched off (L2-147 AC4). */
export const ALWAYS_ON_FEATURES: readonly Feature[] = ['profiles', 'notes'];

/** What each permission code allows, for the catalogue editor (docs/mocks/pages/org-type). */
export const PERMISSION_LABELS: Record<string, string> = {
  'people.view': 'See the People page with each person’s roles',
  'roles.grant': 'Change roles, limited to this role’s “Can grant” list',
  'notes.create': 'Create note pages',
  'contacts.private': 'Keep their own private contacts in the org',
  'partners.read': 'Read the partner pipeline',
  'partners.write': 'Change the partner pipeline',
  'team.member': 'Be listed on the Team page',
  'team.lead': 'Match the Team page’s Leads filter',
  'events.manage': 'Create, edit and cancel events',
  'events.rsvpList': 'See who RSVP’d and the check-in page',
  'events.rsvpListEmails': 'See guest emails and export RSVPs',
  'events.checkIn': 'Check people in, add walk-ins, export attendance',
  'announcements.send': 'Send announcements to the org',
  'invites.send': 'Invite people into the org',
  'connectLink.own': 'Own a reusable QR code for the org',
  'resources.create': 'Add resources',
  'workspaces.create': 'Create and own workspaces',
  'workspaces.join': 'Be added to the org’s workspaces',
  'workspaces.readAll': 'Read every workspace of the org',
  'reports.view': 'Open the Reports page for the org',
  'integrations.view': 'Read the org’s applications and their events',
  'integrations.manage': 'Register applications, rotate their secrets and revoke them',
};
