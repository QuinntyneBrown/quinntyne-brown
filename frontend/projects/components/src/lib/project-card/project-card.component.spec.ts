// Traces to: L2-132 AC4
import { TestBed } from '@angular/core/testing';

import { ProjectCardComponent } from './project-card.component';

function setup(inputs: Record<string, string>): HTMLElement {
  const fixture = TestBed.createComponent(ProjectCardComponent);
  for (const [name, value] of Object.entries(inputs)) fixture.componentRef.setInput(name, value);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('ProjectCardComponent', () => {
  const shelfie = {
    name: 'Shelfie',
    href: 'https://github.com/QuinntyneBrown?tab=repositories&q=Shelfie',
    language: 'TypeScript',
  };

  it('is a list item whose one link is the project name', () => {
    const el = setup(shelfie);

    expect(el.getAttribute('role')).toBe('listitem');
    const links = el.querySelectorAll('a');
    expect(links.length).toBe(1);
    expect(links[0].textContent?.trim()).toBe('Shelfie');
    expect(links[0].getAttribute('href')).toBe(shelfie.href);
  });

  it('shows the main language', () => {
    expect(setup(shelfie).querySelector('.project-card__language')?.textContent).toBe('TypeScript');
  });

  it('shows the one-line description after the language when one is given', () => {
    const body = setup({
      ...shelfie,
      description: 'A reading habit tracker for a young reader, with parent rewards.',
    }).querySelector('.project-card__body')!;

    const description = body.querySelector('.project-card__description')!;
    expect(description.textContent).toBe(
      'A reading habit tracker for a young reader, with parent rewards.',
    );
    expect(description.previousElementSibling?.classList).toContain('project-card__language');
  });

  it('shows no description element when none is given', () => {
    expect(setup(shelfie).querySelector('.project-card__description')).toBeNull();
  });

  it('shows a decorative tile with the initial when there is no thumbnail', () => {
    const thumb = setup(shelfie).querySelector('.project-card__thumb')!;

    expect(thumb.getAttribute('aria-hidden')).toBe('true');
    expect(thumb.textContent?.trim()).toBe('S');
    expect(thumb.querySelector('img')).toBeNull();
  });

  it('shows a decorative thumbnail image when one is given', () => {
    const img = setup({ ...shelfie, image: '/projects/shelfie.png' }).querySelector(
      '.project-card__thumb img',
    )!;

    expect(img.getAttribute('src')).toBe('/projects/shelfie.png');
    expect(img.getAttribute('alt')).toBe('');
  });
});
