import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { IDEAS_SERVICE, IdeaForm, IdeasService } from '@faithtech-community/api';
import { ToastService } from '@faithtech-community/components';
import { Observable, of, throwError } from 'rxjs';

import { IdeaFormPage } from './idea-form.page';

// Traces to: L2-181
async function setup(
  settings: () => Observable<{ askStage: boolean; askPeople: boolean; updatedAt: null }>,
  saveSettings: (
    s: IdeaForm,
  ) => Observable<{ askStage: boolean; askPeople: boolean; updatedAt: null }> = (s) =>
    of({ ...s, updatedAt: null }),
) {
  const service = {
    form: vi.fn(() => of({ askStage: true, askPeople: true })),
    settings: vi.fn(settings),
    saveSettings: vi.fn(saveSettings),
  } satisfies IdeasService;
  const toasts = { show: vi.fn() };
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: IDEAS_SERVICE, useValue: service },
      { provide: ToastService, useValue: toasts },
    ],
  });
  const router = TestBed.inject(Router);
  const navigate = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  const fixture = TestBed.createComponent(IdeaFormPage);
  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };
  await settle();
  const host = fixture.nativeElement as HTMLElement;
  const switches = () => Array.from(host.querySelectorAll<HTMLInputElement>('[role="switch"]'));
  return { service, toasts, navigate, host, switches, settle };
}

describe('IdeaFormPage', () => {
  it('shows the saved switches and saves a change', async () => {
    const { service, host, switches, settle } = await setup(() =>
      of({ askStage: true, askPeople: false, updatedAt: null }),
    );

    expect(switches().map((s) => s.checked)).toEqual([true, false]);
    switches()[1].click();
    host.querySelector('form')!.dispatchEvent(new Event('submit'));
    await settle();

    expect(service.saveSettings).toHaveBeenCalledWith({ askStage: true, askPeople: true });
    expect(host.textContent).toContain('Idea form saved');
  });

  it('sends anyone who is not System Admin to the not-found page', async () => {
    const { navigate } = await setup(() =>
      throwError(() => new HttpErrorResponse({ status: 404 })),
    );

    expect(navigate).toHaveBeenCalledWith('/not-found', { skipLocationChange: true });
  });

  it('shows the error toast when a save fails', async () => {
    const { toasts, host, settle } = await setup(
      () => of({ askStage: true, askPeople: true, updatedAt: null }),
      () => throwError(() => new HttpErrorResponse({ status: 500 })),
    );

    host.querySelector('form')!.dispatchEvent(new Event('submit'));
    await settle();

    expect(toasts.show).toHaveBeenCalledWith(
      expect.objectContaining({ heading: 'Idea form not saved' }),
    );
    expect(host.textContent).not.toContain('Idea form saved');
  });
});
