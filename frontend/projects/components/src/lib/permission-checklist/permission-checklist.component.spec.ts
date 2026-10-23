import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { PermissionChecklistComponent, PermissionGroup } from './permission-checklist.component';

@Component({
  imports: [ReactiveFormsModule, PermissionChecklistComponent],
  template: `<ft-permission-checklist [groups]="groups" [formControl]="codes" />`,
})
class HostComponent {
  readonly groups: PermissionGroup[] = [
    {
      feature: 'partners',
      label: 'Partners',
      codes: [
        { code: 'partners.read', label: 'Read the partner pipeline' },
        { code: 'partners.write', label: 'Change the partner pipeline' },
      ],
    },
  ];
  // reports.view belongs to a feature that is off: it is not shown but kept.
  readonly codes = new FormControl(['partners.read', 'reports.view'], { nonNullable: true });
}

describe('PermissionChecklistComponent', () => {
  it('groups codes by feature with their labels and counts, and keeps hidden codes', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const boxes = Array.from(host.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'));
    expect(boxes.map((b) => b.checked)).toEqual([true, false]);
    expect(host.querySelector('.group__legend')!.textContent).toContain('1 of 2');
    expect(boxes[1].closest('label')!.textContent).toContain('Change the partner pipeline');

    boxes[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.codes.value).toEqual([
      'partners.read',
      'reports.view',
      'partners.write',
    ]);
    expect(host.querySelector('.group__legend')!.textContent).toContain('2 of 2');
  });
});
