import {
  CRUISE_MISSILE,
  NUCLEAR_WEAPON,
  AIRCRAFT_COST_MODIFIERS,
  AIRCRAFT_UPKEEP_MODIFIERS,
} from '../data/aircraft';

export interface EquipmentInput {
  activeResources: string[];
  existingNukes: number;
  factories: number;
  airports: number;
  hasConstruction: boolean;    // Construction bonus resource
  hasForeignAirBase: boolean;  // Foreign Air Force Base wonder
}

export interface EquipmentResult {
  aircraftCostModifier: number;       // multiplier (< 1 means discount)
  aircraftUpkeepModifier: number;     // multiplier (< 1 means discount)
  aircraftLimit: number;
  cruiseMissileCost: number;
  nukeCost: number;
  nukeUpkeep: number;
}

/**
 * Calculate equipment (aircraft, cruise missiles, nukes) costs and limits.
 *
 * Aircraft cost modifier: base resources (aluminum -8%, oil -4%, rubber -4%) × airport -2% each
 * Aircraft upkeep modifier: lead -25%, airport -2% each
 * Aircraft limit: 50 base + 10 construction + 20 foreign air force base
 * Cruise missile cost: $20K × (1 - 0.05 × factories), × 0.80 if lead
 * Nuke cost: $500K × (1 + 0.10 × existingNukes), × 0.80 if lead
 * Nuke upkeep: $5K × (1 + 0.10 × existingNukes), × 2 if no uranium
 */
export function calculateEquipment(input: EquipmentInput): EquipmentResult {
  const normalized = input.activeResources.map((r) => r.toLowerCase());

  // --- Aircraft cost modifier ---
  let aircraftCostModifier = 1.0;
  for (const [resource, discount] of Object.entries(AIRCRAFT_COST_MODIFIERS)) {
    if (normalized.includes(resource)) {
      aircraftCostModifier *= 1 - discount;
    }
  }
  // Airport: -2% per airport
  for (let i = 0; i < input.airports; i++) {
    aircraftCostModifier *= 1 - 0.02;
  }

  // --- Aircraft upkeep modifier ---
  let aircraftUpkeepModifier = 1.0;
  for (const [resource, discount] of Object.entries(AIRCRAFT_UPKEEP_MODIFIERS)) {
    if (normalized.includes(resource)) {
      aircraftUpkeepModifier *= 1 - discount;
    }
  }
  // Airport: -2% per airport
  for (let i = 0; i < input.airports; i++) {
    aircraftUpkeepModifier *= 1 - 0.02;
  }

  // --- Aircraft limit ---
  let aircraftLimit = 50;
  if (input.hasConstruction) aircraftLimit += 10;
  if (input.hasForeignAirBase) aircraftLimit += 20;

  // --- Cruise missile cost ---
  // $20K base × (1 - 0.05 × factories), × 0.80 if lead resource active
  let cruiseMissileCost = CRUISE_MISSILE.baseCost * (1 - 0.05 * input.factories);
  if (normalized.includes('lead')) {
    cruiseMissileCost *= 0.80;
  }

  // --- Nuke cost ---
  // $500K × (1 + 0.10 × existingNukes), × 0.80 if lead
  let nukeCost = NUCLEAR_WEAPON.baseCost * (1 + 0.10 * input.existingNukes);
  if (normalized.includes('lead')) {
    nukeCost *= 0.80;
  }

  // --- Nuke upkeep ---
  // $5K × (1 + 0.10 × existingNukes), × 2 if no uranium
  let nukeUpkeep = NUCLEAR_WEAPON.baseUpkeep * (1 + 0.10 * input.existingNukes);
  if (!normalized.includes('uranium')) {
    nukeUpkeep *= 2;
  }

  return {
    aircraftCostModifier,
    aircraftUpkeepModifier,
    aircraftLimit,
    cruiseMissileCost,
    nukeCost,
    nukeUpkeep,
  };
}
