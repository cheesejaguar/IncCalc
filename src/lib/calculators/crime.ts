import { CRIME_INDEX_TIERS, type CrimeIndexTier } from '../data/crime';

export interface CrimeInput {
  literacyRate: number;   // percentage, e.g. 85 for 85%
  policeHQ: number;       // count of Police Headquarters
  schools: number;        // count of Schools
  universities: number;   // count of Universities
  taxRate: number;        // percentage, e.g. 28 for 28%
  infra: number;          // current infrastructure level
  citizens: number;       // total citizen count
  jails: number;          // count of Jails (each holds 500 criminals)
  prisons: number;        // count of Prisons (each holds 5000 criminals)
  rehabFacilities: number; // count of Rehabilitation Facilities
  government: string;     // government type name
  laborCamps: number;     // count of Labor Camps (each holds 200 criminals)
}

export interface CrimeResult {
  preventionScore: number;
  tier: CrimeIndexTier;
  criminals: number;
  incarcerated: number;
  happinessEffect: number;
  upkeepModifier: number;
  criminalHappinessPenalty: number;
}

const GOVERNMENT_CRIME_MODIFIERS: Record<string, number> = {
  'Anarchy': -50,
  'Capitalist': 10,
  'Democracy': 20,
  'Monarchy': 40,
  'Communist': 50,
  'Revolutionary Government': 50,
  'Federal Government': 60,
  'Republic': 65,
  'Dictatorship': 75,
  'Totalitarian State': 90,
  'Transitional': 100,
};

/**
 * Calculate the tax crime modifier.
 * 10% tax → 0.40, 15% → 0.35, 20% → 0.30, 25% → 0.25, 30% → 0.20
 * Formula: (50 - taxRate) / 100
 */
function getTaxCrimeMod(taxRate: number): number {
  return Math.max(0, (50 - taxRate) / 100);
}

/**
 * Calculate crime prevention score and related outputs.
 *
 * Prevention score formula:
 *   ((literacyRate / 100) * 80)
 *   + ((policeHQ*1.5 + schools*3 + universities*10) * taxCrimeMod * 12)
 *   + (infra / 100)
 *   + genCrimeMod
 *   + govCrimeMod
 *
 * Where genCrimeMod = max(400 - citizens/500, -200)
 */
export function calculateCrime(input: CrimeInput): CrimeResult {
  const taxCrimeMod = getTaxCrimeMod(input.taxRate);
  const genCrimeMod = Math.max(400 - input.citizens / 500, -200);
  const govCrimeMod = GOVERNMENT_CRIME_MODIFIERS[input.government] ?? 0;

  const preventionScore =
    (input.literacyRate / 100) * 80 +
    (input.policeHQ * 1.5 + input.schools * 3 + input.universities * 10) *
      taxCrimeMod *
      12 +
    input.infra / 100 +
    genCrimeMod +
    govCrimeMod;

  // Find the highest tier where preventionScore >= minScore
  // CRIME_INDEX_TIERS is ordered best-first (highest minScore first)
  let tier: CrimeIndexTier = CRIME_INDEX_TIERS[CRIME_INDEX_TIERS.length - 1];
  for (const t of CRIME_INDEX_TIERS) {
    if (preventionScore >= t.minScore) {
      tier = t;
      break;
    }
  }

  const criminals = Math.floor(input.citizens * tier.criminalPercent);

  const jailCapacity = input.jails * 500;
  const prisonCapacity = input.prisons * 5000;
  const laborCampCapacity = input.laborCamps * 200;
  const totalCapacity = jailCapacity + prisonCapacity + laborCampCapacity;
  const incarcerated = Math.min(criminals, totalCapacity);

  const unincarcerated = criminals - incarcerated;
  // Criminal happiness penalty: -(max(0, unincarcerated - 200) / 2000), capped at -5
  const criminalHappinessPenalty = Math.max(
    -5,
    -(Math.max(0, unincarcerated - 200) / 2000)
  );

  return {
    preventionScore,
    tier,
    criminals,
    incarcerated,
    happinessEffect: tier.happinessEffect,
    upkeepModifier: tier.upkeepModifier,
    criminalHappinessPenalty,
  };
}
