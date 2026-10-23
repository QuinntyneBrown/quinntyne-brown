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
} as const;

export type Feature = (typeof Feature)[keyof typeof Feature];
