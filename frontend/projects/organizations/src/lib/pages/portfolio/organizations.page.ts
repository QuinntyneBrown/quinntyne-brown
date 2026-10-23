import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  OrgTypeSummaryDto,
  OrganizationDto,
  OrganizationSummaryDto,
  PORTFOLIO_SERVICE,
} from '@faithtech-community/api';
import {
  ButtonComponent,
  ClusterComponent,
  DialogService,
  EmptyStateComponent,
  IconComponent,
  TabComponent,
  TableColumn,
  TableComponent,
  TabsComponent,
  ToastService,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

import { ConfirmActionData, ConfirmActionDialog } from '../../dialogs/confirm-action';
import {
  CreateOrganizationData,
  CreateOrganizationDialog,
} from '../../dialogs/create-organization';
import { PortfolioHeaderComponent } from '../../portfolio/portfolio-header.component';
import { portfolioContext } from '../../portfolio/portfolio-context';

type State = 'loading' | 'loaded' | 'error';

/**
 * Portfolio › Organizations (docs/mocks/pages/organizations, L2-156 AC1 to AC3): every org with
 * its type, members and Org Leads, active or archived; create, archive and restore.
 */
@Component({
  selector: 'ft-organizations-page',
  imports: [
    ButtonComponent,
    ClusterComponent,
    EmptyStateComponent,
    IconComponent,
    PortfolioHeaderComponent,
    TabComponent,
    TableComponent,
    TabsComponent,
  ],
  templateUrl: './organizations.page.html',
  styleUrl: './organizations.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationsPage {
  private readonly portfolio = inject(PORTFOLIO_SERVICE);
  private readonly dialogs = inject(DialogService);
  private readonly toasts = inject(ToastService);
  private readonly orgCell = viewChild.required<TemplateRef<unknown>>('orgCell');
  private readonly actionCell = viewChild.required<TemplateRef<unknown>>('actionCell');

  /** Query parameter: `?archived=true` shows the archived view. */
  readonly archived = input<string | undefined>(undefined);

  protected readonly context = portfolioContext();
  protected readonly showArchived = computed(() => this.archived() === 'true');
  protected readonly state = signal<State>('loading');
  private readonly list = signal<OrganizationSummaryDto[]>([]);
  private readonly counts = signal<{ active: number; archived: number } | null>(null);
  private types: OrgTypeSummaryDto[] = [];

  protected readonly columns = computed<TableColumn[]>(() => [
    { key: 'name', header: 'Organization', rowHeader: true, template: this.orgCell() },
    { key: 'type', header: 'Type' },
    { key: 'memberCount', header: 'Members' },
    { key: 'leads', header: 'Org Leads' },
    { key: 'actions', header: 'Actions', hideHeader: true, template: this.actionCell() },
  ]);
  protected readonly rows = computed(
    () =>
      this.list().map((o) => ({
        ...o,
        type: o.orgType.name,
        leads: o.orgLeads.map((l) => l.name).join(', ') || '—',
      })) as unknown as Record<string, unknown>[],
  );

  constructor() {
    effect(() => {
      this.showArchived();
      if (this.context.allowed()) void this.load();
    });
  }

  protected count(archived: boolean): string {
    const counts = this.counts();
    if (!counts) return '';
    return ` (${archived ? counts.archived : counts.active})`;
  }

  protected async load(): Promise<void> {
    const id = this.context.portfolio()?.id;
    if (!id) return;
    this.state.set('loading');
    try {
      const [active, archived] = await Promise.all([
        firstValueFrom(this.portfolio.organizations(id, false)),
        firstValueFrom(this.portfolio.organizations(id, true)),
      ]);
      this.counts.set({ active: active.length, archived: archived.length });
      this.list.set(this.showArchived() ? archived : active);
      this.state.set('loaded');
    } catch {
      this.state.set('error');
    }
  }

  protected async create(): Promise<void> {
    const id = this.context.portfolio()?.id;
    if (!id) return;
    if (!this.types.length) {
      this.types = await firstValueFrom(this.portfolio.orgTypes(id));
    }
    const ref = this.dialogs.open<OrganizationDto, CreateOrganizationData>(
      CreateOrganizationDialog,
      { data: { portfolioId: id, types: this.types } },
    );
    const created = await firstValueFrom(ref.closed);
    if (!created) return;
    await Promise.all([this.load(), this.context.access.refresh()]);
    this.toasts.show({
      variant: 'success',
      heading: `${created.displayName} created`,
      text: 'Make someone its Org Lead from its members.',
    });
  }

  protected async archive(org: OrganizationSummaryDto): Promise<void> {
    const ref = this.dialogs.open<boolean, ConfirmActionData>(ConfirmActionDialog, {
      data: {
        heading: `Archive ${org.displayName}?`,
        text: `${org.displayName} leaves every switcher and its records answer not found to everyone but the Portfolio Lead and System Admins. You can restore it.`,
        confirmLabel: 'Archive organization',
        refusedHeading: 'Organization not archived',
        action: () => firstValueFrom(this.portfolio.archiveOrganization(org.id, true)),
      },
    });
    if (!(await firstValueFrom(ref.closed))) return;
    await Promise.all([this.load(), this.context.access.refresh()]);
    this.toasts.show({ variant: 'success', heading: `${org.displayName} was archived` });
  }

  protected async restore(org: OrganizationSummaryDto): Promise<void> {
    try {
      await firstValueFrom(this.portfolio.archiveOrganization(org.id, false));
      await Promise.all([this.load(), this.context.access.refresh()]);
      this.toasts.show({ variant: 'success', heading: `${org.displayName} was restored` });
    } catch {
      this.toasts.show({
        variant: 'danger',
        heading: `${org.displayName} wasn’t restored`,
        text: 'Check your connection and try again.',
      });
    }
  }
}
