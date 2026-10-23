import { shortSourceId } from './applications.page';

// Traces to: L2-165 (docs/screen-composition.md, Applications: the source ID shortening)
describe('shortSourceId', () => {
  it('keeps the prefix and the last four characters', () => {
    expect(shortSourceId('src_6f1c2a9e0b4d4f7a8c3e5d2b1a0f9e8d')).toBe('src_6f1c…9e8d');
  });
});
