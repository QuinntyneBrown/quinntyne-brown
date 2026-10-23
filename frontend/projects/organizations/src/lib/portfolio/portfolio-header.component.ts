import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  ButtonComponent,
  EmptyStateComponent,
  PageHeaderComponent,
  TabComponent,
  TabsComponent,
} from '@faithtech-community/components';

import { PortfolioSection, portfolioContext } from './portfolio-context';

const SECTIONS: { section: PortfolioSection; label: string }[] = [
  { section: 'organizations', label: 'Organizations' },
  { section: 'org-types', label: 'Org Types' },
  { section: 'cross-org-roles', label: 'Cross-org roles' },
  { section: 'agents', label: 'Agents' },
];

/**
 * The Portfolio screens' header and tabs (docs/mocks/pages/organizations), or the refusal for
 * anyone who is not the Portfolio Lead or a System Admin. Actions go in `[portfolioActions]`.
 */
@Component({
  selector: 'ft-portfolio-header',
  imports: [ButtonComponent, EmptyStateComponent, PageHeaderComponent, TabComponent, TabsComponent],
  templateUrl: './portfolio-header.component.html',
  styleUrl: './portfolio-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioHeaderComponent {
  readonly current = input.required<PortfolioSection>();
  /** The page's own title, such as an Org Type's name; "Portfolio" by default. */
  readonly heading = input<string | null>(null);
  readonly description = input<string | null>(null);

  protected readonly context = portfolioContext();
  protected readonly sections = SECTIONS;
  protected readonly title = computed(() => this.heading() ?? 'Portfolio');
  protected readonly overline = computed(() => (this.heading() ? 'Portfolio' : null));
  protected readonly subtitle = computed(
    () =>
      this.description() ??
      `${this.context.portfolio()?.name ?? ''} · Org Types, organizations, cross-org roles and agents. Every change is recorded in the audit log.`,
  );
}
