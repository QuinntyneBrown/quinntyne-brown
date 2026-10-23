import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { OrgLabel, PagedResult } from '../shared';

/** `Portfolio` is every member of every org of the portfolio, sent by the Portfolio Lead (L2-151). */
export type AudienceKind = 'Everyone' | 'Roles' | 'EventRsvps' | 'Portfolio';

/** Everyone, the holders of one or more roles, or one event's RSVP list (L2-029). */
export interface AnnouncementAudience {
  kind: AudienceKind;
  /** Catalogue role keys of the org. */
  roles?: string[];
  eventId?: string;
}

export interface SendAnnouncementRequest {
  subject: string;
  body: string;
  /** "Also send by email": on by default; each recipient's opt-out still applies. */
  alsoEmail: boolean;
  audience: AnnouncementAudience;
}

/** Who a sent announcement reached: everyone in the app, and how many of them by email. */
export interface AnnouncementSent {
  id: string;
  recipientCount: number;
  emailCount: number;
}

/** An announcement sent to the caller, or by them (L2-030, ADR 0016). */
export interface AnnouncementDto {
  id: string;
  subject: string;
  body: string;
  sentAt: string;
  senderName: string;
  audienceKind: AudienceKind;
  /** The chosen roles' names of a role audience. */
  roles: string[];
  /** The event of an RSVP audience. */
  eventTitle: string | null;
  recipientCount: number;
  /** The org it was sent in (L2-151 AC4). */
  organization?: OrgLabel | null;
}

/** Contract for the announcements API. Pages depend on ANNOUNCEMENTS_SERVICE, never on HttpAnnouncementsService. */
export interface AnnouncementsService {
  list(page?: number): Observable<PagedResult<AnnouncementDto>>;
  countRecipients(audience: AnnouncementAudience): Observable<number>;
  send(announcement: SendAnnouncementRequest): Observable<AnnouncementSent>;
  /** Whether the caller turned announcement emails off. */
  getEmailOptOut(): Observable<boolean>;
  setEmailOptOut(optedOut: boolean): Observable<void>;
  /** Anonymous: opens from the email footer link with a signed token. */
  unsubscribe(token: string): Observable<void>;
}

export const ANNOUNCEMENTS_SERVICE = new InjectionToken<AnnouncementsService>(
  'ANNOUNCEMENTS_SERVICE',
);
