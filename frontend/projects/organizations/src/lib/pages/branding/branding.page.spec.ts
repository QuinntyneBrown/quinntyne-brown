// Traces to: L2-149
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ORGANIZATIONS_SERVICE, provideStaticAccess } from '@faithtech-community/api';
import { Observable, of, throwError } from 'rxjs';

import { OrgBrandingPage } from './branding.page';

const saved = {
  displayName: 'FaithTech TO',
  logoUrl: null,
  accent: '#0b6e4f',
  accentForeground: '#ffffff',
  contrastRatio: 6.25,
};

async function setup(saveBranding: () => Observable<unknown> = () => of(saved), isOrgLead = true) {
  const service = { saveBranding: vi.fn(saveBranding) };
  TestBed.configureTestingModule({
    providers: [
      { provide: ORGANIZATIONS_SERVICE, useValue: service },
      provideStaticAccess({ isOrgLead }),
    ],
  });
  const fixture = TestBed.createComponent(OrgBrandingPage);
  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };
  await settle();
  const host = fixture.nativeElement as HTMLElement;
  const field = (label: string) => {
    const element = Array.from(host.querySelectorAll('label')).find((l) =>
      l.textContent?.trim().startsWith(label),
    )!;
    return host.querySelector<HTMLInputElement>(`#${element.getAttribute('for')}`)!;
  };
  const type = (label: string, value: string) => {
    field(label).value = value;
    field(label).dispatchEvent(new Event('input'));
  };
  const save = async () => {
    host.querySelector('form')!.dispatchEvent(new Event('submit'));
    await settle();
  };
  return { host, service, field, type, save, settle };
}

describe('OrgBrandingPage', () => {
  it('saves the display name and the accent in lower case', async () => {
    const page = await setup();
    page.type('Display name', 'FaithTech TO');
    page.type('Accent colour', '#0B6E4F');
    await page.save();

    expect(page.service.saveBranding).toHaveBeenCalledWith('org-faithtech-toronto', {
      displayName: 'FaithTech TO',
      accent: '#0b6e4f',
    });
    expect(page.host.querySelector('ft-org-band')!.textContent).toContain('FaithTech TO');
  });

  it('shows the server’s contrast refusal on the accent field (AC5)', async () => {
    const refusal = new HttpErrorResponse({
      status: 400,
      error: {
        errors: {
          accent: ["This colour doesn't have enough contrast. Choose a darker or lighter shade."],
        },
        contrastRatio: 4.47,
      },
    });
    const page = await setup(() => throwError(() => refusal));
    page.type('Accent colour', '#777777');
    await page.save();

    expect(page.field('Accent colour').getAttribute('aria-invalid')).toBe('true');
    expect(page.host.textContent).toContain("This colour doesn't have enough contrast.");
    expect(page.host.textContent).toContain('4.47:1');
    // A pair below 4.5:1 is never previewed on the accent.
    expect(page.host.querySelector('.colour-field__preview')).toBeNull();
  });

  it('tells a member without Org Lead that branding is for Org Leads', async () => {
    const page = await setup(undefined, false);
    expect(page.host.textContent).toContain('Only Org Leads change branding');
    expect(page.host.querySelector('form')).toBeNull();
  });
});
