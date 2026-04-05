import type { HappinessBreakdownItem, HappinessResult } from '../types';
import { RESOURCE_HAPPINESS_BONUSES } from '../data/resources';
import { DEFCON_LEVELS } from '../data/defcon';
import { IMPROVEMENTS } from '../data/improvements';
import { WONDERS } from '../data/wonders';
import { CRIME_INDEX_TIERS } from '../data/crime';

export interface HappinessInput {
  tech: number;
  taxRate: number; // percentage, e.g. 28 for 28%
  defcon: number;
  environment: number;
  connectedResources: string[];
  bonusResources: string[];
  improvements: Record<string, number>;
  ownedWonders: string[];
  crimePreventionScore: number;
  threatLevel?: string;
}

export type { HappinessResult };

/**
 * Calculate tech happiness contribution.
 * Brackets: tech=0→-1, ≤0.5→0, ≤1→1, ≤3→2, ≤6→3, ≤10→4, ≤15→5, >15→min(5+tech*0.02, 200)
 */
function getTechHappiness(tech: number): number {
  if (tech === 0) return -1;
  if (tech <= 0.5) return 0;
  if (tech <= 1) return 1;
  if (tech <= 3) return 2;
  if (tech <= 6) return 3;
  if (tech <= 10) return 4;
  if (tech <= 15) return 5;
  return Math.min(5 + tech * 0.02, 200);
}

/**
 * Calculate tax happiness penalty.
 * Each % above 28% costs -1 happiness. Each % below 28% gains +1 happiness (up to some limit).
 * Typical CN formula: (28 - taxRate) happiness, with a reasonable ceiling.
 */
function getTaxHappiness(taxRate: number): number {
  return 28 - taxRate;
}

/**
 * Find the crime tier for a given prevention score.
 */
function getCrimeTierHappiness(preventionScore: number): number {
  // Find the highest-tier that is satisfied (score >= minScore), tiers are ordered best-first
  for (const tier of CRIME_INDEX_TIERS) {
    if (preventionScore >= tier.minScore) {
      return tier.happinessEffect;
    }
  }
  // Default to worst tier
  return CRIME_INDEX_TIERS[CRIME_INDEX_TIERS.length - 1].happinessEffect;
}

/**
 * Calculate happiness for a nation, returning a total and full itemized breakdown.
 */
export function calculateHappiness(input: HappinessInput): HappinessResult {
  const breakdown: HappinessBreakdownItem[] = [];

  // Base happiness
  breakdown.push({ source: 'Base Happiness', value: 5 });

  // Tech happiness
  const techHappiness = getTechHappiness(input.tech);
  breakdown.push({ source: `Technology (${input.tech} levels)`, value: techHappiness });

  // Tax penalty
  const taxHappiness = getTaxHappiness(input.taxRate);
  if (taxHappiness !== 0) {
    breakdown.push({
      source: `Tax Rate (${input.taxRate}% — base 28%)`,
      value: taxHappiness,
    });
  }

  // DEFCON
  const defconData = DEFCON_LEVELS[input.defcon];
  if (defconData && defconData.happiness !== 0) {
    breakdown.push({
      source: `DEFCON ${input.defcon}`,
      value: defconData.happiness,
    });
  }

  // Threat Level
  const THREAT_HAPPINESS: Record<string, number> = {
    'Low': 0,
    'Guarded': -0.5,
    'Elevated': -1.0,
    'High': -1.5,
    'Severe': -2.0,
  };

  if (input.threatLevel) {
    const threatPenalty = THREAT_HAPPINESS[input.threatLevel] ?? 0;
    if (threatPenalty !== 0) {
      breakdown.push({ source: `Threat Level (${input.threatLevel})`, value: threatPenalty });
    }
  }

  // Environment
  if (input.environment !== 0) {
    breakdown.push({ source: 'Environment', value: input.environment });
  }

  // Resources — combine connected + bonus resources for happiness lookup
  const allResources = [...input.connectedResources, ...input.bonusResources];
  for (const resource of allResources) {
    const key = resource.toLowerCase();
    const bonus = RESOURCE_HAPPINESS_BONUSES[key];
    if (bonus !== undefined && bonus !== 0) {
      breakdown.push({ source: `Resource: ${resource}`, value: bonus });
    }
  }

  // Improvements with happiness effects
  for (const [name, count] of Object.entries(input.improvements)) {
    if (count <= 0) continue;
    const def = IMPROVEMENTS[name];
    if (def && def.happinessEffect !== 0) {
      breakdown.push({
        source: `${name} (×${count})`,
        value: def.happinessEffect * count,
      });
    }
  }

  // Wonders with happiness effects
  for (const wonderName of input.ownedWonders) {
    const def = WONDERS.find((w) => w.name === wonderName);
    if (def && def.happinessEffect !== 0) {
      breakdown.push({ source: `Wonder: ${wonderName}`, value: def.happinessEffect });
    }
  }

  // Crime tier happiness
  const crimeHappiness = getCrimeTierHappiness(input.crimePreventionScore);
  if (crimeHappiness !== 0) {
    breakdown.push({ source: 'Crime Index', value: crimeHappiness });
  }

  const total = breakdown.reduce((sum, item) => sum + item.value, 0);

  return { total, breakdown };
}
