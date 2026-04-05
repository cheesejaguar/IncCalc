export interface CrimeIndexTier {
  index: number;
  label: string;
  minScore: number;
  maxScore: number;
  upkeepModifier: number;
  happinessEffect: number;
  criminalPercent: number;
}

export const CRIME_INDEX_TIERS: CrimeIndexTier[] = [
  { index: 0, label: 'Negligible',  minScore: 500, maxScore: Infinity, upkeepModifier: -0.02, happinessEffect: 2,    criminalPercent: 0.005 },
  { index: 1, label: 'Very Low',    minScore: 420, maxScore: 500,      upkeepModifier: -0.01, happinessEffect: 1,    criminalPercent: 0.01 },
  { index: 2, label: 'Minimal',     minScore: 340, maxScore: 420,      upkeepModifier: -0.01, happinessEffect: 0,    criminalPercent: 0.02 },
  { index: 3, label: 'Moderate',    minScore: 260, maxScore: 340,      upkeepModifier: 0,     happinessEffect: -1,   criminalPercent: 0.03 },
  { index: 4, label: 'High',        minScore: 180, maxScore: 260,      upkeepModifier: 0.01,  happinessEffect: -1.5, criminalPercent: 0.04 },
  { index: 5, label: 'Very High',   minScore: 100, maxScore: 180,      upkeepModifier: 0.02,  happinessEffect: -2,   criminalPercent: 0.05 },
  { index: 6, label: 'Extreme',     minScore: 0,   maxScore: 100,      upkeepModifier: 0.03,  happinessEffect: -3,   criminalPercent: 0.06 },
];
