// Traces to: L2-132 AC3, AC4
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LandingSectionComponent } from './landing-section.component';

@Component({
  imports: [LandingSectionComponent],
  template: `
    <ft-landing-section eyebrow="Work" heading="Fifteen years shipping.">
      <p>Figures</p>
    </ft-landing-section>
  `,
})
class HostComponent {}

describe('LandingSectionComponent', () => {
  function setup(): HTMLElement {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).querySelector('ft-landing-section')!;
  }

  it('is a region named by its level-2 heading', () => {
    const section = setup();
    const heading = section.querySelector('h2')!;

    expect(section.getAttribute('role')).toBe('region');
    expect(heading.textContent).toBe('Fifteen years shipping.');
    expect(section.getAttribute('aria-labelledby')).toBe(heading.id);
  });

  it('shows the eyebrow before the heading and the content after it', () => {
    const section = setup();

    const parts = [...section.children].map((c) => c.tagName.toLowerCase());
    expect(parts).toEqual(['p', 'h2', 'p']);
    expect(section.querySelector('.landing-section__eyebrow')?.textContent).toBe('Work');
    expect(section.lastElementChild?.textContent).toBe('Figures');
  });
});
