import type { InfraInput, InfraResult } from '../types';
import { INFRA_MODIFIERS } from '../data/resources';
import { computeResourceModifier, linearImprovementModifier } from './modifiers';

/**
 * K-value lookup table for infrastructure cost.
 * Ported from infra.class.php updateK() lines 141-166.
 */
function getInfraK(infra: number): number {
  if (infra < 20)   return 0;
  if (infra < 30)   return 2;
  if (infra < 40)   return 5;
  if (infra < 50)   return 8;
  if (infra < 60)   return 10;
  if (infra < 150)  return 12;
  if (infra < 300)  return 15;
  if (infra < 1000) return 20;
  if (infra < 3000) return 25;
  if (infra < 4000) return 30;
  if (infra < 5000) return 40;
  if (infra < 8000) return 60;
  return 70;
}

/**
 * Calculate total infrastructure purchase cost.
 * Ported from infra.class.php getCost() lines 99-126.
 *
 * Cost formula: modifier * (K * currentInfra + 500) per unit
 * Purchases are calculated in blocks of 10 with K updated at each step.
 * Factory modifier: linear (1 - numFactories * 0.08)
 * Resource modifiers: multiplicative discounts
 */
export function calculateInfraCost(input: InfraInput): InfraResult {
  // Compute resource modifier
  let modifier = computeResourceModifier(INFRA_MODIFIERS, input.activeResources);

  // Apply factory modifier (linear stacking)
  modifier *= linearImprovementModifier(input.factories, 0.08);

  // Wonder modifiers
  if (input.ownedWonders) {
    if (input.ownedWonders.includes('Moon Base')) modifier *= 0.96;
    if (input.ownedWonders.includes('Mars Base')) modifier *= 0.97;
    // Scientific Development Center buffs factory discount from 8% to 10% per factory
    if (input.ownedWonders.includes('Scientific Development Center') && input.factories > 0) {
      const normalFactory = 1 - input.factories * 0.08;
      const sdcFactory = 1 - input.factories * 0.10;
      if (normalFactory > 0) modifier *= sdcFactory / normalFactory;
    }
  }

  const stepSize = 10;
  const steps = Math.floor(input.purchaseAmount / stepSize);
  let totalCost = 0;
  let currentInfra = input.currentInfra;

  // Buy in blocks of 10
  for (let i = 0; i < steps; i++) {
    const k = getInfraK(currentInfra);
    totalCost += stepSize * (modifier * (k * currentInfra + 500));
    currentInfra += stepSize;
  }

  // Remaining units < 10
  const remaining = input.purchaseAmount - steps * 10;
  if (remaining > 0) {
    const k = getInfraK(currentInfra);
    totalCost += remaining * (modifier * (k * currentInfra + 500));
  }

  return {
    totalCost,
    modifier,
    kValue: getInfraK(input.currentInfra),
  };
}

/** Get the cost of 1 unit of infra at a given level with modifiers */
export function getInfraUnitCost(
  infra: number,
  factories: number,
  activeResources: string[]
): number {
  let modifier = computeResourceModifier(INFRA_MODIFIERS, activeResources);
  modifier *= linearImprovementModifier(factories, 0.08);
  const k = getInfraK(infra);
  return modifier * (k * infra + 500);
}

export { getInfraK };
