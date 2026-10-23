import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { FormFieldComponent } from '../form-field';
import { ColourFieldComponent } from './colour-field.component';

@Component({
  imports: [ReactiveFormsModule, ColourFieldComponent, FormFieldComponent],
  template: `<ft-form-field label="Accent colour" [optional]="true">
    <ft-colour-field previewText="FaithTech Toronto" [formControl]="accent" />
  </ft-form-field>`,
})
class HostComponent {
  readonly accent = new FormControl('#0b6e4f', { nonNullable: true });
}

function setup() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  const host = fixture.nativeElement as HTMLElement;
  return { fixture, host, accent: fixture.componentInstance.accent };
}

describe('ColourFieldComponent', () => {
  it('shows the hex upper-case, the preview on the accent and the ratio with white text', () => {
    const { host } = setup();
    const hex = host.querySelector<HTMLInputElement>('ft-text-field input')!;
    expect(hex.value).toBe('#0B6E4F');
    expect(hex.labels?.[0]?.textContent).toContain('Accent colour');
    const preview = host.querySelector<HTMLElement>('.colour-field__preview')!;
    expect(preview.textContent?.trim()).toBe('Aa FaithTech Toronto');
    expect(preview.style.getPropertyValue('--color-org-accent-foreground')).toBe('#ffffff');
    expect(host.querySelector('.colour-field__ratio')?.textContent).toContain(
      'Contrast with white text: 6.',
    );
    expect(host.textContent).toContain('Passes AA');
    const swatch = host.querySelector<HTMLInputElement>('input[type="color"]')!;
    expect(swatch.tabIndex).toBe(-1);
    expect(swatch.getAttribute('aria-label')).toBe('Pick the accent colour');
  });

  it('picks near-black text for a light accent', async () => {
    const { fixture, host } = setup();
    const hex = host.querySelector<HTMLInputElement>('ft-text-field input')!;
    hex.value = '#FFD966';
    hex.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(host.querySelector('.colour-field__ratio')?.textContent).toContain(
      'Contrast with near-black (#111111) text',
    );
    expect(fixture.componentInstance.accent.value).toBe('#FFD966');
  });

  it('shows both ratios and Below 4.5:1 for an accent without enough contrast', async () => {
    const { fixture, host, accent } = setup();
    accent.setValue('#777777');
    fixture.detectChanges();
    await fixture.whenStable();
    const ratio = host.querySelector('.colour-field__ratio')!.textContent!;
    expect(ratio).toContain('4.47:1');
    expect(ratio).toContain('with near-black');
    expect(ratio).toContain('Below 4.5:1');
  });
});
