/** Where a role comes from (ADR 0033): an org's catalogue, a built-in tier or a cross-org role. */
export type RoleKind = 'catalogue' | 'tier' | 'crossOrg';

/**
 * A role as the API returns it (RoleDto). Catalogue roles are data, so the UI shows `name` and
 * sends `key`; it never decides what a role may do (ADR 0037).
 */
export interface RoleRef {
  key: string;
  name: string;
  kind: RoleKind;
  /** The org a catalogue role or Org Lead is held in; null for platform tiers and cross-org roles. */
  organizationId: string | null;
  organizationName: string | null;
}

/** The built-in tiers' keys (RoleKeys.cs). */
export const TierKey = {
  SystemAdmin: 'system-admin',
  PortfolioLead: 'portfolio-lead',
  OrgLead: 'org-lead',
} as const;
