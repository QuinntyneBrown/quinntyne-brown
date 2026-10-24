import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PreviewCardComponent } from './preview-card.component';
import { ReviewSectionComponent, ReviewSectionsComponent } from './review-section.component';
import { WizardCardComponent } from './wizard-card.component';
import { WizardComponent, WizardStep } from './wizard.component';

@Component({
  imports: [WizardComponent],
  template: `<ft-wizard
    label="Idea submission steps"
    [steps]="steps"
    [current]="current"
    [preview]="true"
    (stepSelect)="picked = $event"
  >
    <form><h2>Step</h2></form>
    <aside ftWizardPreview aria-label="Preview">Preview</aside>
  </ft-wizard>`,
})
class HostComponent {
  steps: WizardStep[] = [
    { title: 'The problem' },
    { title: 'Your idea' },
    { title: 'How far along is it?', summary: 'Optional' },
    { title: 'Review' },
  ];
  current = 2;
  picked: number | null = null;
}

// Traces to: L2-168 AC3, L2-171 AC2 (design system components/wizard.html)
describe('WizardComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;
    const steps = () => Array.from(host.querySelectorAll<HTMLButtonElement>('ol button'));
    return { fixture, host, steps };
  }

  it('labels the rail and counts the same steps in the label and the bar', () => {
    const { host } = setup();

    expect(host.querySelector('nav')!.getAttribute('aria-label')).toBe('Idea submission steps');
    expect(host.querySelector('.progress__label')!.textContent!.replace(/\s+/g, ' ').trim()).toBe(
      'How far along is it?3 of 4',
    );
    expect((host.querySelector('.progress__bar') as HTMLElement).style.inlineSize).toBe('75%');
  });

  it('marks finished, current and later steps', () => {
    const { host, steps } = setup();

    expect(steps().map((s) => s.getAttribute('aria-current'))).toEqual([null, null, 'step', null]);
    expect(steps().map((s) => s.disabled)).toEqual([false, false, false, true]);
    expect(host.querySelectorAll('li[data-done]')).toHaveLength(2);
    expect(steps()[0].textContent).toContain('(done)');
    expect(steps()[2].textContent).toContain('Optional');
  });

  it('goes back to a finished step, never forward', () => {
    const { fixture, steps } = setup();

    steps()[1].click();
    expect(fixture.componentInstance.picked).toBe(1);
    fixture.componentInstance.picked = null;
    steps()[2].click();
    expect(fixture.componentInstance.picked).toBeNull();
  });

  it('projects the step card and the preview', () => {
    const { host } = setup();

    expect(host.querySelector('.main form')).not.toBeNull();
    expect(host.querySelector('.preview aside')).not.toBeNull();
  });
});

@Component({
  imports: [ReviewSectionsComponent, ReviewSectionComponent],
  template: `<ft-review-sections>
    <ft-review-section heading="The problem" editLabel="Edit the problem" (edit)="edited = true">
      <p>Answers</p>
    </ft-review-section>
  </ft-review-sections>`,
})
class ReviewHostComponent {
  edited = false;
}

// Traces to: L2-175 AC1, AC2
describe('ReviewSectionComponent', () => {
  it('is a section named by its heading with a named Edit button', () => {
    const fixture = TestBed.createComponent(ReviewHostComponent);
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;
    const section = host.querySelector('section')!;
    const heading = section.querySelector('h3')!;
    const edit = section.querySelector('button')!;

    expect(section.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(heading.textContent).toBe('The problem');
    expect(edit.getAttribute('aria-label')).toBe('Edit the problem');
    edit.click();
    expect(fixture.componentInstance.edited).toBe(true);
  });
});

@Component({
  imports: [PreviewCardComponent],
  template: `<ft-preview-card
    label="Idea preview"
    [title]="title()"
    caption="You"
    [text]="text()"
    placeholderTitle="Untitled idea"
    placeholderText="Your one-line pitch appears here."
  />`,
})
class PreviewHostComponent {
  readonly title = signal('');
  readonly text = signal('');
}

// Traces to: L2-174
describe('PreviewCardComponent', () => {
  it('shows muted placeholders until filled, then the trimmed title and text', () => {
    const fixture = TestBed.createComponent(PreviewHostComponent);
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;
    const title = () => host.querySelector('h3')!;

    expect(host.querySelector('article')!.getAttribute('aria-label')).toBe('Idea preview');
    expect(title().textContent!.trim()).toBe('Untitled idea');
    expect(title().classList).toContain('muted');
    expect(host.textContent).toContain('Your one-line pitch appears here.');

    fixture.componentInstance.title.set('  ShiftShare ');
    fixture.componentInstance.text.set('Shift sign-ups.');
    fixture.detectChanges();

    expect(title().textContent!.trim()).toBe('ShiftShare');
    expect(title().classList).not.toContain('muted');
    expect(host.textContent).toContain('Shift sign-ups.');
    expect(host.textContent).toContain('You');
  });
});

@Component({
  imports: [WizardCardComponent],
  template: `<ft-wizard-card heading="What problem have you noticed?">
    <p>Fields</p>
    <button ftWizardBack type="button">Back</button>
    <button ftWizardActions type="submit">Continue</button>
  </ft-wizard-card>`,
})
class CardHostComponent {
  readonly card = viewChild.required(WizardCardComponent);
}

// Traces to: L2-168 AC3
describe('WizardCardComponent', () => {
  it('opens with a focusable step heading and puts Back and the actions in the footer', () => {
    const fixture = TestBed.createComponent(CardHostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;
    const heading = host.querySelector('h2')!;

    expect(heading.getAttribute('tabindex')).toBe('-1');
    expect(host.querySelector('.footer .start button')!.textContent).toBe('Back');
    expect(host.querySelector('.footer .end button')!.textContent).toBe('Continue');
    fixture.componentInstance.card().focusHeading();
    expect(document.activeElement).toBe(heading);
  });
});
