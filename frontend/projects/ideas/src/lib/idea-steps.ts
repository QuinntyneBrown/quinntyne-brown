import { WizardStep } from '@faithtech-community/components';

export type IdeaStepKey = 'problem' | 'idea' | 'stage' | 'people' | 'review';

/** The Idea form switches as the wizard reads them (GET /api/ideas/form). */
export interface IdeaSwitches {
  askStage: boolean;
  askPeople: boolean;
}

/**
 * The step rule (L2-171, decision 5): The problem, Your idea, each optional step the Idea form turns on in order, then
 * Review. A visitor who is not signed in never gets the optional steps, whatever the switches say.
 */
export function planIdeaSteps(signedIn: boolean, switches: IdeaSwitches | null): IdeaStepKey[] {
  const steps: IdeaStepKey[] = ['problem', 'idea'];
  if (signedIn && switches?.askStage) steps.push('stage');
  if (signedIn && switches?.askPeople) steps.push('people');
  steps.push('review');
  return steps;
}

/** Each step's rail title (with "Optional" under the optional ones) and its card heading. */
export const IDEA_STEPS: Record<IdeaStepKey, WizardStep & { heading: string }> = {
  problem: { title: 'The problem', heading: 'What problem have you noticed?' },
  idea: { title: 'Your idea', heading: 'What would you build?' },
  stage: { title: 'How far along is it?', summary: 'Optional', heading: 'How far along is it?' },
  people: { title: 'Who do you need?', summary: 'Optional', heading: 'Who do you need?' },
  review: { title: 'Review', heading: 'Review and submit' },
};
