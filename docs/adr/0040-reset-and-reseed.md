# 0040. Reset and reseed for the organization hierarchy

- Status: Accepted
- Date: 2026-10-23
- Requirements: L2-157
- Designs: `docs/detailed-designs/organizations/seed`
- Proposal: `docs/proposals/organization-hierarchy.md` (D17)

## Context

The hierarchy adds tables and a required `OrganizationId` to most existing tables. There is no production data to keep. Writing a data migration for 40 incremental migrations would cost more than it buys.

## Decision

- The EF Core migrations in `Infrastructure/Persistence/Migrations/` are **squashed into one new initial migration** that creates the whole schema, hierarchy included. They are still applied only by the Cli (`migrate`), never by the API.
- An existing database is recreated with **`Cli reset`** (drop, migrate, seed) and then **`Cli seed`**.
- `CommunitySeeder.SeedAsync` (idempotent, fixed ids, safe on every deployment) creates the platform's structure:
  - Portfolio **"Quinntyne Brown"** (`quinntyne-brown`);
  - Org Type **"FaithTech City"**: every feature on; Member bundle `notes.create`; catalogue City Lead, Event Lead, Create Lead, Communications Lead, Volunteer, Product Engineer and Attendee with bundles and `CanGrant` reproducing the matrix in `docs/roles-and-permissions.txt` before the hierarchy;
  - Org Type **"Startup"**: profiles, invites, notes, resources and agile on; Member bundle `notes.create`; catalogue Engineer (`invites.send`, `resources.create`, `workspaces.create`, `workspaces.join`, `notes.create`) and Advisor (`resources.create`, `workspaces.join`);
  - Org **"FaithTech Toronto"** (`faithtech-toronto`, type FaithTech City) and Org **"Shelfie"** (`shelfie`, type Startup);
  - Cross-org roles **"Portfolio"** and **"Staff"** (ADR 0035);
  - the OpenIddict web client, the System Admin roster and the starter resources (owned by the first System Admin, Org-wide in FaithTech Toronto).
- `Cli grant-admin <email>` makes the person System Admin **and** Portfolio Lead of "Quinntyne Brown" and Org Lead of FaithTech Toronto, which is how Quinntyne's account is set up. The development account (`SeedDevAccountAsync`) gets the same.
- The demo-data commands (`seed load-users`, `seed report-records`, `seed search-records`) put their records in FaithTech Toronto.
- The `Role` enum, `ProfileRole`, `TeamRoles`, `LeadRoles`, `RoleLabels` and `CityLeadRoleRemoved` are deleted, not kept for compatibility.

## Consequences

- Every environment must be reset once when this ships. The deployment notes say so; the API refuses to start against an unmigrated database as before.
- Future schema changes go back to incremental migrations on top of the new initial one.
