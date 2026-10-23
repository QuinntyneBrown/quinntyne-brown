import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SecretFieldComponent } from './secret-field.component';

// Traces to: L2-158 AC5 (design system: components/secret-field)
@Component({
  imports: [SecretFieldComponent],
  template: `<ft-secret-field
    label="Signing secret for Goodwork"
    [value]="value()"
    prefix="whsec_3kPq"
    (copied)="copies = copies + 1"
  />`,
})
class HostComponent {
  value = signal<string | null>('whsec_3kPqZ8vT1mWc6yLr0hNd4jXb9sGf2uEa7oKiQ5tRw1M');
  copies = 0;
}

async function setup(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  await fixture.whenStable();
  const host = fixture.nativeElement as HTMLElement;
  return { fixture, host };
}

describe('SecretFieldComponent', () => {
  it('warns that the secret is shown once and shows it read-only with Copy secret', async () => {
    const { host } = await setup(() => Promise.resolve());

    expect(host.textContent).toContain('Copy this secret now. You won’t see it again.');
    const input = host.querySelector<HTMLInputElement>('input')!;
    expect(input.value).toBe('whsec_3kPqZ8vT1mWc6yLr0hNd4jXb9sGf2uEa7oKiQ5tRw1M');
    expect(input.readOnly).toBe(true);
    expect(host.querySelector('label')!.textContent).toContain('Signing secret for Goodwork');
    expect(host.querySelector('button')!.textContent).toContain('Copy secret');
  });

  it('copies the secret, then masks it to its prefix and announces it', async () => {
    const writes: string[] = [];
    const { fixture, host } = await setup((text) => {
      writes.push(text);
      return Promise.resolve();
    });

    host.querySelector<HTMLButtonElement>('button')!.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(writes).toEqual(['whsec_3kPqZ8vT1mWc6yLr0hNd4jXb9sGf2uEa7oKiQ5tRw1M']);
    expect(fixture.componentInstance.copies).toBe(1);
    expect(host.querySelector('input')).toBeNull();
    const status = host.querySelector('[role="status"]')!;
    expect(status.textContent).toContain('Secret copied and hidden');
    expect(status.textContent).toContain('whsec_3kPq…');
    expect(host.textContent).not.toContain('whsec_3kPqZ8');
  });

  it('keeps the secret shown and selected when the clipboard refuses', async () => {
    const { fixture, host } = await setup(() => Promise.reject(new Error('denied')));

    host.querySelector<HTMLButtonElement>('button')!.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.querySelector('input')).not.toBeNull();
    expect(host.textContent).toContain('Select the secret and copy it.');
    expect(fixture.componentInstance.copies).toBe(0);
  });

  it('shows only the prefix when there is no secret to show', async () => {
    const { fixture, host } = await setup(() => Promise.resolve());
    fixture.componentInstance.value.set(null);
    fixture.detectChanges();

    expect(host.querySelector('input')).toBeNull();
    expect(host.textContent).toContain('Hidden');
    expect(host.textContent).toContain('whsec_3kPq… Rotate the secret to get a new one.');
  });
});
