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
import { Router } from '@angular/router';
import {
  FEATURE_LABELS,
  Feature,
  OrgTypeDto,
  OrgTypeSummaryDto,
  PORTFOLIO_SERVICE,
} from '@faithtech-community/api';
import {
  ButtonComponent,
  DialogService,
  EmptyStateComponent,
  IconComponent,
  LinkComponent,
  TableColumn,
  TableComponent,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

import { CreateOrgTypeDialog } from '../../dialogs/org-type';
import { PortfolioHeaderComponent } from '../../portfolio/portfolio-header.component';
import { portfolioContext } from '../../portfolio/portfolio-context';

type State = 'loading' | 'loaded' | 'error';

/** Portfolio › Org Types (docs/mocks/pages/org-types, L2-134 AC1): each type's roles, features and orgs. */
@Component({
  selector: 'ft-org-types-page',
  imports: [
    ButtonComponent,
    EmptyStateComponent,
    IconComponent,
    LinkComponent,
    PortfolioHeaderComponent,
    TableComponent,
  ],
  templateUrl: './org-types.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgTypesPage {
  private readonly portfolio = inject(PORTFOLIO_SERVICE);
  private readonly dialogs = inject(DialogService);
  private readonly router = inject(Router);
  private readonly nameCell = viewChild.required<TemplateRef<unknown>>('nameCell');

  protected readonly context = portfolioContext();
  protected readonly state = signal<State>('loading');
  private readonly list = signal<OrgTypeSummaryDto[]>([]);
  protected readonly columns = computed<TableColumn[]>(() => [
    { key: 'name', header: 'Org Type', rowHeader: true, template: this.nameCell() },
    { key: 'roles', header: 'Roles' },
    { key: 'features', header: 'Features' },
    { key: 'orgs', header: 'Organizations' },
  ]);
  protected readonly rows = computed(
    () =>
      this.list().map((t) => ({
        ...t,
        roles: `${t.roleCount} ${t.roleCount === 1 ? 'role' : 'roles'}`,
        features:
          t.enabledFeatures.length === 9
            ? 'All 11'
            : `${t.enabledFeatures.length + 2}: ${['profiles', 'notes', ...t.enabledFeatures]
                .map((f) => FEATURE_LABELS[f as Feature]?.name ?? f)
                .join(', ')}`,
        orgs: String(t.orgCount),
      })) as unknown as Record<string, unknown>[],
  );

  constructor() {
    effect(() => {
      if (this.context.allowed()) void this.load();
    });
  }

  protected async load(): Promise<void> {
    const id = this.context.portfolio()?.id;
    if (!id) return;
    this.state.set('loading');
    try {
      this.list.set(await firstValueFrom(this.portfolio.orgTypes(id)));
      this.state.set('loaded');
    } catch {
      this.state.set('error');
    }
  }

  protected async create(): Promise<void> {
    const id = this.context.portfolio()?.id;
    if (!id) return;
    const ref = this.dialogs.open<OrgTypeDto, string>(CreateOrgTypeDialog, { data: id });
    const created = await firstValueFrom(ref.closed);
    if (created) await this.router.navigateByUrl(`${this.context.base()}/org-types/${created.id}`);
  }
}
