using QuinntyneBrown.Community.Application.Admin;
using QuinntyneBrown.Community.Application.Common;
using QuinntyneBrown.Community.Application.Organizations;
using QuinntyneBrown.Community.Domain.Contacts;
using QuinntyneBrown.Community.Domain.Organizations;
using Microsoft.EntityFrameworkCore;

namespace QuinntyneBrown.Community.Application.Contacts;

public enum ContactAccessKind
{
    Owner,
    /// <summary>A System Admin opening another lead's contact: allowed and audited (L2-012 AC2).</summary>
    AdminOverride,
    /// <summary>Anyone else. Answered with 404 so the contact's existence is not revealed (L2-042 AC2).</summary>
    NotFound,
}

/// <summary>
/// Private contact visibility (L2-012, ADR 0014, ADR 0039): the owner and System Admin, nobody else. The Portfolio Lead,
/// Org Leads and cross-org roles never see another person's contacts, whatever their permissions.
/// </summary>
public class ContactAccess(IApplicationDbContext db, ICurrentUser current, IAuditLog audit)
{
    /// <summary>The orgs in the request's scope where the caller keeps contacts (<c>contacts.private</c>).</summary>
    public IReadOnlyList<Guid> KeepingScope =>
        [.. current.Access.ReadScope(Features.Contacts).Where(org => current.Access.Has(org, Permissions.ContactsPrivate))];

    /// <summary>Holders of <c>contacts.private</c> keep contacts; everyone else gets 403 for the list and create.</summary>
    public bool CanKeepContacts => KeepingScope.Count > 0;

    /// <summary>The org a new contact is kept in (ADR 0034).</summary>
    public CreateTarget CreateTarget() => current.Access.TargetFor(Permissions.ContactsPrivate);

    public async Task<Guid?> CallerProfileIdAsync(CancellationToken cancellationToken = default) =>
        current.UserId is { } userId
            ? await db.Users.Where(u => u.Id == userId).Select(u => (Guid?)u.ProfileId).SingleOrDefaultAsync(cancellationToken)
            : null;

    /// <summary>Loads a contact (with its notes when asked) for the caller, or reports that it must look absent.</summary>
    public async Task<(ContactAccessKind Access, Contact? Contact, Guid Actor)> AuthorizeAsync(
        Guid contactId, bool withNotes = false, CancellationToken cancellationToken = default)
    {
        var caller = await CallerProfileIdAsync(cancellationToken);
        IQueryable<Contact> contacts = withNotes ? db.Contacts.Include(c => c.Notes) : db.Contacts;
        var contact = caller is null ? null : await contacts.SingleOrDefaultAsync(c => c.Id == contactId, cancellationToken);
        if (contact is null || caller is not { } actor || !current.Access.Covers(contact.OrganizationId, Features.Contacts))
        {
            return (ContactAccessKind.NotFound, null, Guid.Empty);
        }

        var access = contact.OwnerId == actor ? ContactAccessKind.Owner
            : current.Access.IsSystemAdmin ? ContactAccessKind.AdminOverride
            : ContactAccessKind.NotFound;
        return access == ContactAccessKind.NotFound ? (access, null, Guid.Empty) : (access, contact, actor);
    }

    /// <summary>Audits a System Admin's access to another lead's contact; the owner's own access is not audited.</summary>
    public void AuditOverride(ContactAccessKind access, Guid actor, Contact contact, string action, object? before = null, object? after = null)
    {
        if (access == ContactAccessKind.AdminOverride)
        {
            audit.Record(actor, action, "Contact", contact.Id.ToString(), before, after ?? new { contact.Name }, contact.OrganizationId);
        }
    }
}
