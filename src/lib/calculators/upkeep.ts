import type { UpkeepInput, UpkeepResult } from '../types';
import { UPKEEP_MODIFIERS } from '../data/resources';
import { computeResourceModifier, linearImprovementModifier } from './modifiers';

/**
 * K-value lookup table for upkeep cost.
 * Ported from upkeep.class.php updateK() lines 138-169.
 */
function getUpkeepK(infra: number): number {
  if (infra < 30)   return 0;
  if (infra < 40)   return 0.01;
  if (infra < 60)   return 0.02;
  if (infra < 80)   return 0.03;
  if (infra < 140)  return 0.04;
  if (infra < 200)  return 0.05;
  if (infra < 300)  return 0.06;
  if (infra < 500)  return 0.07;
  if (infra < 700)  return 0.08;
  if (infra < 1000) return 0.09;
  if (infra < 2000) return 0.11;
  if (infra < 3000) return 0.13;
  if (infra < 4000) return 0.15;
  if (infra < 5000) return 0.17;
  if (infra < 8000) return 0.1725;
  return 0.175;
}

/**
 * Compute the upkeep modifier.
 * mod = resourceMods * laborCampMod * techMod
 *
 * Labor camp: linear (1 - numCamps * 0.1)
 * Tech reduction: max(1 - 2*tech/nationStrength, 0.90)
 */
function computeUpkeepModifier(input: UpkeepInput): number {
  // Resource modifiers
  let modifier = computeResourceModifier(UPKEEP_MODIFIERS, input.activeResources);

  // Labor camp modifier: linear stacking
  modifier *= linearImprovementModifier(input.laborCamps, 0.1);

  // Tech reduction: max(1 - 2*tech/NS, 0.90)
  const ns = input.nationStrength || 1;
  modifier *= Math.max(1 - (2 * input.tech) / ns, 0.90);

  // Wonder modifiers
  if (input.ownedWonders) {
    if (input.ownedWonders.includes('Moon Base')) modifier *= 0.96;
    if (input.ownedWonders.includes('Mars Base')) modifier *= 0.97;
    if (input.ownedWonders.includes('National Environment Office')) modifier *= 0.97;
    if (input.ownedWonders.includes('Nuclear Power Plant')) modifier *= 0.95;
  }

  return modifier;
}

/**
 * Calculate upkeep cost per infrastructure level.
 * Ported from upkeep.class.php.
 *
 * Cost per level = modifier * (K * infra + 20)
 */
export function calculateUpkeep(input: UpkeepInput): UpkeepResult {
  const modifier = computeUpkeepModifier(input);

  const kBefore = getUpkeepK(input.currentInfra);
  const costPerLevel = modifier * (kBefore * input.currentInfra + 20);
  const totalBillBefore = costPerLevel * input.currentInfra;

  const newInfra = input.currentInfra + input.purchaseAmount;
  const kAfter = getUpkeepK(newInfra);
  const costPerLevelAfter = modifier * (kAfter * newInfra + 20);
  const totalBillAfter = costPerLevelAfter * newInfra;

  return {
    costPerLevel,
    costPerLevelAfter,
    totalBillBefore,
    totalBillAfter,
    billIncrease: totalBillAfter - totalBillBefore,
    modifier,
  };
}

export { getUpkeepK };
