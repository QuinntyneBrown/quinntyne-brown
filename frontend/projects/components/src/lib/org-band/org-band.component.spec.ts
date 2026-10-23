import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { OrgBandComponent } from './org-band.component';

@Component({
  imports: [OrgBandComponent],
  template: `<ft-org-band
      name="FaithTech Toronto"
      caption="Public event"
      accent="#0b6e4f"
      accentForeground="#ffffff"
    />
    <ft-org-band name="Shelfie" logoUrl="https://blobs.example/logo.png" />`,
})
class HostComponent {}

describe('OrgBandComponent', () => {
  it('shows the name on the accent through the scoped tokens, with initials or the logo', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const [branded, logo] = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('ft-org-band'),
    );
    expect(branded.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'FaithTech Toronto · Public event',
    );
    expect(branded.style.getPropertyValue('--color-org-accent')).toBe('#0b6e4f');
    expect(branded.querySelector('.org-mark')?.getAttribute('data-initials')).toBe('FT');
    expect(logo.style.getPropertyValue('--color-org-accent')).toBe('');
    expect(logo.querySelector('img')?.getAttribute('src')).toBe('https://blobs.example/logo.png');
  });
});
