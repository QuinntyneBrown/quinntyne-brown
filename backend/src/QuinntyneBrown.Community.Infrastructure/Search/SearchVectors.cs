using QuinntyneBrown.Community.Domain.Agile;
using QuinntyneBrown.Community.Domain.Contacts;
using QuinntyneBrown.Community.Domain.Events;
using QuinntyneBrown.Community.Domain.Notes;
using QuinntyneBrown.Community.Domain.Partners;
using QuinntyneBrown.Community.Domain.Profiles;
using QuinntyneBrown.Community.Domain.Resources;
using Microsoft.EntityFrameworkCore;
using NpgsqlTypes;

namespace QuinntyneBrown.Community.Infrastructure.Search;

/// <summary>
/// The generated <c>tsvector</c> column of each searchable table, built from the same fields as the documents the
/// search sources pass to <c>IFullTextSearch</c>, with a GIN index (L2-026 AC5). PostgreSQL only.
/// </summary>
public static class SearchVectors
{
    public const string Column = "SearchVector";

    public static void Configure(ModelBuilder builder)
    {
        Add<Profile>(builder, "Name", "HomeCity", "Bio");
        Add<Event>(builder, "Title", "Description", "City", "Venue");
        Add<Partner>(builder, "Name", "Offering", "ContactName", "Notes");
        Add<Contact>(builder, "Name", "Email", "Organization", "City");
        Add<WorkItem>(builder, "Title", "Description");
        Add<Resource>(builder, "Title", "Description", "TagText", "File_FileName");
        Add<NotePage>(builder, "Title", "BodyText");
    }

    private static void Add<T>(ModelBuilder builder, params string[] columns) where T : class
    {
        var text = string.Join(" || ' ' || ", columns.Select(c => $"coalesce(\"{c}\", '')"));
        builder.Entity<T>().Property<NpgsqlTsVector>(Column)
            .HasComputedColumnSql($"to_tsvector('{PostgresFullTextSearch.Config}', {text})", stored: true);
        builder.Entity<T>().HasIndex(Column).HasMethod("GIN");
    }
}
