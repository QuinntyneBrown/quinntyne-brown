import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ACCESS_SERVICE, OrganizationDto, PORTFOLIO_SERVICE } from '@faithtech-community/api';
import {
  ButtonComponent,
  CardComponent,
  DescriptionListComponent,
  DescriptionListItemComponent,
  DialogService,
  EmptyStateComponent,
  ListSkeletonComponent,
  PageHeaderComponent,
  TabComponent,
  TabsComponent,
  ToastService,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

import { EditOrganizationDialog } from '../../dialogs/edit-organization';

type State = 'loading' | 'loaded' | 'error';

/**
 * Organization settings › General (docs/mocks/pages/organization/default, L2-156 AC2, AC4): the
 * org's name, slug, old slugs and type. Only the Portfolio Lead and System Admins edit them; an
 * Org Lead sees them read-only.
 */
@Component({
  selector: 'ft-org-general-page',
  imports: [
    ButtonComponent,
    CardComponent,
    DescriptionListComponent,
    DescriptionListItemComponent,
    EmptyStateComponent,
    ListSkeletonComponent,
    PageHeaderComponent,
    TabComponent,
    TabsComponent,
  ],
  templateUrl: './general.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgGeneralPage {
  private readonly access = inject(ACCESS_SERVICE);
  private readonly portfolio = inject(PORTFOLIO_SERVICE);
  private readonly dialogs = inject(DialogService);
  private readonly toasts = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly active = this.access.activeOrg;
  protected readonly leads = computed(() => {
    const org = this.active();
    return !!org && (org.isOrgLead || org.isPortfolioLead || this.access.isSystemAdmin());
  });
  protected readonly edits = computed(
    () => this.access.isSystemAdmin() || !!this.active()?.isPortfolioLead,
  );
  protected readonly state = signal<State>('loading');
  protected readonly org = signal<OrganizationDto | null>(null);
  protected readonly base = computed(() => `/o/${this.active()?.slug ?? ''}/settings`);

  constructor() {
    effect(() => {
      if (this.leads()) void this.load();
    });
  }

  protected async load(): Promise<void> {
    const id = this.active()?.id;
    if (!id) return;
    this.state.set('loading');
    try {
      this.org.set(await firstValueFrom(this.portfolio.organization(id)));
      this.state.set('loaded');
    } catch {
      this.state.set('error');
    }
  }

  protected async edit(org: OrganizationDto): Promise<void> {
    const ref = this.dialogs.open<OrganizationDto, OrganizationDto>(EditOrganizationDialog, {
      data: org,
    });
    const saved = await firstValueFrom(ref.closed);
    if (!saved) return;
    await this.access.refresh();
    this.toasts.show({ variant: 'success', heading: `${saved.displayName} saved` });
    if (saved.slug !== org.slug) {
      await this.router.navigateByUrl(`/o/${saved.slug}/settings/general`);
    } else {
      this.org.set(saved);
    }
  }
}
