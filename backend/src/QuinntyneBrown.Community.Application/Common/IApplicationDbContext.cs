using QuinntyneBrown.Community.Application.Identity;
using QuinntyneBrown.Community.Domain.Admin;
using QuinntyneBrown.Community.Domain.Agile;
using QuinntyneBrown.Community.Domain.Announcements;
using QuinntyneBrown.Community.Domain.Contacts;
using QuinntyneBrown.Community.Domain.Events;
using QuinntyneBrown.Community.Domain.Invites;
using QuinntyneBrown.Community.Domain.Notes;
using QuinntyneBrown.Community.Domain.Notifications;
using QuinntyneBrown.Community.Domain.Organizations;
using QuinntyneBrown.Community.Domain.Partners;
using QuinntyneBrown.Community.Domain.Profiles;
using QuinntyneBrown.Community.Domain.Resources;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Common;

public interface IApplicationDbContext
{
    DbSet<Profile> Profiles { get; }

    DbSet<CommunityUser> Users { get; }

    DbSet<AuditEntry> AuditEntries { get; }

    DbSet<SystemAdminRoster> SystemAdminRosters { get; }

    DbSet<Notification> Notifications { get; }

    DbSet<Invite> Invites { get; }

    DbSet<ConnectLink> ConnectLinks { get; }

    DbSet<Contact> Contacts { get; }

    DbSet<PendingConnection> PendingConnections { get; }

    DbSet<ContactNote> ContactNotes { get; }

    DbSet<Partner> Partners { get; }

    DbSet<PartnerStageChange> PartnerStageChanges { get; }

    DbSet<PartnerActivity> PartnerActivities { get; }

    DbSet<PartnerDuplicateDismissal> PartnerDuplicateDismissals { get; }

    DbSet<Workspace> Workspaces { get; }

    DbSet<WorkItem> WorkItems { get; }

    DbSet<Sprint> Sprints { get; }

    DbSet<PokerSession> PokerSessions { get; }

    DbSet<PhotoBlobTask> PhotoBlobTasks { get; }
    DbSet<Event> Events { get; }

    DbSet<Announcement> Announcements { get; }

    DbSet<Resource> Resources { get; }

    DbSet<ResourceBlobTask> ResourceBlobTasks { get; }

    DbSet<NotePage> NotePages { get; }

    DbSet<NoteLink> NoteLinks { get; }

    DbSet<NoteImage> NoteImages { get; }

    DbSet<Portfolio> Portfolios { get; }

    DbSet<PortfolioLead> PortfolioLeads { get; }

    DbSet<OrgType> OrgTypes { get; }

    DbSet<RoleDefinition> RoleDefinitions { get; }

    DbSet<Organization> Organizations { get; }

    DbSet<OrgSlugAlias> OrgSlugAliases { get; }

    DbSet<OrgMembership> OrgMemberships { get; }

    DbSet<OrgRoleAssignment> OrgRoleAssignments { get; }

    DbSet<CrossOrgRole> CrossOrgRoles { get; }

    DbSet<CrossOrgAssignment> CrossOrgAssignments { get; }

    DbSet<AgentCredential> AgentCredentials { get; }

    DbSet<Domain.Integrations.IntegrationApp> IntegrationApps { get; }

    DbSet<Domain.Integrations.IntegrationEvent> IntegrationEvents { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
