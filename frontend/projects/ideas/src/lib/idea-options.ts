/**
 * The wizard's fixed choices, keyed as the API takes them, with the mocks' labels. Mirrors IdeaOptions.cs
 * (docs/detailed-designs/ideas/submit, Options and limits).
 */
export interface IdeaOption {
  value: string;
  label: string;
}

export const AUDIENCES: readonly IdeaOption[] = [
  { value: 'churches', label: 'Churches and ministries' },
  { value: 'nonprofits', label: 'Nonprofits and shelters' },
  { value: 'families', label: 'Families' },
  { value: 'students', label: 'Students and young adults' },
  { value: 'newcomers', label: 'Newcomers to Canada' },
  { value: 'small-business', label: 'Small businesses' },
];

export const STAGES: readonly IdeaOption[] = [
  { value: 'idea', label: 'Just an idea' },
  { value: 'sketches', label: 'Sketches or notes' },
  { value: 'prototype', label: 'Working prototype' },
  { value: 'live', label: 'Already in use' },
];

export const PLATFORMS: readonly IdeaOption[] = [
  { value: 'web', label: 'Web app' },
  { value: 'mobile', label: 'Phone app' },
  { value: 'both', label: 'Both' },
  { value: 'unsure', label: 'Not sure yet' },
];

export const TOPICS: readonly string[] = [
  'Accessibility',
  'AI',
  'Community',
  'Education',
  'Faith',
  'Housing',
  'Mental health',
  'Prayer',
  'Volunteering',
];

export const SKILLS: readonly string[] = [
  'Product Engineer',
  'Designer',
  'Product manager',
  'Data and AI',
  'Domain expert',
  'Marketing and comms',
];

export const INVOLVEMENTS: readonly IdeaOption[] = [
  { value: 'lead', label: 'I want to lead it' },
  { value: 'contribute', label: 'I’ll help build it' },
  { value: 'share', label: 'I’m sharing it for others' },
];

export const COMMITMENTS: readonly IdeaOption[] = [
  { value: 'monthly', label: 'A few hours a month' },
  { value: 'weekly', label: 'A few hours a week' },
  { value: 'part-time', label: 'Part-time or more' },
];

export const LIMITS = {
  problemMin: 30,
  problem: 600,
  title: 60,
  pitch: 140,
  solution: 1000,
  name: 100,
  email: 254,
  topics: 5,
} as const;

/** The label of an option key, or the key itself. */
export function labelOf(options: readonly IdeaOption[], value: string | null): string {
  return options.find((o) => o.value === value)?.label ?? value ?? '';
}
