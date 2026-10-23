import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  ACCESS_SERVICE,
  PROFILES_SERVICE,
  ProfileDto,
  ROLES_SERVICE,
} from '@faithtech-community/api';
import {
  avatarColorFor,
  ButtonComponent,
  DialogService,
  EmptyStateComponent,
  IconComponent,
  ProfileHeaderComponent,
  ProfilePhoto,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

import {
  RoleMode,
  addableRoles,
  openRoleDialog,
  removableRoles,
  roleLabel,
} from '../../role-actions';

type State = 'loading' | 'loaded' | 'not-found' | 'error';

/** A member's profile (L2-005), matching docs/mocks/pages/profile. `id` may be "me". */
@Component({
  selector: 'ft-profile-page',
  imports: [ButtonComponent, EmptyStateComponent, IconComponent, ProfileHeaderComponent],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage {
  private readonly profiles = inject(PROFILES_SERVICE);
  private readonly rolesService = inject(ROLES_SERVICE);
  private readonly dialogs = inject(DialogService);
  /** What the caller may grant in the org (L2-136, ADR 0033). */
  private readonly access = inject(ACCESS_SERVICE);
  private readonly org = this.access.homeOrg;

  /** Route parameter: a profile id, or "me". */
  readonly id = input.required<string>();

  protected readonly state = signal<State>('loading');
  protected readonly profile = signal<ProfileDto | null>(null);

  protected readonly avatarColor = computed(() => avatarColorFor(this.profile()?.id));
  protected readonly roles = computed(
    () => this.profile()?.roles.map((r) => roleLabel(r, this.org())) ?? [],
  );
  protected readonly photos = computed<ProfilePhoto[]>(
    () => this.profile()?.photos.map((p) => ({ url: p.url, alt: p.altText })) ?? [],
  );

  /** Roles that could be added: assignable and not yet held. */
  protected readonly canAdd = computed(() => {
    const profile = this.profile();
    return profile ? addableRoles(this.access, this.org(), profile) : [];
  });
  /** Held roles the caller may remove. */
  protected readonly canRemove = computed(() => {
    const profile = this.profile();
    return profile ? removableRoles(this.access, this.org(), profile) : [];
  });

  constructor() {
    effect(() => void this.load(this.id()));
  }

  protected retry(): void {
    void this.load(this.id());
  }

  protected addRole(): void {
    this.openRoleDialog('add');
  }

  protected removeRole(): void {
    this.openRoleDialog('remove');
  }

  private openRoleDialog(mode: RoleMode): void {
    const profile = this.profile();
    if (!profile) return;
    openRoleDialog(
      this.dialogs,
      this.rolesService,
      this.access,
      this.org(),
      profile,
      mode,
      (roles) => this.profile.update((p) => (p ? { ...p, roles } : p)),
    );
  }

  private async load(id: string): Promise<void> {
    this.state.set('loading');
    try {
      this.profile.set(await firstValueFrom(this.profiles.getProfile(id)));
      this.state.set('loaded');
    } catch (error) {
      const notFound = error instanceof HttpErrorResponse && error.status === 404;
      this.state.set(notFound ? 'not-found' : 'error');
    }
  }
}
