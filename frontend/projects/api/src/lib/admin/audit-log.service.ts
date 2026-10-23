import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { PagedResult, OrgLabel } from '../shared';

/** Audit log categories (L2-041 AC2); each maps onto a set of actions on the server. */
export type AuditCategory = 'roles' | 'suspensions' | 'contacts' | 'deletions';

export interface AuditEntry {
  id: string;
  occurredAtUtc: string;
  actorId: string;
  actorName: string;
  action: string;
  targetType: string;
  targetId: string;
  /** One line saying what happened, e.g. "Granted City Lead to Esther Nakamura". */
  summary: string;
  before: string | null;
  after: string | null;
  ipAddress: string;
  /** The org the action happened in; none for platform actions (L2-153 AC5). */
  organization?: OrgLabel | null;
  /** For an agent, the token used and who issued it (ADR 0036). */
  detail?: string | null;
}

export interface AuditFilters {
  category?: AuditCategory | null;
  actor?: string;
  /** ISO dates; without `from` the server shows the last 90 days. */
  from?: string;
  to?: string;
}

/** Contract for the read-only audit log. Pages depend on AUDIT_LOG_SERVICE, never on HttpAuditLogService. */
export interface AuditLogService {
  /** 50 entries per page, newest first. 403 unless the caller is a System Admin. */
  getEntries(filters: AuditFilters, page?: number): Observable<PagedResult<AuditEntry>>;
  /** Every filtered entry as CSV (L2-041 AC5). */
  exportCsv(filters: AuditFilters): Observable<Blob>;
}

export const AUDIT_LOG_SERVICE = new InjectionToken<AuditLogService>('AUDIT_LOG_SERVICE');
