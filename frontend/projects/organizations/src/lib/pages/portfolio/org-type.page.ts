import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ALWAYS_ON_FEATURES,
  FEATURE_LABELS,
  Feature,
  OrgTypeDto,
  PORTFOLIO_SERVICE,
  RoleDefinitionDto,
} from '@faithtech-community/api';
import {
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  ClusterComponent,
  DialogService,
  EmptyStateComponent,
  IconComponent,
  ListComponent,
  ListItemComponent,
  ListSkeletonComponent,
  StackComponent,
  SwitchComponent,
  TabComponent,
  TabsComponent,
  ToastService,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

import { ConfirmActionData, ConfirmActionDialog } from '../../dialogs/confirm-action';
import { RoleDefinitionData, RoleDefinitionDialog } from '../../dialogs/role-definition';
import { PortfolioHeaderComponent } from '../../portfolio/portfolio-header.component';
import { portfolioContext } from '../../portfolio/portfolio-context';

type State = 'loading' | 'loaded' | 'error';

const SWITCHABLE: Feature[] = [
  'contacts',
  'partners',
  'team',
  'events',
  'announcements',
  'invites',
  'resources',
  'agile',
  'reports',
];

/**
 * Portfolio › Org Types › {type} (docs/mocks/pages/org-type, L2-134 AC2, L2-137, L2-147): the
 * role catalogue with add, edit, reorder and remove, and the features panel.
 */
@Component({
  selector: 'ft-org-type-page',
  imports: [
    ReactiveFormsModule,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    ClusterComponent,
    EmptyStateComponent,
    IconComponent,
    ListComponent,
    ListItemComponent,
    ListSkeletonComponent,
    PortfolioHeaderComponent,
    StackComponent,
    SwitchComponent,
    TabComponent,
    TabsComponent,
  ],
  templateUrl: './org-type.page.html',
  styleUrl: './org-type.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgTypePage {
  private readonly portfolio = inject(PORTFOLIO_SERVICE);
  private readonly dialogs = inject(DialogService);
  private readonly toasts = inject(ToastService);

  /** Route parameters. */
  readonly id = input.required<string>();
  readonly section = input<string | undefined>(undefined);

  protected readonly context = portfolioContext();
  protected readonly labels = FEATURE_LABELS;
  protected readonly alwaysOn = ALWAYS_ON_FEATURES;
  protected readonly switchable = SWITCHABLE;
  protected readonly on = new FormControl({ value: true, disabled: true }, { nonNullable: true });
  protected readonly features = new FormGroup(
    Object.fromEntries(SWITCHABLE.map((f) => [f, new FormControl(false, { nonNullable: true })])),
  );
  protected readonly state = signal<State>('loading');
  protected readonly type = signal<OrgTypeDto | null>(null);
  protected readonly saving = signal(false);
  protected readonly here = computed(() => `${this.context.base()}/org-types/${this.id()}`);

  constructor() {
    effect(() => {
      this.id();
      if (this.context.allowed()) void this.load();
    });
  }

  protected async load(): Promise<void> {
    this.state.set('loading');
    try {
      this.show(await firstValueFrom(this.portfolio.orgType(this.id())));
      this.state.set('loaded');
    } catch {
      this.state.set('error');
    }
  }

  protected async saveFeatures(): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    const value = this.features.getRawValue() as Record<string, boolean>;
    try {
      this.show(
        await firstValueFrom(
          this.portfolio.setFeatures(
            this.id(),
            SWITCHABLE.filter((f) => value[f]),
          ),
        ),
      );
      await this.context.access.refresh();
      this.toasts.show({
        variant: 'success',
        heading: 'Features saved',
        text: `Every ${this.type()?.name} org shows them now.`,
      });
    } catch {
      this.toasts.show({
        variant: 'danger',
        heading: 'Features not saved',
        text: 'Check your connection and try again.',
      });
    } finally {
      this.saving.set(false);
    }
  }

  protected async addRole(type: OrgTypeDto): Promise<void> {
    const ref = this.dialogs.open<RoleDefinitionDto, RoleDefinitionData>(RoleDefinitionDialog, {
      data: { type },
    });
    const role = await firstValueFrom(ref.closed);
    if (!role) return;
    await this.load();
    this.toasts.show({ variant: 'success', heading: `${role.name} added to ${type.name}` });
  }

  protected async editRole(type: OrgTypeDto, role: RoleDefinitionDto): Promise<void> {
    const ref = this.dialogs.open<RoleDefinitionDto, RoleDefinitionData>(RoleDefinitionDialog, {
      data: { type, role },
    });
    const saved = await firstValueFrom(ref.closed);
    if (!saved) return;
    await this.load();
    this.toasts.show({ variant: 'success', heading: `${saved.name} saved` });
  }

  protected async removeRole(type: OrgTypeDto, role: RoleDefinitionDto): Promise<void> {
    const ref = this.dialogs.open<boolean, ConfirmActionData>(ConfirmActionDialog, {
      data: {
        heading: `Remove ${role.name} from ${type.name}?`,
        description: 'Only a role nobody holds can be removed.',
        text: `${role.name} is removed from the ${type.name} catalogue for every org of this type. Roles that list it under Can grant stop listing it.`,
        confirmLabel: `Remove ${role.name}`,
        refusedHeading: `${role.name} wasn’t removed`,
        action: () => firstValueFrom(this.portfolio.removeRole(type.id, role.id)),
      },
    });
    if (!(await firstValueFrom(ref.closed))) return;
    await this.load();
    this.toasts.show({ variant: 'success', heading: `${role.name} removed` });
  }

  /** Keyboard reorder: move a role up or down one place (L2-137 AC6). */
  protected async move(type: OrgTypeDto, role: RoleDefinitionDto, by: -1 | 1): Promise<void> {
    const roles = [...type.roles];
    const from = roles.indexOf(role);
    roles.splice(from, 1);
    roles.splice(from + by, 0, role);
    try {
      await firstValueFrom(
        this.portfolio.reorderRoles(
          type.id,
          roles.map((r, i) => ({ roleId: r.id, parentRoleId: r.parentRoleId, sortOrder: i })),
        ),
      );
      this.type.set({ ...type, roles: roles.map((r, i) => ({ ...r, sortOrder: i })) });
    } catch {
      this.toasts.show({
        variant: 'danger',
        heading: 'Order not saved',
        text: 'Check your connection and try again.',
      });
    }
  }

  private show(type: OrgTypeDto): void {
    this.type.set(type);
    this.features.setValue(
      Object.fromEntries(SWITCHABLE.map((f) => [f, type.enabledFeatures.includes(f)])),
    );
  }
}
