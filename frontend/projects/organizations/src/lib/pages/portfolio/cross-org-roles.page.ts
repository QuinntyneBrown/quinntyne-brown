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
import {
  CrossOrgAssignmentDto,
  CrossOrgRoleDto,
  OrgTypeSummaryDto,
  PORTFOLIO_SERVICE,
} from '@faithtech-community/api';
import {
  ButtonComponent,
  DialogService,
  EmptyStateComponent,
  TableColumn,
  TableComponent,
  ToastService,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

import { AssignCrossOrgData, AssignCrossOrgDialog } from '../../dialogs/assign-cross-org';
import { PortfolioHeaderComponent } from '../../portfolio/portfolio-header.component';
import { portfolioContext } from '../../portfolio/portfolio-context';

type State = 'loading' | 'loaded' | 'error';

/**
 * Portfolio › Cross-org roles (docs/mocks/pages/cross-org-roles, L2-138): each role's scope,
 * permissions and holders, and assigning it to someone.
 */
@Component({
  selector: 'ft-cross-org-roles-page',
  imports: [ButtonComponent, EmptyStateComponent, PortfolioHeaderComponent, TableComponent],
  templateUrl: './cross-org-roles.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrossOrgRolesPage {
  private readonly portfolio = inject(PORTFOLIO_SERVICE);
  private readonly dialogs = inject(DialogService);
  private readonly toasts = inject(ToastService);
  private readonly actionCell = viewChild.required<TemplateRef<unknown>>('actionCell');

  protected readonly context = portfolioContext();
  protected readonly state = signal<State>('loading');
  private readonly roles = signal<CrossOrgRoleDto[]>([]);
  private readonly types = signal<OrgTypeSummaryDto[]>([]);
  protected readonly columns = computed<TableColumn[]>(() => [
    { key: 'name', header: 'Role', rowHeader: true },
    { key: 'scope', header: 'Covers' },
    { key: 'access', header: 'Access' },
    { key: 'holders', header: 'Holders' },
    { key: 'actions', header: 'Actions', hideHeader: true, template: this.actionCell() },
  ]);
  protected readonly rows = computed(
    () =>
      this.roles().map((r) => ({
        ...r,
        scope: this.scope(r),
        access: `${r.permissions.length} permissions${r.canJoinWork ? ' · joins work' : ''}`,
        holders: `${r.holderCount} ${r.holderCount === 1 ? 'person' : 'people'}`,
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
      const [roles, types] = await Promise.all([
        firstValueFrom(this.portfolio.crossOrgRoles(id)),
        firstValueFrom(this.portfolio.orgTypes(id)),
      ]);
      this.roles.set(roles);
      this.types.set(types);
      this.state.set('loaded');
    } catch {
      this.state.set('error');
    }
  }

  protected async assign(role: CrossOrgRoleDto): Promise<void> {
    const ref = this.dialogs.open<CrossOrgAssignmentDto, AssignCrossOrgData>(AssignCrossOrgDialog, {
      data: { role, scope: this.scope(role) },
    });
    const assignment = await firstValueFrom(ref.closed);
    if (!assignment) return;
    await this.load();
    this.toasts.show({
      variant: 'success',
      heading: `${assignment.name} now holds ${role.name}`,
      text: 'They cover its orgs on their next visit.',
    });
  }

  private scope(role: CrossOrgRoleDto): string {
    if (role.scopeKind === 'Portfolio') return 'Every org of the portfolio';
    if (role.scopeKind === 'OrgType') {
      const type = this.types().find((t) => t.id === role.scopeOrgTypeId);
      return `Every ${type?.name ?? 'Org Type'} org`;
    }
    return `${role.scopeOrgIds.length} chosen orgs`;
  }
}
