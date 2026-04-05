import type { PopulationInput, PopulationResult } from '../types';
import {
  POPULATION_MODIFIERS,
  POPULATION_IMPROVEMENT_MODIFIERS,
} from '../data/resources';
import { computeResourceModifier, exponentialImprovementModifier } from './modifiers';

/**
 * Calculate population gain from infrastructure purchase.
 * Ported from population.class.php.
 *
 * Citizens gained = modifier * 7.5 * infraPurchased
 * Total citizens = modifier * (7.5 * infra + 0.28 * land + 20) when no existing data
 *                  OR existingCitizens + gained
 *
 * Improvement stacking (exponential):
 *   clinicMod  = pow(1.02, numClinics)
 *   wallMod    = pow(0.98, numWalls)     [note: -0.02 bonus → 1 + (-0.02) = 0.98]
 *   hospMod    = pow(1.06, numHospitals)
 */
export function calculatePopulation(input: PopulationInput): PopulationResult {
  // Compute resource modifier
  let modifier = computeResourceModifier(POPULATION_MODIFIERS, input.activeResources);

  // Apply improvement modifiers (exponential stacking)
  modifier *= exponentialImprovementModifier(
    POPULATION_IMPROVEMENT_MODIFIERS.clinic,
    input.clinics
  );
  modifier *= exponentialImprovementModifier(
    POPULATION_IMPROVEMENT_MODIFIERS.walls,
    input.walls
  );
  modifier *= exponentialImprovementModifier(
    POPULATION_IMPROVEMENT_MODIFIERS.hospital,
    input.hospitals
  );

  // Citizens gained from purchase
  const citizensGained = modifier * 7.5 * input.purchaseAmount;

  // Total citizens after purchase
  let totalCitizens: number;
  if (input.existingCitizens === 0) {
    totalCitizens =
      modifier * (7.5 * input.currentInfra + 0.28 * input.land + 20);
  } else {
    totalCitizens = input.existingCitizens;
  }
  totalCitizens += citizensGained;

  return {
    citizensGained,
    totalCitizens,
    modifier,
  };
}

/**
 * Calculate infra needed to gain N citizens.
 * Ported from population.class.php getInfraGain().
 */
export function infraNeededForCitizens(
  citizensWanted: number,
  input: Omit<PopulationInput, 'purchaseAmount' | 'currentInfra'>
): number {
  if (citizensWanted <= 0) return 0;

  let modifier = computeResourceModifier(POPULATION_MODIFIERS, input.activeResources);
  modifier *= exponentialImprovementModifier(
    POPULATION_IMPROVEMENT_MODIFIERS.clinic,
    input.clinics
  );
  modifier *= exponentialImprovementModifier(
    POPULATION_IMPROVEMENT_MODIFIERS.walls,
    input.walls
  );
  modifier *= exponentialImprovementModifier(
    POPULATION_IMPROVEMENT_MODIFIERS.hospital,
    input.hospitals
  );

  return citizensWanted / modifier / 7.5;
}
