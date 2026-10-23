import { Injectable, signal } from '@angular/core';

/**
 * The org in the URL, read by the org interceptor; HttpAccessService sets it. It has no
 * dependencies, so the interceptor can read it without a cycle through HttpClient.
 */
@Injectable({ providedIn: 'root' })
export class OrgContext {
  readonly slug = signal<string | null>(null);
}
