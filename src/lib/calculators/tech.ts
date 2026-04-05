import type { TechInput, TechResult } from '../types';
import { TECH_MODIFIERS } from '../data/resources';
import { computeResourceModifier, linearImprovementModifier } from './modifiers';

/**
 * Base cost lookup for technology.
 * Ported from tech.class.php updateBase() lines 140-166.
 * Base cost = 100 * currentTech + kval
 */
function getTechBaseCost(tech: number): number {
  let kval: number;
  if (tech < 5)    kval = 10000;
  else if (tech < 8)    kval = 12000;
  else if (tech < 10)   kval = 13000;
  else if (tech < 15)   kval = 14000;
  else if (tech < 30)   kval = 16000;
  else if (tech < 50)   kval = 18000;
  else if (tech < 75)   kval = 20000;
  else if (tech < 100)  kval = 22000;
  else if (tech < 150)  kval = 24000;
  else if (tech < 200)  kval = 26000;
  else if (tech < 250)  kval = 30000;
  else                   kval = 40000;

  return 100 * tech + kval;
}

/**
 * Calculate technology purchase cost.
 * Ported from tech.class.php getCostFor() lines 108-131.
 *
 * Purchases in blocks of 10, with base cost updated at each step.
 * University modifier: linear (1 - 0.1 * numUniversities)
 * Final total multiplied by 1.5.
 */
export function calculateTechCost(input: TechInput): TechResult {
  // Compute resource modifier
  let modifier = computeResourceModifier(TECH_MODIFIERS, input.activeResources);

  // Apply university modifier (linear stacking)
  modifier *= linearImprovementModifier(input.universities, 0.1);

  const stepSize = 10;
  const steps = Math.floor(input.purchaseAmount / stepSize);
  let totalCost = 0;
  let currentTech = input.currentTech;

  // Buy in blocks of 10
  for (let i = 0; i < steps; i++) {
    const baseCost = getTechBaseCost(currentTech);
    totalCost += stepSize * (modifier * baseCost);
    currentTech += stepSize;
  }

  // Remaining units < 10
  const remaining = input.purchaseAmount - steps * 10;
  if (remaining > 0) {
    const baseCost = getTechBaseCost(currentTech);
    totalCost += remaining * (modifier * baseCost);
  }

  // Final 1.5x multiplier
  totalCost *= 1.5;

  // Cost per level at current tech
  const costPerLevel = modifier * getTechBaseCost(input.currentTech) * 1.5;

  return {
    totalCost,
    costPerLevel,
    modifier,
  };
}

export { getTechBaseCost };
