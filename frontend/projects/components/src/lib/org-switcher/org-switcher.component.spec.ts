import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { OrgSwitcherComponent, OrgSwitcherOption, orgInitials } from './org-switcher.component';

const TORONTO: OrgSwitcherOption = {
  slug: 'faithtech-toronto',
  name: 'FaithTech Toronto',
  typeName: 'FaithTech City',
  accent: '#0b6e4f',
  accentForeground: '#ffffff',
};
const SHELFIE: OrgSwitcherOption = { slug: 'shelfie', name: 'Shelfie', typeName: 'Startup' };

@Component({
  imports: [OrgSwitcherComponent],
  template: `<ft-org-switcher
    [orgs]="orgs()"
    [active]="active()"
    portfolioName="Quinntyne Brown"
    (orgChange)="chosen.push($event)"
  />`,
})
class HostComponent {
  orgs = signal([TORONTO, SHELFIE]);
  active = signal('faithtech-toronto');
  chosen: string[] = [];
}

function setup(orgs = [TORONTO, SHELFIE]) {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.componentInstance.orgs.set(orgs);
  fixture.detectChanges();
  const host: HTMLElement = fixture.nativeElement;
  const open = () => {
    (host.querySelector('button') as HTMLButtonElement).click();
    fixture.detectChanges();
    return document.querySelector('[role="menu"]') as HTMLElement;
  };
  return { fixture, host, open };
}

describe('OrgSwitcherComponent', () => {
  it('names the button after the active org', () => {
    const { host } = setup();
    const button = host.querySelector('button')!;
    expect(button.getAttribute('aria-label')).toBe('FaithTech Toronto, switch organization');
    expect(button.getAttribute('aria-haspopup')).toBe('menu');
  });

  it('lists each org with its type, checks the active one, and offers All orgs', () => {
    const { open } = setup();
    const menu = open();
    const options = [...menu.querySelectorAll('[role="menuitemradio"]')];
    expect(options.map((o) => o.querySelector('.org-switcher__option-name')?.textContent)).toEqual([
      'FaithTech Toronto',
      'Shelfie',
      'All orgs',
    ]);
    expect(options.map((o) => o.getAttribute('aria-checked'))).toEqual(['true', 'false', 'false']);
    expect(options[1].textContent).toContain('Startup');
    expect(options[2].textContent).toContain('Read and assigned work across 2 orgs');
    expect(menu.textContent).toContain('Portfolio · you cover 2 orgs');
  });

  it('reports the chosen org', () => {
    const { fixture, open } = setup();
    const options = open().querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]');
    options[1].click();
    expect(fixture.componentInstance.chosen).toEqual(['shelfie']);
  });

  it('shows a single org as text with no button', () => {
    const { host } = setup([TORONTO]);
    expect(host.querySelector('button')).toBeNull();
    expect(host.querySelector('.org-switcher__current')?.textContent).toContain(
      'FaithTech Toronto',
    );
  });

  it('colours the mark with the org’s accent pair', () => {
    const { host } = setup([TORONTO]);
    const mark = host.querySelector<HTMLElement>('.org-mark')!;
    expect(mark.dataset['initials']).toBe('FT');
    expect(mark.style.getPropertyValue('--color-org-accent')).toBe('#0b6e4f');
  });

  it('takes up to two initials', () => {
    expect(orgInitials('Shelfie')).toBe('S');
    expect(orgInitials('FaithTech Kitchener Waterloo')).toBe('FK');
  });
});
