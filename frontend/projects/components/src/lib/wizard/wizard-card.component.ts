import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';
import { CardComponent } from '../card/card.component';

/**
 * One wizard step (design system: wizard, `.wizard-card`): a padded body that opens with the step's heading, then a
 * footer with Back (`ftWizardBack`) at the start and the step's actions (`ftWizardActions`: Skip, Continue or the
 * submit button) at the end. Call `focusHeading()` after every step change so the new step is announced.
 */
@Component({
  selector: 'ft-wizard-card',
  imports: [CardComponent],
  templateUrl: './wizard-card.component.html',
  styleUrl: './wizard-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardCardComponent {
  readonly heading = input.required<string>();

  private readonly headingEl = viewChild.required<ElementRef<HTMLElement>>('headingEl');

  focusHeading(): void {
    this.headingEl().nativeElement.focus();
  }
}
