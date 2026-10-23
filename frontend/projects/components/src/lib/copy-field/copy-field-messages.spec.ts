import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CopyFieldComponent } from './copy-field.component';

// Traces to: L2-158 AC5 (the source ID's copy field names what was copied)
@Component({
  imports: [CopyFieldComponent],
  template: `<ft-copy-field
    label="Source ID"
    value="src_6f1c"
    copyLabel="Copy source ID"
    copiedMessage="Source ID copied to the clipboard."
  />`,
})
class HostComponent {}

describe('CopyFieldComponent messages', () => {
  it('announces its own copied message', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.resolve() },
      configurable: true,
    });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    host.querySelector('button')!.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.querySelector('[role="status"]')!.textContent).toContain(
      'Source ID copied to the clipboard.',
    );
  });
});
