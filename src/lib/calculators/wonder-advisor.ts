import type { WonderProjection } from '../types';
import { WONDERS } from '../data/wonders';

interface WonderAdvisorInput {
  citizenCount: number;
  citizenIncome: number;
  netIncome: number;
  happiness: number;
  tech: number;
  taxRate: number; // as decimal, e.g. 0.28
  // Improvement counts
  banks: number;
  foreignMinistries: number;
  guerillaCamps: number;
  harbors: number;
  schools: number;
  universities: number;
  // Owned wonders
  ownedWonders: string[];
}

/**
 * Calculate wonder projections and recommendations.
 * Ported from resource/wonder.inc.php.
 *
 * Income modifier = (1+0.07*banks) * (1+0.05*FM) * (1-0.08*GC)
 *                   * (1+0.01*harbors) * (1+0.05*schools) * (1+0.08*universities)
 *
 * Happiness income = 2 * incomeMod * taxRate
 *
 * Each wonder adds different projected income based on happiness income,
 * citizen count, tech, etc.
 */
export function calculateWonderProjections(
  input: WonderAdvisorInput
): WonderProjection[] {
  const incomeMod =
    (1 + 0.07 * input.banks) *
    (1 + 0.05 * input.foreignMinistries) *
    (1 - 0.08 * input.guerillaCamps) *
    (1 + 0.01 * input.harbors) *
    (1 + 0.05 * input.schools) *
    (1 + 0.08 * input.universities);

  const hapIncome = 2 * incomeMod * input.taxRate;

  // Per-wonder projected income formulas (from wonder.inc.php lines 47-71)
  const wonderIncomeMap: Record<string, number> = {
    'Internet':                input.netIncome + hapIncome * 5 * input.citizenCount,
    'Space Program':           input.netIncome + hapIncome * 3 * input.citizenCount,
    'Great Monument':          input.netIncome + hapIncome * 4 * input.citizenCount,
    'Movie Industry':          input.netIncome + hapIncome * 3 * input.citizenCount,
    'Great University':        input.netIncome + hapIncome * 0.002 * input.tech * input.citizenCount,
    'National Research Lab':   input.netIncome + input.citizenIncome * 0.03 * input.citizenCount,
    'Social Security System':  input.netIncome + (input.netIncome * 2) / 28,
    'Disaster Relief Agency':  input.netIncome + input.citizenIncome * 0.03 * input.citizenCount,
    'Great Temple':            input.netIncome + hapIncome * 5 * input.citizenCount,
    'National War Memorial':   input.netIncome + hapIncome * 4 * input.citizenCount,
    'Stock Market':            input.netIncome + 10 * input.taxRate * incomeMod * input.citizenCount,
  };

  // If wonder is owned, projected income = just net income (no gain)
  const projections: WonderProjection[] = WONDERS.map((wonder) => {
    const owned = input.ownedWonders.includes(wonder.name);
    const projectedIncome = owned
      ? input.netIncome
      : (wonderIncomeMap[wonder.name] ?? input.netIncome);
    const incomeGain = projectedIncome - input.netIncome;
    const daysToROI = incomeGain > 0 ? wonder.cost / incomeGain : 0;

    return {
      name: wonder.name,
      projectedIncome,
      incomeGain,
      cost: wonder.cost,
      daysToROI,
      owned,
      isBest: false,
    };
  });

  // Find the best (highest projected income among non-owned)
  let maxIncome = -Infinity;
  let bestIdx = -1;
  projections.forEach((p, idx) => {
    if (!p.owned && p.projectedIncome > maxIncome) {
      maxIncome = p.projectedIncome;
      bestIdx = idx;
    }
  });
  if (bestIdx >= 0) {
    projections[bestIdx].isBest = true;
  }

  return projections;
}
