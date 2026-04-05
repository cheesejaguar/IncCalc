import type { WonderProjection } from '../types';
import { WONDERS, getWonderActualCost } from '../data/wonders';

interface WonderAdvisorInput {
  citizenCount: number;
  citizenIncome: number;
  netIncome: number;
  happiness: number;
  tech: number;
  taxRate: number; // as decimal, e.g. 0.28
  nationStrength: number;
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

  // If wonder is owned, projected income = just net income (no gain)
  const projections: WonderProjection[] = WONDERS.map((wonder) => {
    const owned = input.ownedWonders.includes(wonder.name);

    let projectedIncome: number;
    if (owned) {
      projectedIncome = input.netIncome;
    } else {
      // Special cases
      if (wonder.name === 'Great University') {
        // Happiness based on tech level: +0.2% of tech level
        const hapGain = hapIncome * 0.002 * input.tech * input.citizenCount;
        projectedIncome = input.netIncome + hapGain;
      } else if (wonder.name === 'Social Security System') {
        // Allows raising tax by ~2% (from 28% to 30%), gains ~2/28 of net income
        projectedIncome = input.netIncome + (input.netIncome * 2) / 28;
      } else if (wonder.name === 'Stock Market') {
        // +$10 citizen income bonus (citizenIncomeBonus = 10)
        projectedIncome = input.netIncome + wonder.citizenIncomeBonus * input.taxRate * input.citizenCount;
      } else if (wonder.name === 'Mining Industry Consortium') {
        // +$2 income for each of Coal/Lead/Oil/Uranium resources owned (assume 2 on average)
        projectedIncome = input.netIncome + 2 * 2 * input.taxRate * input.citizenCount;
      } else {
        // Generic formula from WonderDef properties
        let income = input.netIncome;
        if (wonder.happinessEffect > 0) {
          income += hapIncome * wonder.happinessEffect * input.citizenCount;
        }
        if (wonder.populationEffect > 0) {
          income += input.citizenIncome * (input.citizenCount * wonder.populationEffect);
        }
        if (wonder.citizenIncomeBonus > 0) {
          income += wonder.citizenIncomeBonus * input.taxRate * input.citizenCount;
        }
        if (wonder.infraUpkeepDiscount > 0) {
          income += input.netIncome * wonder.infraUpkeepDiscount * 0.5;
        }
        projectedIncome = income;
      }
    }

    const incomeGain = projectedIncome - input.netIncome;
    const actualCost = getWonderActualCost(wonder, input.nationStrength ?? 0, input.tech);
    const daysToROI = incomeGain > 0 ? actualCost / incomeGain : 0;

    return {
      name: wonder.name,
      projectedIncome,
      incomeGain,
      cost: actualCost,
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
