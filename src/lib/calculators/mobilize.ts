import type { MobilizeInput, MobilizeResult } from '../types';
import { MILITARY_MODIFIERS, MILITARY_IMPROVEMENT_MODIFIERS } from '../data/resources';
import { computeResourceModifier, exponentialImprovementModifier } from './modifiers';

/**
 * Calculate military mobilization costs and limits.
 * Ported from mobilize.class.php.
 *
 * Max soldiers = (citizens * 0.8 - currentSoldiers) / modifier
 * Max tanks = 0.1 * 0.8 * citizens - currentTanks
 *
 * Soldier base cost: $8, minus $3 for iron, minus $3 for oil
 * Tank base cost: $96, * 0.92 if lead
 *
 * Improvement stacking: guerilla camps and barracks use exponential pow()
 */
export function calculateMobilize(input: MobilizeInput): MobilizeResult {
  // Compute resource modifier for soldier count
  let modifier = computeResourceModifier(MILITARY_MODIFIERS, input.activeResources);

  // Apply improvement modifiers (exponential stacking)
  modifier *= exponentialImprovementModifier(
    MILITARY_IMPROVEMENT_MODIFIERS.gcamp,
    input.guerillaCamps
  );
  modifier *= exponentialImprovementModifier(
    MILITARY_IMPROVEMENT_MODIFIERS.barr,
    input.barracks
  );

  // Max soldiers purchasable
  const maxSoldiers = (input.citizens * 0.8 - input.currentSoldiers) / modifier;

  // Soldier cost: base $8, -$3 for iron, -$3 for oil
  let soldierCost = 8;
  const lowerRes = input.activeResources.map((r) => r.toLowerCase());
  if (lowerRes.includes('iron')) soldierCost -= 3;
  if (lowerRes.includes('oil')) soldierCost -= 3;

  // Max tanks
  const maxTanks = 0.1 * 0.8 * input.citizens - input.currentTanks;

  // Tank cost: base $96, * 0.92 if lead
  let tankCost = 96;
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
