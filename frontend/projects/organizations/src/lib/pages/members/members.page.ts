import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ACCESS_SERVICE, ORGANIZATIONS_SERVICE, OrgMemberDto } from '@faithtech-community/api';
import {
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
  TabComponent,
  TabsComponent,
  TextFieldComponent,
  ToastService,
  avatarColorFor,
  formatDay,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

import { AddMemberDialog } from '../../dialogs/add-member/add-member.dialog';
import {
  RemoveMemberDialog,
  RemoveMemberData,
} from '../../dialogs/remove-member/remove-member.dialog';

type State = 'loading' | 'loaded' | 'forbidden' | 'error';

const JOINED_VIA: Record<OrgMemberDto['joinedVia'], string> = {
  Seed: 'Founding member',
  Invite: 'Invite',
  ConnectLink: 'Connect link',
  Added: 'Added',
};

/**
 * Organization settings › Members (docs/mocks/pages/organization/members, L2-143): the org's
 * members with their roles, searchable, and adding and removing them for its Org Lead and the
 * Portfolio Lead.
 */
@Component({
  selector: 'ft-members-page',
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
    TabComponent,
    TabsComponent,
    TextFieldComponent,
  ],
  templateUrl: './members.page.html',
  styleUrl: './members.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersPage {
  private readonly access = inject(ACCESS_SERVICE);
  private readonly organizations = inject(ORGANIZATIONS_SERVICE);
  private readonly dialogs = inject(DialogService);
  private readonly toasts = inject(ToastService);
  private readonly memberCell = viewChild.required<TemplateRef<unknown>>('memberCell');
  private readonly rolesCell = viewChild.required<TemplateRef<unknown>>('rolesCell');
  private readonly actionCell = viewChild.required<TemplateRef<unknown>>('actionCell');

  protected readonly org = this.access.activeOrg;
  protected readonly subtitle = computed(() => {
    const org = this.org();
    return org ? `${org.branding.displayName} · ${org.typeName} · /o/${org.slug}` : '';
  });
  protected readonly query = new FormControl('', { nonNullable: true });
  private readonly term = signal('');
  protected readonly state = signal<State>('loading');
  private readonly list = signal<OrgMemberDto[]>([]);
  protected readonly columns = computed<TableColumn[]>(() => [
    { key: 'name', header: 'Member', template: this.memberCell() },
    { key: 'roles', header: 'Roles', template: this.rolesCell() },
    { key: 'joined', header: 'Joined' },
    { key: 'actions', header: 'Actions', hideHeader: true, template: this.actionCell() },
  ]);
  protected readonly rows = computed(
    () =>
      this.list().map((m) => ({
        ...m,
        joined: `${JOINED_VIA[m.joinedVia]}, ${formatDay(m.joinedAt)}`,
        roleNames: m.roles.filter((r) => r.key !== 'org-lead').map((r) => r.name),
      })) as unknown as Record<string, unknown>[],
  );
  protected readonly caption = computed(
    () => `Members of ${this.org()?.branding.displayName ?? 'this organization'}`,
  );

  constructor() {
    effect(() => void this.load(this.term()));
  }

  protected avatarColor(member: OrgMemberDto) {
    return avatarColorFor(member.profileId);
  }

  protected search(): void {
    this.term.set(this.query.value.trim());
  }

  protected async add(): Promise<void> {
    const org = this.org();
    if (!org) return;
    const ref = this.dialogs.open<OrgMemberDto>(AddMemberDialog, { data: org });
    const added = await firstValueFrom(ref.closed);
    if (!added) return;
    this.list.update((list) => [...list, added].sort((a, b) => a.name.localeCompare(b.name)));
    this.toasts.show({
      variant: 'success',
      heading: `${added.name} is now a member of ${org.branding.displayName}`,
    });
  }

  protected async remove(member: OrgMemberDto): Promise<void> {
    const org = this.org();
    if (!org) return;
    const ref = this.dialogs.open<boolean, RemoveMemberData>(RemoveMemberDialog, {
      data: { org, member },
    });
    if (!(await firstValueFrom(ref.closed))) return;
    this.list.update((list) => list.filter((m) => m.profileId !== member.profileId));
    this.toasts.show({
      variant: 'success',
      heading: `${member.name} was removed from ${org.branding.displayName}`,
    });
  }

  private async load(term: string): Promise<void> {
    const org = this.org();
    if (!org) {
      this.state.set('forbidden');
      return;
    }
    this.state.set('loading');
    try {
      this.list.set(await firstValueFrom(this.organizations.members(org.id, term)));
      this.state.set('loaded');
    } catch (error) {
      const refused = error instanceof HttpErrorResponse && error.status === 403;
      this.state.set(refused ? 'forbidden' : 'error');
    }
  }
}
