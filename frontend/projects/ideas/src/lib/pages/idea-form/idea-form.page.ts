import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IDEAS_SERVICE } from '@faithtech-community/api';
import {
  AlertComponent,
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  ButtonComponent,
  CardComponent,
  FormActionsComponent,
  PageHeaderComponent,
  StackComponent,
  SwitchComponent,
  TabComponent,
  TabsComponent,
  ToastService,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

/**
 * The Idea form at /admin/ideas (L2-181, docs/mocks/pages/idea-settings): System Admin turns the wizard's two
 * optional steps on or off. Anyone else gets the not-found page, because the server answers 404.
 */
@Component({
  selector: 'ft-idea-form-page',
  imports: [
    ReactiveFormsModule,
    AlertComponent,
    BreadcrumbComponent,
    BreadcrumbItemComponent,
    ButtonComponent,
    CardComponent,
    FormActionsComponent,
    PageHeaderComponent,
    StackComponent,
    SwitchComponent,
    TabComponent,
    TabsComponent,
  ],
  templateUrl: './idea-form.page.html',
  styleUrl: './idea-form.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdeaFormPage implements OnInit {
  private readonly ideas = inject(IDEAS_SERVICE);
  private readonly router = inject(Router);
  private readonly toasts = inject(ToastService);

  protected readonly form = new FormGroup({
    askStage: new FormControl(true, { nonNullable: true }),
    askPeople: new FormControl(true, { nonNullable: true }),
  });
  protected readonly loaded = signal(false);
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);

  async ngOnInit(): Promise<void> {
    this.form.disable();
    try {
      const settings = await firstValueFrom(this.ideas.settings());
      this.form.setValue({ askStage: settings.askStage, askPeople: settings.askPeople });
      this.form.enable();
      this.loaded.set(true);
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 404) {
        void this.router.navigateByUrl('/not-found', { skipLocationChange: true });
        return;
      }
      this.toasts.show({
        variant: 'danger',
        heading: 'We couldn’t load the Idea form',
        text: 'Check your connection and reload the page.',
      });
    }
  }

  protected async save(): Promise<void> {
    if (this.saving() || !this.loaded()) return;
    this.saving.set(true);
    this.saved.set(false);
    try {
      const settings = await firstValueFrom(this.ideas.saveSettings(this.form.getRawValue()));
      this.form.setValue({ askStage: settings.askStage, askPeople: settings.askPeople });
      this.saved.set(true);
    } catch {
      this.toasts.show({
        variant: 'danger',
        heading: 'Idea form not saved',
        text: 'Check your connection and try again.',
      });
    } finally {
      this.saving.set(false);
    }
  }
}
