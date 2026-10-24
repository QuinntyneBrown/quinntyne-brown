import { planIdeaSteps } from './idea-steps';

// Traces to: L2-171 (every switch combination, signed in and signed out)
describe('planIdeaSteps', () => {
  it('gives a signed-in member each optional step that is on, in order, before Review', () => {
    expect(planIdeaSteps(true, { askStage: true, askPeople: true })).toEqual([
      'problem',
      'idea',
      'stage',
      'people',
      'review',
    ]);
    expect(planIdeaSteps(true, { askStage: true, askPeople: false })).toEqual([
      'problem',
      'idea',
      'stage',
      'review',
    ]);
    expect(planIdeaSteps(true, { askStage: false, askPeople: true })).toEqual([
      'problem',
      'idea',
      'people',
      'review',
    ]);
    expect(planIdeaSteps(true, { askStage: false, askPeople: false })).toEqual([
      'problem',
      'idea',
      'review',
    ]);
  });

  it('never gives a visitor the optional steps, whatever the switches say', () => {
    expect(planIdeaSteps(false, { askStage: true, askPeople: true })).toEqual([
      'problem',
      'idea',
      'review',
    ]);
    expect(planIdeaSteps(false, null)).toEqual(['problem', 'idea', 'review']);
  });
});
