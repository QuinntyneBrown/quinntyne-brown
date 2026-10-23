import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  ACCESS_SERVICE,
  PEOPLE_SERVICE,
  PersonSummary,
  ROLES_SERVICE,
  RoleRef,
} from '@faithtech-community/api';
import {
  avatarColorFor,
  AvatarComponent,
  BadgeComponent,
  ButtonComponent,
  ClusterComponent,
  DialogService,
  EmptyStateComponent,
  IconComponent,
  LinkComponent,
  ListSkeletonComponent,
  PageHeaderComponent,
  TableColumn,
  TableComponent,
  TextFieldComponent,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

import {
  RoleMode,
  addableRoles,
  holdsLockedRole,
  managesRoles,
  openRoleDialog,
  removableRoles,
  roleLabel,
} from '../../role-actions';

type State = 'loading' | 'loaded' | 'error' | 'forbidden';

/** A member row with the actions the caller may take on it (L2-009). */
interface PersonRow extends PersonSummary {
  canAdd: boolean;
  canRemove: boolean;
  /** Holds a role only a System Admin may change. */
  locked: boolean;
}

/**
 * The people directory for City Leads, Staff and System Admins (L2-053), matching
 * docs/mocks/pages/people. Role changes go through the shared role dialog (ADR 0005).
 */
@Component({
  selector: 'ft-people-page',
  imports: [
    ReactiveFormsModule,
    AvatarComponent,
    BadgeComponent,
    ButtonComponent,
    ClusterComponent,
    EmptyStateComponent,
    IconComponent,
    LinkComponent,
    ListSkeletonComponent,
    PageHeaderComponent,
    TableComponent,
    TextFieldComponent,
  ],
  templateUrl: './people.page.html',
  styleUrl: './people.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeoplePage {
  private readonly people = inject(PEOPLE_SERVICE);
  private readonly rolesService = inject(ROLES_SERVICE);
  private readonly dialogs = inject(DialogService);
  private readonly access = inject(ACCESS_SERVICE);
  private readonly org = this.access.homeOrg;

  private readonly memberCell = viewChild.required<TemplateRef<unknown>>('memberCell');
  private readonly rolesCell = viewChild.required<TemplateRef<unknown>>('rolesCell');
  private readonly actionCell = viewChild.required<TemplateRef<unknown>>('actionCell');

  protected readonly columns = computed<TableColumn[]>(() => [
    { key: 'name', header: 'Member', template: this.memberCell() },
    { key: 'roles', header: 'Roles', template: this.rolesCell() },
    { key: 'homeCity', header: 'City' },
    { key: 'actions', header: 'Actions', hideHeader: true, template: this.actionCell() },
  ]);

  protected readonly query = new FormControl('', { nonNullable: true });
  protected readonly term = signal('');
  protected readonly state = signal<State>('loading');
  protected readonly list = signal<PersonSummary[]>([]);
  protected readonly total = signal(0);
  protected readonly loadingMore = signal(false);
  private readonly page = signal(1);
  private request = 0;

  /** People with roles they may grant in the org manage roles; the rest read (L2-053 AC2, L2-136). */
  protected readonly canManage = computed(() => managesRoles(this.access, this.org()));
  protected readonly subtitle = computed(() => {
    if (this.access.isSystemAdmin()) {
      return 'As System Admin you can assign any role, including Portfolio Lead and System Admin.';
    }
    const names = (this.org()?.grantableRoles ?? []).map((r) => r.name);
    if (names.length) return `You can add or remove the ${listOf(names)} roles.`;
    return 'Read-only for Staff.';
  });

  protected readonly rows = computed(() => {
    const org = this.org();
    const manage = this.canManage();
    return this.list().map<PersonRow>((p) => ({
      ...p,
      canAdd: addableRoles(this.access, org, p).length > 0,
      canRemove: removableRoles(this.access, org, p).length > 0,
      locked: manage && holdsLockedRole(this.access, org, p),
    })) as unknown as Record<string, unknown>[];
  });
  protected readonly hasMore = computed(() => this.list().length < this.total());

  constructor() {
    void this.load();
  }

  protected avatarColor(person: PersonSummary) {
    return avatarColorFor(person.id);
  }

  protected roleLabel(role: RoleRef): string {
    return roleLabel(role, this.org());
  }

  protected search(): void {
    this.term.set(this.query.value.trim());
    void this.load();
  }

  protected retry(): void {
    void this.load();
  }

  protected changeRoles(person: PersonSummary, mode: RoleMode): void {
    openRoleDialog(
      this.dialogs,
      this.rolesService,
      this.access,
      this.org(),
      person,
      mode,
      (roles) =>
        this.list.update((list) => list.map((p) => (p.id === person.id ? { ...p, roles } : p))),
    );
  }

  protected async loadMore(): Promise<void> {
    if (this.loadingMore()) return;
    this.loadingMore.set(true);
    try {
      const next = this.page() + 1;
      const result = await firstValueFrom(this.people.search(this.term(), next));
      this.list.update((list) => [...list, ...result.items]);
      this.total.set(result.totalCount);
      this.page.set(next);
    } catch {
      this.state.set('error');
    } finally {
      this.loadingMore.set(false);
    }
  }

  private async load(): Promise<void> {
    // Only the latest search may update the page, so a slow answer never overwrites a newer one.
    const request = ++this.request;
    this.state.set('loading');
    try {
      const result = await firstValueFrom(this.people.search(this.term(), 1));
      if (request !== this.request) return;
      this.list.set(result.items);
      this.total.set(result.totalCount);
      this.page.set(1);
      this.state.set('loaded');
    } catch (error) {
      if (request !== this.request) return;
      const forbidden = error instanceof HttpErrorResponse && error.status === 403;
      this.state.set(forbidden ? 'forbidden' : 'error');
    }
  }
}

/** "A, B and C". */
function listOf(names: string[]): string {
  return names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`;
}
