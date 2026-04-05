import { type ResourceModifier } from '../data/resources';

/**
 * Apply a single modifier based on its direction.
 * discount: (1 - value) — reduces cost
 * bonus: (1 + value) — increases output
 */
export function applyModifier(mod: ResourceModifier): number {
  return mod.direction === 'discount' ? 1 - mod.value : 1 + mod.value;
}

/**
 * Compute the combined modifier from a set of active resource/bonus names.
 * Multiplies all matching modifiers together.
 */
export function computeResourceModifier(
  modifierDefs: Record<string, ResourceModifier>,
  activeNames: string[]
): number {
  let result = 1;
  for (const name of activeNames) {
    const key = name.toLowerCase();
    const def = modifierDefs[key];
    if (def) {
      result *= applyModifier(def);
    }
  }
  return result;
}

/**
 * Linear improvement stacking: (1 - count * rate)
 * Used by factories, labor camps, universities
 */
export function linearImprovementModifier(count: number, rate: number): number {
  return 1 - count * rate;
}

/**
 * Exponential improvement stacking: pow(1 + value, count)
 * Used by clinics, hospitals, border walls, guerilla camps, barracks
 */
export function exponentialImprovementModifier(
  mod: ResourceModifier,
  count: number
): number {
  return Math.pow(applyModifier(mod), count);
}
