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
import {
  ACCESS_SERVICE,
  INTEGRATIONS_SERVICE,
  IntegrationApp,
  RegisteredApp,
} from '@faithtech-community/api';
import {
  BadgeComponent,
  ButtonComponent,
  DialogService,
  EmptyStateComponent,
  IconComponent,
  LinkComponent,
  ListSkeletonComponent,
  PageHeaderComponent,
  StackComponent,
  TableColumn,
  TableComponent,
  formatTimestamp,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

import { RegisterApplicationDialog } from '../../dialogs';

type State = 'loading' | 'loaded' | 'error' | 'forbidden';

/** `src_6f1c…9e8d`: the source ID's start and end, enough to tell applications apart. */
export function shortSourceId(sourceId: string): string {
  return `${sourceId.slice(0, 8)}…${sourceId.slice(-4)}`;
}

/**
 * Applications (docs/mocks/pages/applications, L2-158, L2-165): the active org's applications,
 * active and revoked, with their last event; managers register new ones.
 */
@Component({
  selector: 'ft-applications-page',
  imports: [
    BadgeComponent,
    ButtonComponent,
    EmptyStateComponent,
    IconComponent,
    LinkComponent,
    ListSkeletonComponent,
    PageHeaderComponent,
    StackComponent,
    TableComponent,
  ],
  templateUrl: './applications.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationsPage {
  private readonly integrations = inject(INTEGRATIONS_SERVICE);
  private readonly access = inject(ACCESS_SERVICE);
  private readonly dialogs = inject(DialogService);
  private readonly nameCell = viewChild.required<TemplateRef<unknown>>('nameCell');
  private readonly statusCell = viewChild.required<TemplateRef<unknown>>('statusCell');
  private readonly actionsCell = viewChild.required<TemplateRef<unknown>>('actionsCell');

  protected readonly state = signal<State>('loading');
  protected readonly apps = signal<IntegrationApp[]>([]);
  protected readonly org = computed(() => this.access.activeOrg());
  protected readonly canManage = computed(() => this.access.can('integrations.manage'));
  protected readonly subtitle = computed(
    () =>
      `${this.org()?.branding.displayName ?? 'Your org'} · Sites and services that send events here. Each one signs what it sends with its own secret.`,
  );
  protected readonly columns = computed<TableColumn[]>(() => [
    { key: 'name', header: 'Application', rowHeader: true, template: this.nameCell() },
    { key: 'source', header: 'Source ID', mono: true },
    { key: 'status', header: 'Status', template: this.statusCell() },
    { key: 'lastEvent', header: 'Last event' },
    { key: 'eventCount', header: 'Events' },
    { key: 'actions', header: 'Actions', hideHeader: true, template: this.actionsCell() },
  ]);
  protected readonly rows = computed(
    () =>
      this.apps().map((a) => ({
        ...a,
        source: shortSourceId(a.sourceId),
        lastEvent: a.lastEventAt ? formatTimestamp(a.lastEventAt) : 'None yet',
      })) as unknown as Record<string, unknown>[],
  );

  constructor() {
    void this.load();
  }

  protected link(app: IntegrationApp): string {
    return `/o/${app.organization.slug}/applications/${app.id}`;
  }

  protected async load(): Promise<void> {
    this.state.set('loading');
    try {
      this.apps.set(await firstValueFrom(this.integrations.list()));
      this.state.set('loaded');
    } catch (error) {
      this.state.set(
        error instanceof HttpErrorResponse && error.status === 403 ? 'forbidden' : 'error',
      );
    }
  }

  protected async register(): Promise<void> {
    const ref = this.dialogs.open<RegisteredApp, void>(RegisterApplicationDialog);
    if (await firstValueFrom(ref.closed)) await this.load();
  }
}
