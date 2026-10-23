import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TokenRevealComponent } from './token-reveal.component';

@Component({
  imports: [TokenRevealComponent],
  template: `<ft-token-reveal token="ftca_abc123" />`,
})
class HostComponent {}

describe('TokenRevealComponent', () => {
  it('warns the token is shown once and shows it read-only with a Copy button', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('You won’t see this token again.');
    const field = host.querySelector<HTMLInputElement>('input')!;
    expect(field.value).toBe('ftca_abc123');
    expect(field.readOnly).toBe(true);
    expect(host.querySelector('button')!.textContent).toContain('Copy token');
  });
});
