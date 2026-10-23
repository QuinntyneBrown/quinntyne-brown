import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ACCESS_SERVICE, ORGANIZATIONS_SERVICE, problemDetails } from '@faithtech-community/api';
import {
  ButtonComponent,
  CardComponent,
  ColourFieldComponent,
  EmptyStateComponent,
  FileDropzoneComponent,
  FormFieldComponent,
  InlineMessageComponent,
  OrgBandComponent,
  PageHeaderComponent,
  StackComponent,
  TabComponent,
  TabsComponent,
  TextFieldComponent,
  ToastService,
  ACCENT_MINIMUM_RATIO,
  accentForeground,
  contrastRatio,
  isHexColour,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

const LOGO_TYPES = 'image/png,image/jpeg,image/webp';

/**
 * Organization settings › Branding (docs/mocks/pages/organization/branding, L2-149): the display name, logo and
 * accent the switcher and public event pages show. The server refuses an accent without enough contrast and the
 * field shows its message and the measured ratio.
 */
@Component({
  selector: 'ft-org-branding-page',
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    CardComponent,
    ColourFieldComponent,
    EmptyStateComponent,
    FileDropzoneComponent,
    FormFieldComponent,
    InlineMessageComponent,
    OrgBandComponent,
    PageHeaderComponent,
    StackComponent,
    TabComponent,
    TabsComponent,
    TextFieldComponent,
  ],
  templateUrl: './branding.page.html',
  styleUrl: './branding.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgBrandingPage {
  private readonly access = inject(ACCESS_SERVICE);
  private readonly organizations = inject(ORGANIZATIONS_SERVICE);
  private readonly toasts = inject(ToastService);

  protected readonly org = this.access.activeOrg;
  protected readonly logoTypes = LOGO_TYPES;
  /** Org Leads of this org, its Portfolio Lead and System Admin brand it (L2-149 AC4). */
  protected readonly allowed = computed(() => {
    const org = this.org();
    return !!org && (org.isOrgLead || org.isPortfolioLead || this.access.isSystemAdmin());
  });
  protected readonly subtitle = computed(() => {
    const org = this.org();
    return org ? `${org.typeName} · /o/${org.slug}` : '';
  });

  protected readonly displayName = new FormControl(this.org()?.branding.displayName ?? '', {
    nonNullable: true,
  });
  protected readonly accent = new FormControl(this.org()?.branding.accent ?? '', {
    nonNullable: true,
  });
  protected readonly logoUrl = signal(this.org()?.branding.logoUrl ?? null);
  protected readonly saving = signal(false);
  protected readonly uploading = signal(false);
  protected readonly nameError = signal('');
  protected readonly accentError = signal('');
  protected readonly logoError = signal('');

  private readonly nameValue = toSignal(this.displayName.valueChanges, {
    initialValue: this.displayName.value,
  });
  private readonly accentValue = toSignal(this.accent.valueChanges, {
    initialValue: this.accent.value,
  });
  protected readonly preview = computed(() => {
    const accent = this.accentValue().trim().toLowerCase();
    // The preview keeps the brand tokens until the accent passes 4.5:1, as the server would refuse it.
    const valid =
      isHexColour(accent) &&
      contrastRatio(accent, accentForeground(accent)) >= ACCENT_MINIMUM_RATIO;
    return {
      name: this.nameValue().trim() || (this.org()?.name ?? ''),
      accent: valid ? accent : null,
      accentForeground: valid ? accentForeground(accent) : null,
    };
  });

  protected async save(): Promise<void> {
    const org = this.org();
    if (!org || this.saving()) return;
    this.nameError.set('');
    this.accentError.set('');
    this.saving.set(true);
    const accent = this.accent.value.trim().toLowerCase();
    try {
      await firstValueFrom(
        this.organizations.saveBranding(org.id, {
          displayName: this.displayName.value.trim(),
          accent: accent || null,
        }),
      );
      await this.access.refresh();
      this.toasts.show({
        variant: 'success',
        heading: 'Branding saved',
        text: 'The switcher and public event pages show it now.',
      });
    } catch (error) {
      const errors = error instanceof HttpErrorResponse ? problemDetails(error)?.errors : null;
      if (errors) {
        this.nameError.set(errors['displayName']?.[0] ?? '');
        this.accentError.set(errors['accent']?.[0] ?? '');
      } else {
        this.toasts.show({
          variant: 'danger',
          heading: 'We couldn’t save the branding',
          text: 'Check your connection and try again.',
        });
      }
    } finally {
      this.saving.set(false);
    }
  }

  protected async upload(files: File[]): Promise<void> {
    const org = this.org();
    const file = files[0];
    if (!org || !file || this.uploading()) return;
    this.logoError.set('');
    this.uploading.set(true);
    try {
      const saved = await firstValueFrom(this.organizations.uploadLogo(org.id, file));
      this.logoUrl.set(saved.logoUrl);
      await this.access.refresh();
      this.toasts.show({ variant: 'success', heading: 'Logo saved' });
    } catch (error) {
      const errors = error instanceof HttpErrorResponse ? problemDetails(error)?.errors : null;
      this.logoError.set(errors?.['logo']?.[0] ?? 'We couldn’t upload the logo. Try again.');
    } finally {
      this.uploading.set(false);
    }
  }

  protected async removeLogo(): Promise<void> {
    const org = this.org();
    if (!org) return;
    try {
      await firstValueFrom(this.organizations.removeLogo(org.id));
      this.logoUrl.set(null);
      await this.access.refresh();
      this.toasts.show({ variant: 'success', heading: 'Logo removed' });
    } catch {
      this.toasts.show({
        variant: 'danger',
        heading: 'We couldn’t remove the logo',
        text: 'Check your connection and try again.',
      });
    }
  }
}
