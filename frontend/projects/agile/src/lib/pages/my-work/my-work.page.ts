import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { AGILE_SERVICE, MyWorkItemDto } from '@faithtech-community/api';
import {
  ButtonComponent,
  CardComponent,
  EmptyStateComponent,
  LinkComponent,
  ListSkeletonComponent,
  OrgLabelComponent,
  PageHeaderComponent,
  TableColumn,
  TableComponent,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

import { STATUS_LABELS } from '../../work-item-labels';

type State = 'loading' | 'loaded' | 'error';

/**
 * My work (docs/mocks/pages/my-work, L2-145 AC3): the items assigned to the caller in every
 * workspace they can open, in the org they are in or, under "All orgs", in every covered org.
 */
@Component({
  selector: 'ft-my-work-page',
  imports: [
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    LinkComponent,
    ListSkeletonComponent,
    OrgLabelComponent,
    PageHeaderComponent,
    TableComponent,
  ],
  templateUrl: './my-work.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyWorkPage {
  private readonly agile = inject(AGILE_SERVICE);
  private readonly itemCell = viewChild.required<TemplateRef<unknown>>('itemCell');
  private readonly orgCell = viewChild.required<TemplateRef<unknown>>('orgCell');

  protected readonly state = signal<State>('loading');
  private readonly items = signal<MyWorkItemDto[]>([]);
  protected readonly columns = computed<TableColumn[]>(() => [
    { key: 'title', header: 'Item', template: this.itemCell() },
    { key: 'workspaceName', header: 'Workspace' },
    { key: 'org', header: 'Org', template: this.orgCell() },
    { key: 'statusLabel', header: 'Status' },
  ]);
  protected readonly rows = computed(
    () =>
      this.items().map((i) => ({
        ...i,
        statusLabel: STATUS_LABELS[i.status],
        href: i.organization
          ? `/o/${i.organization.slug}/workspaces/${i.workspaceId}/items/${i.id}`
          : `/workspaces/${i.workspaceId}/items/${i.id}`,
      })) as unknown as Record<string, unknown>[],
  );
  protected readonly empty = computed(() => this.items().length === 0);

  constructor() {
    void this.load();
  }

  protected retry(): void {
    void this.load();
  }

  private async load(): Promise<void> {
    this.state.set('loading');
    try {
      this.items.set(await firstValueFrom(this.agile.myWork()));
      this.state.set('loaded');
    } catch {
      this.state.set('error');
    }
  }
}
