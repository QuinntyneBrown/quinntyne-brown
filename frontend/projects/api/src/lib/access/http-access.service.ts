import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { API_BASE_URL } from '../config';
import { ALL_ORGS, AccessService, MyAccess, MyOrg, RoleOption } from './access.service';
import { OrgContext } from './org-context';

/** Loads GET /api/me/access and answers permission questions from it (ADR 0037). */
@Injectable()
export class HttpAccessService implements AccessService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);
  private readonly context = inject(OrgContext);
  private loading: Promise<MyAccess> | null = null;
  private readonly state = signal<MyAccess | null>(null);

  readonly access = this.state.asReadonly();
  readonly orgs = computed(() => this.state()?.orgs ?? []);
  readonly isSystemAdmin = computed(() => this.state()?.isSystemAdmin ?? false);
  readonly activeSlug = this.context.slug.asReadonly();
  readonly activeOrg = computed(() => this.find(this.activeSlug()));
  readonly homeOrg = computed(() => {
    const orgs = this.orgs();
    return this.activeOrg() ?? (orgs.length === 1 ? orgs[0] : null);
  });

  load(): Promise<MyAccess> {
    const loaded = this.state();
    if (loaded) return Promise.resolve(loaded);
    return (this.loading ??= this.fetch());
  }

  refresh(): Promise<MyAccess> {
    return (this.loading = this.fetch());
  }

  setActive(slug: string | null): void {
    this.context.slug.set(slug);
  }

  can(permission: string, org?: string | null): boolean {
    return this.scope(org).some((o) => o.permissions.includes(permission));
  }

  feature(name: string, org?: string | null): boolean {
    return this.scope(org).some((o) => o.features.includes(name));
  }

  shareRoles(org?: string | null): RoleOption[] {
    const found = org ? this.find(org) : this.homeOrg();
    return found?.shareRoles ?? [];
  }

  roleName(key: string, org?: string | null): string {
    const roles = org ? this.shareRoles(org) : this.orgs().flatMap((o) => o.shareRoles);
    return roles.find((r) => r.key === key)?.name ?? key;
  }

  orgsWith(permission: string): MyOrg[] {
    return this.orgs().filter((o) => o.permissions.includes(permission));
  }

  async resolve(slug: string): Promise<string | null> {
    try {
      const found = await firstValueFrom(
        this.http.get<{ slug: string }>(`${this.base}/orgs/resolve/${encodeURIComponent(slug)}`),
      );
      return found.slug;
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 404) return null;
      throw error;
    }
  }

  private async fetch(): Promise<MyAccess> {
    try {
      const access = await firstValueFrom(this.http.get<MyAccess>(`${this.base}/me/access`));
      this.state.set(access);
      return access;
    } finally {
      this.loading = null;
    }
  }

  /** The orgs a question is about: one org, or every covered org in "All orgs". */
  private scope(org?: string | null): MyOrg[] {
    const slug = org === undefined ? this.activeSlug() : org;
    if (slug === ALL_ORGS) return this.orgs();
    const found = this.find(slug);
    return found ? [found] : [];
  }

  private find(slug: string | null): MyOrg | null {
    return slug ? (this.orgs().find((o) => o.slug === slug) ?? null) : null;
  }
}
