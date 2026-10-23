import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { OrgLabel, PagedResult } from '../shared';

/** A person as an application's record names them. */
export interface IntegrationPersonRef {
  profileId: string;
  name: string;
}

/**
 * An application registered in one org (docs/detailed-designs/integrations, ADR 0042). It never carries a secret,
 * only the secret's first characters.
 */
export interface IntegrationApp {
  id: string;
  name: string;
  sourceId: string;
  secretPrefix: string;
  organization: OrgLabel;
  status: 'Active' | 'Revoked';
  createdAt: string;
  createdBy: IntegrationPersonRef;
  rotatedAt: string | null;
  previousSecretExpiresAt: string | null;
  revokedAt: string | null;
  revokedBy: IntegrationPersonRef | null;
  lastEventAt: string | null;
  eventCount: number;
  /** The caller holds integrations.manage in the application's org. */
  canManage: boolean;
}

/** The only response that carries the secret, once (L2-158 AC1). */
export interface RegisteredApp {
  app: IntegrationApp;
  secret: string;
}

/** The new secret, once, and when the one rotated out stops working (L2-159 AC1). */
export interface RotatedSecret {
  app: IntegrationApp;
  secret: string;
  previousSecretExpiresAt: string;
}

/** The data of a contact-request.created event (ICD). */
export interface ContactRequestData {
  name: string;
  email: string;
  message: string;
  organization?: string | null;
  phone?: string | null;
}

/** One stored event; `data` is the envelope's data object as the publisher sent it. */
export interface IntegrationEvent {
  id: string;
  eventId: string;
  eventType: string;
  occurredAt: string;
  receivedAt: string;
  data: Record<string, unknown>;
}

export const CONTACT_REQUEST_CREATED = 'contact-request.created';

/** Events come 25 at a time, newest first (L2-166 AC1). */
export const INTEGRATION_EVENTS_PAGE_SIZE = 25;

/**
 * Contract for application integrations (L2-158 to L2-160, L2-165, L2-166). Pages and dialogs depend on
 * INTEGRATIONS_SERVICE, never on HttpIntegrationsService.
 */
export interface IntegrationsService {
  /** The active org's applications; 403 without integrations.view, 404 outside coverage or with the feature off. */
  list(): Observable<IntegrationApp[]>;
  /** 404 outside coverage. */
  get(id: string): Observable<IntegrationApp>;
  /** A page of 25 events, newest first. */
  events(id: string, page: number): Observable<PagedResult<IntegrationEvent>>;
  /** 400 `name`, 403 without integrations.manage. */
  register(name: string): Observable<RegisteredApp>;
  /** 409 when revoked. */
  rotate(id: string): Observable<RotatedSecret>;
  /** Permanent; 409 when already revoked. */
  revoke(id: string): Observable<IntegrationApp>;
}

export const INTEGRATIONS_SERVICE = new InjectionToken<IntegrationsService>('INTEGRATIONS_SERVICE');
