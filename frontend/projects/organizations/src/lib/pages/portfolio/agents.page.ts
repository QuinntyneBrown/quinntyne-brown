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
  AgentDto,
  AgentTokenDto,
  IssuedTokenDto,
  PORTFOLIO_SERVICE,
} from '@faithtech-community/api';
import {
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  ClusterComponent,
  DialogService,
  EmptyStateComponent,
  IconComponent,
  StackComponent,
  TableColumn,
  TableComponent,
  ToastService,
  formatDay,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

import { ConfirmActionData, ConfirmActionDialog } from '../../dialogs/confirm-action';
import { CreateAgentDialog } from '../../dialogs/create-agent';
import { IssueTokenData, IssueTokenDialog } from '../../dialogs/issue-token';
import { PortfolioHeaderComponent } from '../../portfolio/portfolio-header.component';
import { portfolioContext } from '../../portfolio/portfolio-context';

type State = 'loading' | 'loaded' | 'error';

/**
 * Portfolio › Agents (docs/mocks/pages/agents, L2-154): each agent with its tokens' name,
 * prefix, orgs, expiry and last use; create agents, issue tokens shown once, revoke them.
 */
@Component({
  selector: 'ft-agents-page',
  imports: [
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    ClusterComponent,
    EmptyStateComponent,
    IconComponent,
    PortfolioHeaderComponent,
    StackComponent,
    TableComponent,
  ],
  templateUrl: './agents.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentsPage {
  private readonly portfolio = inject(PORTFOLIO_SERVICE);
  private readonly dialogs = inject(DialogService);
  private readonly toasts = inject(ToastService);
  private readonly nameCell = viewChild.required<TemplateRef<unknown>>('nameCell');
  private readonly agentActions = viewChild.required<TemplateRef<unknown>>('agentActions');
  private readonly tokenActions = viewChild.required<TemplateRef<unknown>>('tokenActions');

  protected readonly context = portfolioContext();
  protected readonly state = signal<State>('loading');
  protected readonly agents = signal<AgentDto[]>([]);
  protected readonly tokens = signal<Record<string, AgentTokenDto[]>>({});
  protected readonly agentColumns = computed<TableColumn[]>(() => [
    { key: 'name', header: 'Agent', rowHeader: true, template: this.nameCell() },
    { key: 'orgList', header: 'Member of' },
    { key: 'tokenCount', header: 'Active tokens' },
    { key: 'actions', header: 'Actions', hideHeader: true, template: this.agentActions() },
  ]);
  protected readonly tokenColumns = computed<TableColumn[]>(() => [
    { key: 'name', header: 'Token', rowHeader: true },
    { key: 'prefix', header: 'Prefix', mono: true },
    { key: 'orgList', header: 'Organizations' },
    { key: 'expires', header: 'Expires' },
    { key: 'lastUsed', header: 'Last used' },
    { key: 'status', header: 'Status' },
    { key: 'actions', header: 'Actions', hideHeader: true, template: this.tokenActions() },
  ]);
  protected readonly agentRows = computed(
    () =>
      this.agents().map((a) => ({
        ...a,
        orgList: a.orgs.map((o) => o.name).join(', ') || 'No org yet',
      })) as unknown as Record<string, unknown>[],
  );

  constructor() {
    effect(() => {
      if (this.context.allowed()) void this.load();
    });
  }

  protected tokenRows(agentId: string): Record<string, unknown>[] {
    return (this.tokens()[agentId] ?? []).map((t) => ({
      ...t,
      agentId,
      prefix: `ftca_${t.prefix}…`,
      orgList: t.orgs.map((o) => o.name).join(', '),
      expires: formatDay(t.expiresAt),
      lastUsed: t.lastUsedAt ? formatDay(t.lastUsedAt) : 'Never',
      status: t.revokedAt ? 'Revoked' : new Date(t.expiresAt) < new Date() ? 'Expired' : 'Active',
    })) as unknown as Record<string, unknown>[];
  }

  protected async load(): Promise<void> {
    const id = this.context.portfolio()?.id;
    if (!id) return;
    this.state.set(this.agents().length ? 'loaded' : 'loading');
    try {
      const agents = await firstValueFrom(this.portfolio.agents(id));
      const lists = await Promise.all(
        agents.map((a) => firstValueFrom(this.portfolio.tokens(a.profileId))),
      );
      this.agents.set(agents);
      this.tokens.set(Object.fromEntries(agents.map((a, i) => [a.profileId, lists[i]])));
      this.state.set('loaded');
    } catch {
      this.state.set('error');
    }
  }

  protected async create(): Promise<void> {
    const id = this.context.portfolio()?.id;
    if (!id) return;
    const ref = this.dialogs.open<AgentDto, string>(CreateAgentDialog, { data: id });
    const agent = await firstValueFrom(ref.closed);
    if (!agent) return;
    await this.load();
    this.toasts.show({
      variant: 'success',
      heading: `${agent.name} created`,
      text: 'Give it roles, then issue it a token.',
    });
  }

  protected async issue(agent: AgentDto): Promise<void> {
    const orgs = this.context.access.orgs();
    const ref = this.dialogs.open<IssuedTokenDto, IssueTokenData>(IssueTokenDialog, {
      data: { agent, orgs },
    });
    if (await firstValueFrom(ref.closed)) await this.load();
  }

  protected async revoke(token: AgentTokenDto & { agentId: string }): Promise<void> {
    const ref = this.dialogs.open<boolean, ConfirmActionData>(ConfirmActionDialog, {
      data: {
        heading: `Revoke ${token.name}?`,
        text: 'The token stops working at once. The agent keeps its roles; issue a new token when it needs one.',
        confirmLabel: 'Revoke token',
        refusedHeading: 'Token not revoked',
        action: () => firstValueFrom(this.portfolio.revokeToken(token.agentId, token.id)),
      },
    });
    if (!(await firstValueFrom(ref.closed))) return;
    await this.load();
    this.toasts.show({ variant: 'success', heading: `${token.name} revoked` });
  }
}
