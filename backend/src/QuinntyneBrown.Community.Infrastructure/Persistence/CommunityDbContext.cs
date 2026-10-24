using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Identity;
using QuinntyneBrown.Community.Domain.Admin;
using QuinntyneBrown.Community.Domain.Agile;
using QuinntyneBrown.Community.Domain.Announcements;
using QuinntyneBrown.Community.Domain.Contacts;
using QuinntyneBrown.Community.Domain.Events;
using QuinntyneBrown.Community.Domain.Invites;
using QuinntyneBrown.Community.Domain.Notifications;
using QuinntyneBrown.Community.Domain.Organizations;
using QuinntyneBrown.Community.Domain.Partners;
using QuinntyneBrown.Community.Domain.Profiles;
using QuinntyneBrown.Community.Domain.Notes;
using QuinntyneBrown.Community.Domain.Resources;
using QuinntyneBrown.Community.Infrastructure.Email;
using QuinntyneBrown.Community.Infrastructure.Identity;
using QuinntyneBrown.Community.Infrastructure.Search;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using QuinntyneBrown.Community.Domain.Ideas;
using QuinntyneBrown.Community.Domain.Integrations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace QuinntyneBrown.Community.Infrastructure.Persistence;

public class CommunityDbContext(DbContextOptions<CommunityDbContext> options)
    : IdentityDbContext<CommunityUser, IdentityRole<Guid>, Guid>(options), IApplicationDbContext, IDataProtectionKeyContext
{
    public DbSet<Profile> Profiles => Set<Profile>();

    public DbSet<VerificationResend> VerificationResends => Set<VerificationResend>();

    public DbSet<OutboxMessage> OutboxMessages => Set<OutboxMessage>();

    public DbSet<AuditEntry> AuditEntries => Set<AuditEntry>();

    public DbSet<SystemAdminRoster> SystemAdminRosters => Set<SystemAdminRoster>();

    public DbSet<Notification> Notifications => Set<Notification>();

    public DbSet<Invite> Invites => Set<Invite>();

    public DbSet<ConnectLink> ConnectLinks => Set<ConnectLink>();

    public DbSet<Contact> Contacts => Set<Contact>();

    public DbSet<PendingConnection> PendingConnections => Set<PendingConnection>();

    public DbSet<ContactNote> ContactNotes => Set<ContactNote>();

    public DbSet<Partner> Partners => Set<Partner>();

    public DbSet<PartnerStageChange> PartnerStageChanges => Set<PartnerStageChange>();

    public DbSet<PartnerActivity> PartnerActivities => Set<PartnerActivity>();

    public DbSet<PartnerDuplicateDismissal> PartnerDuplicateDismissals => Set<PartnerDuplicateDismissal>();

    public DbSet<Workspace> Workspaces => Set<Workspace>();

    public DbSet<WorkItem> WorkItems => Set<WorkItem>();

    public DbSet<Sprint> Sprints => Set<Sprint>();

    public DbSet<PokerSession> PokerSessions => Set<PokerSession>();

    public DbSet<PhotoBlobTask> PhotoBlobTasks => Set<PhotoBlobTask>();
    public DbSet<Event> Events => Set<Event>();

    public DbSet<Announcement> Announcements => Set<Announcement>();

    public DbSet<Resource> Resources => Set<Resource>();

    public DbSet<ResourceBlobTask> ResourceBlobTasks => Set<ResourceBlobTask>();

    public DbSet<NotePage> NotePages => Set<NotePage>();

    public DbSet<NoteLink> NoteLinks => Set<NoteLink>();

    public DbSet<NoteImage> NoteImages => Set<NoteImage>();

    public DbSet<Portfolio> Portfolios => Set<Portfolio>();

    public DbSet<PortfolioLead> PortfolioLeads => Set<PortfolioLead>();

    public DbSet<OrgType> OrgTypes => Set<OrgType>();

    public DbSet<RoleDefinition> RoleDefinitions => Set<RoleDefinition>();

    public DbSet<Organization> Organizations => Set<Organization>();

    public DbSet<OrgSlugAlias> OrgSlugAliases => Set<OrgSlugAlias>();

    public DbSet<OrgMembership> OrgMemberships => Set<OrgMembership>();

    public DbSet<OrgRoleAssignment> OrgRoleAssignments => Set<OrgRoleAssignment>();

    public DbSet<CrossOrgRole> CrossOrgRoles => Set<CrossOrgRole>();

    public DbSet<CrossOrgAssignment> CrossOrgAssignments => Set<CrossOrgAssignment>();

    public DbSet<AgentCredential> AgentCredentials => Set<AgentCredential>();

    public DbSet<IntegrationApp> IntegrationApps => Set<IntegrationApp>();

    public DbSet<IntegrationEvent> IntegrationEvents => Set<IntegrationEvent>();

    public DbSet<IdeaIntake> IdeaIntakes => Set<IdeaIntake>();

    public DbSet<Idea> Ideas => Set<Idea>();

    /// <summary>The ASP.NET Data Protection key ring, so protected secrets survive restarts (ADR 0042).</summary>
    public DbSet<DataProtectionKey> DataProtectionKeys => Set<DataProtectionKey>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.UseOpenIddict();

        builder.Entity<Profile>(profile =>
        {
            profile.Property(p => p.Name).HasMaxLength(200);
            profile.Property(p => p.HomeCity).HasMaxLength(100);
            // Reports group and filter members by home city (ADR 0030).
            profile.HasIndex(p => p.HomeCity);
            profile.Property(p => p.Bio).HasMaxLength(400);
            profile.Property(p => p.SuspendedReason).HasMaxLength(500);
            profile.Ignore(p => p.DomainEvents);
            profile.Property(p => p.Kind).HasConversion<string>().HasMaxLength(16);
            profile.OwnsMany(p => p.Photos, photo =>
            {
                photo.ToTable("ProfilePhotos");
                photo.WithOwner().HasForeignKey("ProfileId");
                photo.HasKey(p => p.Id);
                photo.Property(p => p.Id).ValueGeneratedNever();
                photo.Property(p => p.BlobName).HasMaxLength(200);
                photo.Property(p => p.AltText).HasMaxLength(300);
            });
            profile.OwnsOne(p => p.PhotoLease, lease =>
            {
                lease.ToTable("PhotoLeases");
                lease.WithOwner().HasForeignKey("ProfileId");
                lease.Property(l => l.Version).IsConcurrencyToken();
            });
            profile.Navigation(p => p.PhotoLease).IsRequired();
        });

        ConfigureOrganizations(builder);

        builder.Entity<PhotoBlobTask>(task =>
        {
            task.Property(t => t.Work).HasConversion<string>().HasMaxLength(16);
            task.Property(t => t.BlobName).HasMaxLength(200);
            task.Property(t => t.ContentType).HasMaxLength(32);
            task.HasIndex(t => t.NextAttemptAt);
            task.HasIndex(t => t.PhotoId);
        });

        builder.Entity<VerificationResend>(resend =>
        {
            resend.Property(r => r.NormalizedEmail).HasMaxLength(256);
            resend.HasIndex(r => new { r.NormalizedEmail, r.RequestedAt });
        });

        builder.Entity<SystemAdminRoster>(roster =>
        {
            roster.Property(r => r.Id).ValueGeneratedNever();
            roster.Property(r => r.Version).IsConcurrencyToken();
        });

        builder.Entity<OutboxMessage>(message =>
        {
            message.Property(m => m.To).HasMaxLength(256);
            message.Property(m => m.Subject).HasMaxLength(300);
            message.Property(m => m.LastError).HasMaxLength(500);
            message.HasIndex(m => new { m.SentAt, m.FailedAt, m.NextAttemptAt });
        });

        builder.Entity<AuditEntry>(entry =>
        {
            entry.Property(e => e.Id).ValueGeneratedNever();
            entry.Property(e => e.Action).HasMaxLength(100);
            entry.Property(e => e.TargetType).HasMaxLength(100);
            entry.Property(e => e.TargetId).HasMaxLength(100);
            entry.Property(e => e.IpAddress).HasMaxLength(45);
            entry.Property(e => e.Detail).HasMaxLength(500);
            entry.HasIndex(e => e.OccurredAtUtc);
            entry.HasIndex(e => new { e.OrganizationId, e.OccurredAtUtc });
            entry.HasIndex(e => new { e.PortfolioId, e.OccurredAtUtc });
        });

        builder.Entity<Notification>(notification =>
        {
            notification.Property(n => n.Id).ValueGeneratedNever();
            notification.Property(n => n.Kind).HasConversion<string>().HasMaxLength(48);
            notification.Property(n => n.Title).HasMaxLength(300);
            notification.Property(n => n.LinkPath).HasMaxLength(300);
            notification.Ignore(n => n.IsRead);
            notification.HasIndex(n => new { n.RecipientId, n.CreatedAt });
        });

        builder.Entity<PendingConnection>(pending =>
        {
            pending.Property(p => p.Id).ValueGeneratedNever();
            pending.HasIndex(p => new { p.ProfileId, p.LeadId, p.OrganizationId }).IsUnique();
        });

        builder.Entity<ConnectLink>(link =>
        {
            link.Property(l => l.Id).ValueGeneratedNever();
            // One link per owner per org (ADR 0041).
            link.HasIndex(l => new { l.OwnerId, l.OrganizationId }).IsUnique();
            link.Property(l => l.TokenHash).HasMaxLength(64);
            link.HasIndex(l => l.TokenHash).IsUnique();
            link.Property(l => l.ProtectedToken).HasMaxLength(1024);
        });

        builder.Entity<Invite>(invite =>
        {
            invite.Property(i => i.Id).ValueGeneratedNever();
            invite.Property(i => i.Email).HasMaxLength(256);
            invite.Property(i => i.TokenHash).HasMaxLength(64);
            invite.HasIndex(i => i.TokenHash).IsUnique();
            invite.HasIndex(i => new { i.OrganizationId, i.CreatedAt });
            invite.Property(i => i.Note).HasMaxLength(500);
            invite.HasIndex(i => new { i.InvitedBy, i.CreatedAt });
        });

        builder.Entity<Contact>(contact =>
        {
            contact.Property(c => c.Id).ValueGeneratedNever();
            contact.Property(c => c.Name).HasMaxLength(200);
            contact.Property(c => c.Email).HasMaxLength(256);
            contact.Property(c => c.Phone).HasMaxLength(200);
            contact.Property(c => c.Organization).HasMaxLength(200);
            contact.Property(c => c.City).HasMaxLength(200);
            contact.Ignore(c => c.IsArchived);
            contact.Ignore(c => c.CanBeDeleted);
            contact.HasIndex(c => new { c.OwnerId, c.ArchivedAtUtc });
            contact.HasIndex(c => c.Email);
            // Deleting a contact deletes its notes (L2-016 AC3).
            contact.HasMany(c => c.Notes).WithOne().HasForeignKey(n => n.ContactId).OnDelete(DeleteBehavior.Cascade);
            contact.Navigation(c => c.Notes).UsePropertyAccessMode(PropertyAccessMode.Field);
            // Photos are owned, so deleting a contact deletes them too (L2-070 AC6).
            contact.OwnsMany(c => c.Photos, photo =>
            {
                photo.ToTable("ContactPhotos");
                photo.WithOwner().HasForeignKey("ContactId");
                photo.HasKey(p => p.Id);
                photo.Property(p => p.Id).ValueGeneratedNever();
                photo.Property(p => p.BlobName).HasMaxLength(200);
                photo.Property(p => p.AltText).HasMaxLength(300);
            });
            contact.Navigation(c => c.Photos).UsePropertyAccessMode(PropertyAccessMode.Field);
            contact.OwnsOne(c => c.PhotoLease, lease =>
            {
                lease.ToTable("ContactPhotoLeases");
                lease.WithOwner().HasForeignKey("ContactId");
                lease.Property(l => l.Version).IsConcurrencyToken();
            });
            contact.Navigation(c => c.PhotoLease).IsRequired();
        });

        builder.Entity<ContactNote>(note =>
        {
            note.Property(n => n.Id).ValueGeneratedNever();
            note.Property(n => n.Body).HasMaxLength(2000);
            note.HasIndex(n => new { n.ContactId, n.CreatedAtUtc });
        });

        builder.Entity<Partner>(partner =>
        {
            partner.Property(p => p.Id).ValueGeneratedNever();
            partner.Property(p => p.Name).HasMaxLength(200);
            partner.Property(p => p.Website).HasMaxLength(200);
            partner.Property(p => p.Offering).HasMaxLength(200);
            partner.Property(p => p.ContactName).HasMaxLength(200);
            partner.Property(p => p.Email).HasMaxLength(256);
            partner.Property(p => p.Phone).HasMaxLength(200);
            partner.Property(p => p.Notes).HasMaxLength(2000);
            partner.Property(p => p.Stage).HasConversion<string>().HasMaxLength(16);
            partner.HasIndex(p => p.Stage);
            // Merge and restore compare versions; a race the check misses fails at SaveChanges (ADR 0028).
            partner.Property(p => p.Version).IsConcurrencyToken();
            partner.HasIndex(p => p.ArchivedAtUtc);
            partner.Ignore(p => p.IsArchived);
            partner.HasMany(p => p.StageChanges).WithOne().HasForeignKey(c => c.PartnerId).OnDelete(DeleteBehavior.Cascade);
            partner.Navigation(p => p.StageChanges).UsePropertyAccessMode(PropertyAccessMode.Field);
        });

        builder.Entity<PartnerStageChange>(change =>
        {
            change.ToTable("PartnerStageChanges");
            change.Property(c => c.Id).ValueGeneratedNever();
            change.Property(c => c.From).HasConversion<string>().HasMaxLength(16);
            change.Property(c => c.To).HasConversion<string>().HasMaxLength(16);
            change.Property(c => c.Note).HasMaxLength(500);
            change.HasIndex(c => new { c.PartnerId, c.MovedAtUtc });
            change.HasIndex(c => c.MergedFromPartnerId);
        });

        builder.Entity<PartnerActivity>(activity =>
        {
            activity.ToTable("PartnerActivities");
            activity.Property(a => a.Id).ValueGeneratedNever();
            activity.Property(a => a.Kind).HasConversion<string>().HasMaxLength(16);
            activity.Property(a => a.FromStage).HasConversion<string>().HasMaxLength(16);
            activity.Property(a => a.ToStage).HasConversion<string>().HasMaxLength(16);
            activity.Property(a => a.Summary).HasMaxLength(2000);
            activity.Property(a => a.NextStep).HasMaxLength(200);
            activity.HasIndex(a => new { a.PartnerId, a.OccurredOn, a.OccurredAt, a.LoggedAtUtc });
            activity.HasIndex(a => a.PartnerId, "IX_PartnerActivities_PartnerId_NextStep").HasFilter("\"NextStep\" IS NOT NULL");
            activity.HasIndex(a => a.StageChangeId);
            activity.HasIndex(a => a.MergedFromPartnerId);
            activity.HasOne<Partner>().WithMany().HasForeignKey(a => a.PartnerId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<PartnerDuplicateDismissal>(dismissal =>
        {
            dismissal.ToTable("PartnerDuplicateDismissals");
            dismissal.Property(d => d.Id).ValueGeneratedNever();
            dismissal.HasIndex(d => new { d.LowerPartnerId, d.HigherPartnerId }).IsUnique();
            dismissal.HasIndex(d => d.HigherPartnerId);
            dismissal.HasOne<Partner>().WithMany().HasForeignKey(d => d.LowerPartnerId).OnDelete(DeleteBehavior.Cascade);
            dismissal.HasOne<Partner>().WithMany().HasForeignKey(d => d.HigherPartnerId).OnDelete(DeleteBehavior.Cascade);
        });

        ConfigureAgile(builder);

        builder.Entity<Event>(ev =>
        {
            ev.Property(e => e.Id).ValueGeneratedNever();
            ev.Property(e => e.Title).HasMaxLength(200);
            ev.Property(e => e.Description).HasMaxLength(4000);
            ev.Property(e => e.Type).HasConversion<string>().HasMaxLength(32);
            ev.Property(e => e.City).HasMaxLength(100);
            ev.Property(e => e.Format).HasConversion<string>().HasMaxLength(16);
            ev.Property(e => e.Venue).HasMaxLength(300);
            ev.Property(e => e.OnlineLink).HasMaxLength(500);
            ev.Property(e => e.Visibility).HasConversion<string>().HasMaxLength(16);
            ev.Property(e => e.CancellationReason).HasMaxLength(500);
            ev.Ignore(e => e.RsvpCount);
            ev.Ignore(e => e.IsFull);
            ev.Ignore(e => e.CheckedInCount);
            ev.Ignore(e => e.AttendeeCount);
            ev.Ignore(e => e.CheckInOpensAt);
            ev.HasIndex(e => e.StartsAt);
            ev.HasMany(e => e.Rsvps).WithOne().HasForeignKey(r => r.EventId).OnDelete(DeleteBehavior.Cascade);
            ev.Navigation(e => e.Rsvps).HasField("_rsvps").UsePropertyAccessMode(PropertyAccessMode.Field);
        });

        builder.Entity<Rsvp>(rsvp =>
        {
            rsvp.ToTable("Rsvps");
            rsvp.Property(r => r.Id).ValueGeneratedNever();
            rsvp.Property(r => r.GuestName).HasMaxLength(200);
            rsvp.Property(r => r.GuestEmail).HasMaxLength(256);
            rsvp.Ignore(r => r.IsGuest);
            rsvp.Ignore(r => r.IsCheckedIn);
            rsvp.Property(r => r.CancelTokenHash).HasMaxLength(64);
            rsvp.HasIndex(r => r.CancelTokenHash).IsUnique().HasFilter("\"CancelTokenHash\" IS NOT NULL");
            rsvp.HasIndex(r => new { r.EventId, r.ProfileId }).IsUnique().HasFilter("\"ProfileId\" IS NOT NULL");
            rsvp.HasIndex(r => new { r.EventId, r.GuestEmail });
        });

        ConfigureAnnouncements(builder);
        ConfigureResources(builder);
        ConfigureNotes(builder);

        // Full-text search columns exist only in PostgreSQL; the in-memory test database has none (ADR 0016).
        if (Database.IsNpgsql())
        {
            SearchVectors.Configure(builder);
        }

        builder.Entity<CommunityUser>()
            .HasOne<Profile>()
            .WithOne()
            .HasForeignKey<CommunityUser>(u => u.ProfileId);
    }

    private static void ConfigureResources(ModelBuilder builder)
    {
        builder.Entity<Resource>(resource =>
        {
            resource.Property(r => r.Id).ValueGeneratedNever();
            resource.Property(r => r.Title).HasMaxLength(Resource.MaxTitle);
            resource.Property(r => r.Description).HasMaxLength(Resource.MaxDescription);
            resource.Property(r => r.Type).HasConversion<string>().HasMaxLength(16);
            resource.Property(r => r.Visibility).HasConversion<string>().HasMaxLength(16);
            resource.Property(r => r.OwnerRoleName).HasMaxLength(100);
            resource.Property(r => r.LinkUrl).HasMaxLength(2000);
            resource.Property(r => r.LinkHost).HasMaxLength(255);
            resource.Property(r => r.TagText).HasMaxLength(2000);
            resource.Ignore(r => r.IsArchived);
            resource.Ignore(r => r.IsLink);
            resource.Ignore(r => r.PurgeAt);
            resource.HasIndex(r => new { r.ArchivedAt, r.AddedAt });
            resource.HasIndex(r => r.OwnerId);
            resource.OwnsOne(r => r.File, file =>
            {
                file.Property(f => f.FileName).HasMaxLength(255);
                file.Property(f => f.Extension).HasMaxLength(8);
                file.Property(f => f.ContentType).HasMaxLength(100);
                file.Property(f => f.BlobName).HasMaxLength(200);
                file.Property(f => f.ThumbnailBlobName).HasMaxLength(200);
            });
            resource.OwnsMany(r => r.Tags, tag =>
            {
                tag.ToTable("ResourceTags");
                tag.WithOwner().HasForeignKey(t => t.ResourceId);
                tag.HasKey(t => new { t.ResourceId, t.Tag });
                tag.Property(t => t.Tag).HasMaxLength(Resource.MaxTag);
                tag.HasIndex(t => t.Tag);
            });
            resource.Navigation(r => r.Tags).HasField("_tags").UsePropertyAccessMode(PropertyAccessMode.Field);
            resource.OwnsMany(r => r.SharedMembers, member =>
            {
                member.ToTable("ResourceShareMembers");
                member.WithOwner().HasForeignKey(m => m.ResourceId);
                member.HasKey(m => new { m.ResourceId, m.ProfileId });
                member.HasIndex(m => m.ProfileId);
            });
            resource.Navigation(r => r.SharedMembers).HasField("_members").UsePropertyAccessMode(PropertyAccessMode.Field);
            resource.OwnsMany(r => r.SharedRoles, role =>
            {
                role.ToTable("ResourceShareRoles");
                role.WithOwner().HasForeignKey(x => x.ResourceId);
                role.HasKey(x => new { x.ResourceId, x.RoleId });
            });
            resource.Navigation(r => r.SharedRoles).HasField("_roles").UsePropertyAccessMode(PropertyAccessMode.Field);
        });

        builder.Entity<ResourceBlobTask>(task =>
        {
            task.Property(t => t.Work).HasConversion<string>().HasMaxLength(16);
            task.Property(t => t.BlobName).HasMaxLength(200);
            task.Property(t => t.ContentType).HasMaxLength(100);
            task.HasIndex(t => t.NextAttemptAt);
            task.HasIndex(t => t.ResourceId);
        });
    }

    private static void ConfigureNotes(ModelBuilder builder)
    {
        builder.Entity<NotePage>(page =>
        {
            page.Property(p => p.Id).ValueGeneratedNever();
            page.Property(p => p.Title).HasMaxLength(NotePage.MaxTitle);
            page.Property(p => p.Icon).HasMaxLength(NotePage.MaxIcon);
            page.Property(p => p.Visibility).HasConversion<string>().HasMaxLength(16);
            page.Property(p => p.Version).IsConcurrencyToken();
            page.Ignore(p => p.IsArchived);
            page.HasIndex(p => new { p.ArchivedAt, p.UpdatedAt });
            page.HasIndex(p => p.OwnerId);
            page.HasIndex(p => p.ParentId);
            page.OwnsMany(p => p.SharedMembers, member =>
            {
                // A generated key, so a member added to a loaded page is inserted, not updated.
                member.ToTable("NoteShareMembers");
                member.WithOwner().HasForeignKey(m => m.PageId);
                member.Property<int>("Id").ValueGeneratedOnAdd();
                member.HasKey("Id");
                member.HasIndex(m => new { m.PageId, m.ProfileId }).IsUnique();
                member.HasIndex(m => m.ProfileId);
            });
            page.Navigation(p => p.SharedMembers).HasField("_members").UsePropertyAccessMode(PropertyAccessMode.Field);
            page.OwnsMany(p => p.SharedRoles, role =>
            {
                role.ToTable("NoteShareRoles");
                role.WithOwner().HasForeignKey(x => x.PageId);
                role.Property<int>("Id").ValueGeneratedOnAdd();
                role.HasKey("Id");
                role.HasIndex(x => new { x.PageId, x.RoleId }).IsUnique();
            });
            page.Navigation(p => p.SharedRoles).HasField("_roles").UsePropertyAccessMode(PropertyAccessMode.Field);
        });

        builder.Entity<NoteLink>(link =>
        {
            link.HasKey(l => new { l.SourceId, l.TargetId });
            link.HasIndex(l => l.TargetId);
        });

        builder.Entity<NoteImage>(image =>
        {
            image.Property(i => i.Id).ValueGeneratedNever();
            image.Property(i => i.BlobName).HasMaxLength(200);
            image.Property(i => i.ContentType).HasMaxLength(100);
            image.HasIndex(i => i.PageId);
        });
    }

    private static void ConfigureAnnouncements(ModelBuilder builder)
    {
        builder.Entity<Announcement>(announcement =>
        {
            announcement.Property(a => a.Id).ValueGeneratedNever();
            announcement.Property(a => a.Subject).HasMaxLength(200);
            announcement.Property(a => a.Body).HasMaxLength(5000);
            announcement.HasIndex(a => a.SentAt);
            announcement.HasIndex(a => a.SenderId);
            announcement.OwnsOne(a => a.Audience, audience =>
            {
                audience.Property(x => x.Kind).HasColumnName("AudienceKind").HasConversion<string>().HasMaxLength(16);
                audience.Property(x => x.EventId).HasColumnName("AudienceEventId");
                // The chosen catalogue role ids, comma-separated.
                audience.Property(x => x.Roles).HasColumnName("AudienceRoles").HasMaxLength(1000)
                    .HasConversion(
                        roles => string.Join(',', roles.Select(r => r.ToString()).Order()),
                        value => value.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(Guid.Parse).ToHashSet(),
                        new ValueComparer<IReadOnlySet<Guid>>(
                            (a, b) => a!.SetEquals(b!),
                            roles => roles.Aggregate(0, (hash, role) => hash ^ role.GetHashCode()),
                            roles => roles.ToHashSet()));
            });
            announcement.Navigation(a => a.Audience).IsRequired();
            announcement.OwnsMany(a => a.Recipients, recipient =>
            {
                recipient.ToTable("AnnouncementRecipients");
                recipient.WithOwner().HasForeignKey(r => r.AnnouncementId);
                recipient.HasKey(r => new { r.AnnouncementId, r.ProfileId });
                recipient.HasIndex(r => r.ProfileId);
            });
            announcement.Navigation(a => a.Recipients).HasField("_recipients").UsePropertyAccessMode(PropertyAccessMode.Field);
        });
    }

    // Archived workspaces and work items are hidden from every normal view (L2-037 AC1, ADR 0011).
    private static void ConfigureAgile(ModelBuilder builder)
    {
        builder.Entity<Workspace>(workspace =>
        {
            workspace.Property(w => w.Id).ValueGeneratedNever();
            workspace.Property(w => w.Name).HasMaxLength(100);
            workspace.Property(w => w.Method).HasConversion<string>().HasMaxLength(16);
            workspace.HasIndex(w => w.OwnerId);
            workspace.HasQueryFilter(w => !w.IsArchived);
            workspace.OwnsMany(w => w.Members, member =>
            {
                member.ToTable("WorkspaceMembers");
                member.WithOwner().HasForeignKey(m => m.WorkspaceId);
                // A generated shadow key, so EF sees a member added to a loaded workspace as new rather than modified.
                member.Property<int>("Id").ValueGeneratedOnAdd();
                member.HasKey("Id");
                member.HasIndex(m => new { m.WorkspaceId, m.ProfileId }).IsUnique();
                member.HasIndex(m => m.ProfileId);
            });
        });

        builder.Entity<WorkItem>(item =>
        {
            item.Property(i => i.Id).ValueGeneratedNever();
            item.Property(i => i.Kind).HasConversion<string>().HasMaxLength(16);
            item.Property(i => i.Status).HasConversion<string>().HasMaxLength(16);
            item.Property(i => i.Title).HasMaxLength(WorkItem.MaxTitleLength);
            item.Property(i => i.Description).HasMaxLength(4000);
            item.HasIndex(i => i.WorkspaceId);
            item.HasIndex(i => i.ParentId);
            item.HasIndex(i => i.SprintId);
            item.HasIndex(i => i.AssigneeId);
            item.HasQueryFilter(i => !i.IsArchived);
            item.OwnsMany(i => i.Comments, comment =>
            {
                comment.ToTable("WorkItemComments");
                comment.WithOwner().HasForeignKey(c => c.WorkItemId);
                comment.HasKey(c => c.Id);
                comment.Property(c => c.Id).ValueGeneratedNever();
                comment.Property(c => c.Body).HasMaxLength(2000);
            });
        });

        builder.Entity<Sprint>(sprint =>
        {
            sprint.Property(s => s.Id).ValueGeneratedNever();
            sprint.Property(s => s.Name).HasMaxLength(100);
            sprint.Property(s => s.Goal).HasMaxLength(200);
            sprint.Property(s => s.State).HasConversion<string>().HasMaxLength(16);
            sprint.HasIndex(s => s.WorkspaceId);
            // Backs the one-active-sprint rule (L2-035 AC1) alongside Workspace.StartSprint.
            sprint.HasIndex(s => s.WorkspaceId, "IX_Sprints_WorkspaceId_Active").IsUnique().HasFilter("\"State\" = 'Active'");
        });

        builder.Entity<PokerSession>(session =>
        {
            session.Property(s => s.Id).ValueGeneratedNever();
            session.Ignore(s => s.CurrentStoryId);
            session.Ignore(s => s.IsComplete);
            session.Ignore(s => s.VoterIds);
            session.HasIndex(s => s.WorkspaceId);
            session.OwnsMany(s => s.Votes, vote =>
            {
                vote.ToTable("PokerVotes");
                vote.WithOwner().HasForeignKey(v => v.SessionId);
                // A generated shadow key, as for workspace members: a vote added to a loaded session is new, not modified.
                vote.Property<int>("Id").ValueGeneratedOnAdd();
                vote.HasKey("Id");
                vote.HasIndex(v => new { v.SessionId, v.ProfileId }).IsUnique();
                vote.Property(v => v.Value).HasConversion<string>().HasMaxLength(16);
            });
        });
    }

    /// <summary>The hierarchy (ADR 0033 to ADR 0036) and the org index on every org-owned root (ADR 0034).</summary>
    private static void ConfigureOrganizations(ModelBuilder builder)
    {
        builder.Entity<Portfolio>(portfolio =>
        {
            portfolio.Property(p => p.Id).ValueGeneratedNever();
            portfolio.Property(p => p.Name).HasMaxLength(200);
            portfolio.Property(p => p.Slug).HasMaxLength(40);
            portfolio.HasIndex(p => p.Slug).IsUnique();
        });

        builder.Entity<PortfolioLead>(lead =>
        {
            lead.HasKey(l => new { l.PortfolioId, l.ProfileId });
            lead.HasIndex(l => l.ProfileId);
        });

        builder.Entity<OrgType>(type =>
        {
            type.Property(t => t.Id).ValueGeneratedNever();
            type.Property(t => t.Key).HasMaxLength(60);
            type.Property(t => t.Name).HasMaxLength(100);
            type.HasIndex(t => new { t.PortfolioId, t.Key }).IsUnique();
        });

        builder.Entity<RoleDefinition>(role =>
        {
            role.Property(r => r.Id).ValueGeneratedNever();
            role.Property(r => r.Key).HasMaxLength(60);
            role.Property(r => r.Name).HasMaxLength(100);
            role.Property(r => r.Description).HasMaxLength(300);
            role.HasIndex(r => new { r.OrgTypeId, r.Key }).IsUnique();
        });

        builder.Entity<Organization>(org =>
        {
            org.Property(o => o.Id).ValueGeneratedNever();
            org.Property(o => o.Name).HasMaxLength(200);
            org.Property(o => o.Slug).HasMaxLength(40);
            org.HasIndex(o => o.Slug).IsUnique();
            org.Property(o => o.DisplayName).HasMaxLength(200);
            org.Property(o => o.LogoBlobName).HasMaxLength(200);
            org.Property(o => o.AccentColour).HasMaxLength(7);
            org.HasIndex(o => o.PortfolioId);
            org.HasIndex(o => o.OrgTypeId);
            org.Ignore(o => o.ShownName);
        });

        builder.Entity<OrgSlugAlias>(alias =>
        {
            alias.HasKey(a => a.Slug);
            alias.Property(a => a.Slug).HasMaxLength(40);
            alias.HasIndex(a => a.OrganizationId);
        });

        builder.Entity<OrgMembership>(membership =>
        {
            membership.HasKey(m => new { m.OrganizationId, m.ProfileId });
            membership.Property(m => m.JoinedVia).HasConversion<string>().HasMaxLength(16);
            membership.HasIndex(m => m.ProfileId);
        });

        builder.Entity<OrgRoleAssignment>(assignment =>
        {
            assignment.HasKey(a => new { a.OrganizationId, a.ProfileId, a.RoleDefinitionId });
            assignment.HasIndex(a => a.ProfileId);
            assignment.HasIndex(a => a.RoleDefinitionId);
        });

        builder.Entity<CrossOrgRole>(role =>
        {
            role.Property(r => r.Id).ValueGeneratedNever();
            role.Property(r => r.Key).HasMaxLength(60);
            role.Property(r => r.Name).HasMaxLength(100);
            role.Property(r => r.Description).HasMaxLength(300);
            role.Property(r => r.ScopeKind).HasConversion<string>().HasMaxLength(16);
            role.HasIndex(r => new { r.PortfolioId, r.Key }).IsUnique();
        });

        builder.Entity<CrossOrgAssignment>(assignment =>
        {
            assignment.Property(a => a.Id).ValueGeneratedNever();
            assignment.HasIndex(a => new { a.CrossOrgRoleId, a.ProfileId }).IsUnique();
            assignment.HasIndex(a => a.ProfileId);
        });

        builder.Entity<AgentCredential>(credential =>
        {
            credential.Property(c => c.Id).ValueGeneratedNever();
            credential.Property(c => c.Name).HasMaxLength(100);
            credential.Property(c => c.TokenHash).HasMaxLength(64);
            credential.HasIndex(c => c.TokenHash).IsUnique();
            credential.Property(c => c.Prefix).HasMaxLength(16);
            credential.HasIndex(c => c.AgentProfileId);
        });

        builder.Entity<IntegrationApp>(app =>
        {
            app.Property(a => a.Id).ValueGeneratedNever();
            app.Property(a => a.Name).HasMaxLength(IntegrationApp.NameMaxLength);
            app.Property(a => a.SourceId).HasMaxLength(40);
            app.HasIndex(a => a.SourceId).IsUnique();
            app.Property(a => a.SecretPrefix).HasMaxLength(16);
            app.HasIndex(a => a.OrganizationId);
            app.Ignore(a => a.IsRevoked);
        });

        builder.Entity<IntegrationEvent>(evt =>
        {
            evt.Property(e => e.Id).ValueGeneratedNever();
            evt.Property(e => e.EventType).HasMaxLength(IntegrationEvent.EventTypeMaxLength);
            evt.Property(e => e.DataJson).HasColumnType("jsonb");
            evt.HasIndex(e => new { e.IntegrationAppId, e.EventId }).IsUnique();
            evt.HasIndex(e => new { e.IntegrationAppId, e.ReceivedAt });
            evt.HasIndex(e => e.OrganizationId);
        });

        builder.Entity<IdeaIntake>(intake =>
        {
            intake.Property(i => i.Id).ValueGeneratedNever();
        });

        builder.Entity<Idea>(idea =>
        {
            idea.Property(i => i.Id).ValueGeneratedNever();
            idea.Property(i => i.SubmitterName).HasMaxLength(IdeaOptions.NameMaxLength);
            idea.Property(i => i.SubmitterEmail).HasMaxLength(IdeaOptions.EmailMaxLength);
            idea.Property(i => i.Problem).HasMaxLength(IdeaOptions.ProblemMaxLength);
            idea.Property(i => i.Audience).HasMaxLength(IdeaOptions.KeyMaxLength);
            idea.Property(i => i.Title).HasMaxLength(IdeaOptions.TitleMaxLength);
            idea.Property(i => i.Pitch).HasMaxLength(IdeaOptions.PitchMaxLength);
            idea.Property(i => i.Solution).HasMaxLength(IdeaOptions.SolutionMaxLength);
            idea.Property(i => i.Stage).HasMaxLength(IdeaOptions.KeyMaxLength);
            idea.Property(i => i.Platform).HasMaxLength(IdeaOptions.KeyMaxLength);
            idea.Property(i => i.Involvement).HasMaxLength(IdeaOptions.KeyMaxLength);
            idea.Property(i => i.Commitment).HasMaxLength(IdeaOptions.KeyMaxLength);
            idea.Property(i => i.Status).HasConversion<string>().HasMaxLength(16);
            idea.HasIndex(i => new { i.OrganizationId, i.SubmittedAt });
        });

        builder.Entity<Event>().HasIndex(e => e.OrganizationId);
        builder.Entity<Partner>().HasIndex(p => p.OrganizationId);
        builder.Entity<Contact>().HasIndex(c => new { c.OrganizationId, c.OwnerId });
        builder.Entity<PendingConnection>().HasIndex(p => p.OrganizationId);
        builder.Entity<Resource>().HasIndex(r => r.OrganizationId);
        builder.Entity<NotePage>().HasIndex(p => p.OrganizationId);
        builder.Entity<Workspace>().HasIndex(w => w.OrganizationId);
        builder.Entity<Announcement>().HasIndex(a => a.OrganizationId);
        builder.Entity<ConnectLink>().HasIndex(l => l.OrganizationId);
        builder.Entity<Notification>().HasIndex(n => n.OrganizationId);
    }
}
