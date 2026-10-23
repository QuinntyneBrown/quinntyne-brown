import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  AGILE_SERVICE,
  ACCESS_SERVICE,
  Permission,
  WorkspaceDto,
  WorkspaceSummaryDto,
} from '@faithtech-community/api';
import {
  AlertComponent,
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  DialogService,
  EmptyStateComponent,
  IconComponent,
  ListComponent,
  ListItemComponent,
  ListSkeletonComponent,
  PageHeaderComponent,
  IconTileComponent,
  ToastService,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

import { CreateWorkspaceDialog } from '../../dialogs';

type State = 'loading' | 'loaded' | 'error';

/**
 * The workspaces a member may see (L2-050), and archived ones for their owner and System Admin to restore
 * (L2-037 AC1), matching docs/mocks/pages/workspaces.
 */
@Component({
  selector: 'ft-workspaces-page',
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    IconComponent,
    ListComponent,
    ListItemComponent,
    ListSkeletonComponent,
    PageHeaderComponent,
    IconTileComponent,
  ],
  templateUrl: './workspaces.page.html',
  styleUrl: './workspaces.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspacesPage {
  private readonly agile = inject(AGILE_SERVICE);
  private readonly access = inject(ACCESS_SERVICE);
  private readonly dialogs = inject(DialogService);
  private readonly toasts = inject(ToastService);

  protected readonly state = signal<State>('loading');
  private readonly all = signal<WorkspaceSummaryDto[]>([]);
  protected readonly list = computed(() => this.all().filter((w) => !w.isArchived));
  /** Listed only to their owner and System Admin, who may restore them (L2-037 AC1). */
  protected readonly archived = computed(() => this.all().filter((w) => w.isArchived));

  /** Holders of workspaces.create make workspaces in the org (L2-031 AC1, ADR 0033). */
  protected readonly canCreate = computed(() => this.access.can(Permission.WorkspacesCreate));
  /** Reading every workspace without making them is the read-only oversight (Staff, ADR 0035). */
  protected readonly isStaff = computed(
    () =>
      this.access.can(Permission.WorkspacesReadAll) &&
      !this.access.can(Permission.WorkspacesCreate),
  );
  protected readonly subtitle = computed(() => {
    if (this.isStaff()) return 'Every workspace, read-only';
    if (this.access.isSystemAdmin()) return 'Every workspace';
    return this.canCreate() ? 'Workspaces you own or belong to' : 'Workspaces you’ve been added to';
  });

  constructor() {
    void this.load();
  }

  /** "Owner: Grace Okonkwo · Scrum · Sprint 7 active · 5 members", as the mock words it. */
  protected meta(workspace: WorkspaceSummaryDto): string {
    const parts = [`Owner: ${workspace.ownerName}`, workspace.method];
    if (workspace.method === 'Scrum') {
      parts.push(
        workspace.activeSprintName ? `${workspace.activeSprintName} active` : 'no active sprint',
      );
    }
    parts.push(`${workspace.memberCount} ${workspace.memberCount === 1 ? 'member' : 'members'}`);
    return parts.join(' · ');
  }

  protected archivedMeta(workspace: WorkspaceSummaryDto): string {
    return `${this.meta(workspace)} · Members can’t open it until you restore it`;
  }

  protected retry(): void {
    void this.load();
  }

  protected async create(): Promise<void> {
    const ref = this.dialogs.open<WorkspaceDto>(CreateWorkspaceDialog, {});
    const created = await firstValueFrom(ref.closed);
    if (!created) return;
    this.toasts.show({ variant: 'success', heading: `${created.name} created` });
    await this.load();
  }

  protected async restore(workspace: WorkspaceSummaryDto): Promise<void> {
    try {
      await firstValueFrom(this.agile.restoreWorkspace(workspace.id));
      this.toasts.show({ variant: 'success', heading: `${workspace.name} restored` });
      this.all.set(await firstValueFrom(this.agile.listWorkspaces()));
    } catch {
      this.toasts.show({
        variant: 'danger',
        heading: 'That didn’t work',
        text: `We couldn’t restore ${workspace.name}. Try again.`,
      });
    }
  }

  private async load(): Promise<void> {
    this.state.set('loading');
    try {
      this.all.set(await firstValueFrom(this.agile.listWorkspaces()));
      this.state.set('loaded');
    } catch {
      this.state.set('error');
    }
  }
}
