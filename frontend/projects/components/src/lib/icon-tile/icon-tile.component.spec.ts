import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { IconTileComponent } from './icon-tile.component';

@Component({
  imports: [IconTileComponent],
  template: `<ft-icon-tile name="workspaces" /><ft-icon-tile name="email" size="sm" />`,
})
class HostComponent {}

describe('IconTileComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('ft-icon-tile'));
  }

  it('draws the icon in a tile hidden from assistive technology, as the row text names it', () => {
    const [tile] = setup();
    expect(tile.getAttribute('aria-hidden')).toBe('true');
    expect(tile.querySelector('ft-icon svg')).not.toBeNull();
  });

  it('offers the small size', () => {
    const [md, sm] = setup();
    expect(md.classList.contains('ft-icon-tile--sm')).toBe(false);
    expect(sm.classList.contains('ft-icon-tile--sm')).toBe(true);
  });
});

@Component({
  imports: [IconTileComponent],
  template: `<ft-icon-tile name="idea" cover="sun" />`,
})
class CoverHostComponent {}

// Traces to: L2-174, L2-176 (design system components/wizard.html: preview and success tiles)
describe('IconTileComponent cover', () => {
  it('draws the icon on the cover colour', () => {
    const fixture = TestBed.createComponent(CoverHostComponent);
    fixture.detectChanges();
    const tile = (fixture.nativeElement as HTMLElement).querySelector('ft-icon-tile')!;

    expect(tile.classList).toContain('ft-icon-tile--cover');
    expect(tile.getAttribute('data-cover')).toBe('sun');
  });
});
