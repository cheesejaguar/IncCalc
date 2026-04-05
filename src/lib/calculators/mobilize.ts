import type { MobilizeInput, MobilizeResult } from '../types';
import { MILITARY_MODIFIERS, MILITARY_IMPROVEMENT_MODIFIERS } from '../data/resources';
import { DEFCON_LEVELS } from '../data/defcon';
import { computeResourceModifier, exponentialImprovementModifier } from './modifiers';

/**
 * Calculate military mobilization costs and limits.
 *
 * Max soldiers = (citizens * 0.8 - currentSoldiers) / modifier
 * Max tanks = min(effectiveSoldiers * 0.1, citizens * 0.08) - currentTanks
 *   where effectiveSoldiers = currentSoldiers + max(0, maxSoldiers)
 *
 * Soldier base cost: $8, modified by DEFCON, minus $3 for iron, minus $3 for oil
 * Tank cost: soldierCost × 40, * (1 - 0.10 * factories) for factory discount, * 0.92 if lead
 */
export function calculateMobilize(input: MobilizeInput): MobilizeResult {
  let modifier = computeResourceModifier(MILITARY_MODIFIERS, input.activeResources);

  modifier *= exponentialImprovementModifier(
    MILITARY_IMPROVEMENT_MODIFIERS.gcamp,
    input.guerillaCamps
  );
  modifier *= exponentialImprovementModifier(
    MILITARY_IMPROVEMENT_MODIFIERS.barr,
    input.barracks
  );

  const maxSoldiers = (input.citizens * 0.8 - input.currentSoldiers) / modifier;

  // DEFCON modifier on soldier cost
  const defconData = DEFCON_LEVELS[input.defcon] ?? DEFCON_LEVELS[5];
  const defconCostMod = defconData.soldierCostModifier;

  // Soldier cost: base $8, apply DEFCON, then resource discounts
  let soldierCost = 8 * defconCostMod;
  const lowerRes = input.activeResources.map((r) => r.toLowerCase());
  if (lowerRes.includes('iron')) soldierCost -= 3;
  if (lowerRes.includes('oil')) soldierCost -= 3;
  soldierCost = Math.max(soldierCost, 0);

  // Max tanks: min(effectiveSoldiers * 10%, citizens * 8%) - currentTanks
  const effectiveSoldiers = input.currentSoldiers + Math.max(0, maxSoldiers);
  const maxTanks = Math.min(effectiveSoldiers * 0.1, input.citizens * 0.08) - input.currentTanks;

  // Tank cost: soldierCost × 40, factory discount -10% per factory (up to 5), then lead -8%
  let tankCost = soldierCost * 40;
  if (input.factories > 0) {
    tankCost *= (1 - 0.10 * input.factories);
  }
  if (lowerRes.includes('lead')) tankCost *= 0.92;

  return {
    maxSoldiers: Math.max(0, maxSoldiers),
    soldierCost,
    totalSoldierCost: Math.max(0, maxSoldiers) * soldierCost,
    maxTanks: Math.max(0, maxTanks),
    tankCost,
    totalTankCost: Math.max(0, maxTanks) * tankCost,
    modifier,
  };
}
