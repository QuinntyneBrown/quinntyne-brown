import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { OrgLabelComponent } from './org-label.component';

@Component({
  imports: [OrgLabelComponent],
  template: `<ft-org-label name="Shelfie" accent="#f2b134" accentForeground="#111111" />
    <ft-org-label name="Portfolio" [portfolio]="true" />`,
})
class HostComponent {}

describe('OrgLabelComponent', () => {
  it('names the org and tints its dot with the org’s accent', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const [org, portfolio] = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('ft-org-label'),
    );
    expect(org.textContent?.trim()).toBe('Shelfie');
    expect(org.style.getPropertyValue('--color-org-accent')).toBe('#f2b134');
    expect(org.querySelector('.org-label__dot')?.getAttribute('aria-hidden')).toBe('true');
    expect(portfolio.classList).toContain('org-label--portfolio');
  });
});
