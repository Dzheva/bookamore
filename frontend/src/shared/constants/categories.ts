export const categories = [
  'sci-fi',
  'romantic',
  'historical',
  'detective',
  'fantasy',
  'biography',
  'horror',
  'comedy',
  'drama',
  'adventure',
  'children',
  'psychology',
] as const;

export type Category = (typeof categories)[number];
