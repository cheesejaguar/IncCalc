import { RESOURCE_LAND_COST_DISCOUNTS } from '../data/resources';

export interface LandInput {
  currentLand: number;
  purchaseAmount: number;
  peakLand: number;      // highest land ever owned (for rebuy discount)
  activeResources: string[];
}

export interface LandResult {
  totalCost: number;
  costPerLevel: number;
  modifier: number;
  peakRebuyApplied: boolean;
}

/**
 * K-value lookup for land cost.
 * Cost formula per unit: K * currentLand + basePrice (base = 400)
 */
function getLandK(land: number): number {
  if (land < 20)    return 0.5;
  if (land < 30)    return 1.0;
  if (land < 100)   return 2.0;
  if (land < 200)   return 3.0;
  if (land < 500)   return 5.0;
  if (land < 1000)  return 8.0;
  if (land < 2000)  return 15.0;
  if (land < 3000)  return 25.0;
  if (land < 4000)  return 35.0;
  if (land < 5000)  return 45.0;
  if (land < 8000)  return 55.0;
  return 70.0;
}

const LAND_BASE_PRICE = 400;

/**
 * Compute combined resource modifier for land purchase cost.
 * Discounts: Cattle -10%, Fish -5%, Rubber -10% (multiplicative).
 */
function computeLandResourceModifier(activeResources: string[]): number {
  let modifier = 1;
  for (const resource of activeResources) {
    const key = resource.toLowerCase();
    const discount = RESOURCE_LAND_COST_DISCOUNTS[key];
    if (discount != null) {
      modifier *= 1 - discount;
    }
  }
  return modifier;
}

/**
 * Calculate total land purchase cost.
 *
 * Cost formula per unit: modifier * (K * currentLand + 400)
 * Peak rebuy discount: 50% off for land up to peakLand if currentLand < peakLand.
 * Purchases are calculated in blocks of 10 with K updated at tier boundaries.
 */
export function calculateLandCost(input: LandInput): LandResult {
  const modifier = computeLandResourceModifier(input.activeResources);
  const peakRebuyApplied = input.currentLand < input.peakLand;

  const stepSize = 10;
  const steps = Math.floor(input.purchaseAmount / stepSize);
  const remaining = input.purchaseAmount - steps * stepSize;

  let totalCost = 0;
  let currentLand = input.currentLand;

  function unitCost(land: number, inRebuy: boolean): number {
    const k = getLandK(land);
    const base = modifier * (k * land + LAND_BASE_PRICE);
    return inRebuy ? base * 0.5 : base;
  }

  // Buy in blocks of 10
  for (let i = 0; i < steps; i++) {
    const inRebuy = peakRebuyApplied && currentLand < input.peakLand;
    const k = getLandK(currentLand);
    const base = modifier * (k * currentLand + LAND_BASE_PRICE);
    totalCost += stepSize * (inRebuy ? base * 0.5 : base);
    currentLand += stepSize;
  }

  // Remaining units < 10
  if (remaining > 0) {
    const inRebuy = peakRebuyApplied && currentLand < input.peakLand;
    const k = getLandK(currentLand);
    const base = modifier * (k * currentLand + LAND_BASE_PRICE);
    totalCost += remaining * (inRebuy ? base * 0.5 : base);
  }

  // costPerLevel: cost of first unit at current land level
  const firstUnitInRebuy = peakRebuyApplied && input.currentLand < input.peakLand;
  const costPerLevel = unitCost(input.currentLand, firstUnitInRebuy);

  return {
    totalCost,
    costPerLevel,
    modifier,
    peakRebuyApplied,
  };
}

export { getLandK };
