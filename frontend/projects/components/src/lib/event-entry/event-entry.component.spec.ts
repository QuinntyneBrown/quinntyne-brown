import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { EventEntryComponent } from './event-entry.component';

// Traces to: L2-166 AC2 (design system: components/event-entry)
@Component({
  imports: [EventEntryComponent],
  template: `<ft-event-entry
    kind="Contact request"
    kindTone="info"
    title="Ada Lovelace"
    meta="ada@example.com · Today, 2:58 pm"
    preview="We’d like to volunteer."
    [(expanded)]="open"
    ><p class="body">The fields</p></ft-event-entry
  >`,
})
class HostComponent {
  open = signal(false);
}

describe('EventEntryComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    return { fixture, host, toggle: host.querySelector<HTMLButtonElement>('h3 > button')! };
  }

  it('is a collapsed toggle in a heading with the kind, title, meta and preview', () => {
    const { host, toggle } = setup();

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.textContent).toContain('Contact request');
    expect(toggle.textContent).toContain('Ada Lovelace');
    expect(toggle.textContent).toContain('ada@example.com · Today, 2:58 pm');
    expect(toggle.textContent).toContain('We’d like to volunteer.');
    expect(host.querySelector('p.body')).toBeNull();
  });

  it('expands to show its body, drops the preview and updates the model', () => {
    const { fixture, host, toggle } = setup();

    toggle.click();
    fixture.detectChanges();

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    const body = host.querySelector(`#${toggle.getAttribute('aria-controls')}`)!;
    expect(body.textContent).toContain('The fields');
    expect(toggle.textContent).not.toContain('We’d like to volunteer.');
    expect(fixture.componentInstance.open()).toBe(true);
  });
});

@Component({
  imports: [EventEntryComponent],
  template: `<ft-event-entry
    kind="Other event"
    title="newsletter.subscribed"
    [json]="json"
    [expanded]="true"
  />`,
})
class JsonHostComponent {
  json = '{\n  "list": "monthly"\n}';
}

describe('EventEntryComponent with JSON', () => {
  it('shows the data as sent, with a caption', () => {
    const fixture = TestBed.createComponent(JsonHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('pre')!.textContent).toBe('{\n  "list": "monthly"\n}');
    expect(host.textContent).toContain('This kind of event has no view of its own yet.');
  });
});
