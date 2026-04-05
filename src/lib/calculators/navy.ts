import { NAVY_VESSELS, NAVY_COST_MODIFIERS, type NavyVesselDef } from '../data/navy';

export interface NavyInput {
  infra: number;
  tech: number;
  land: number;
  shipyards: number;
  drydocks: number;
  activeResources: string[];
}

export interface NavyVesselResult {
  vessel: NavyVesselDef;
  adjustedCost: number;
  adjustedUpkeep: number;
  maxSupported: number;
  meetsRequirements: boolean;
  requirementNote: string;
}

export interface NavyResult {
  vessels: NavyVesselResult[];
  canBuildNavy: boolean;
  dailyPurchaseLimit: number;
}

/**
 * Calculate adjusted cost for a vessel given active resources.
 * Only uranium and microchips apply resource modifiers to specific vessel types.
 * Steel applies to all vessels, oil and lead reduce upkeep for all vessels.
 */
function calculateVesselCost(vessel: NavyVesselDef, activeResources: string[]): number {
  let costMultiplier = 1.0;
  const normalized = activeResources.map((r) => r.toLowerCase());

  for (const [resource, modifiers] of Object.entries(NAVY_COST_MODIFIERS)) {
    if (modifiers.costDiscount > 0 && normalized.includes(resource)) {
      costMultiplier *= 1 - modifiers.costDiscount;
    }
  }

  return vessel.cost * costMultiplier;
}

function calculateVesselUpkeep(vessel: NavyVesselDef, activeResources: string[]): number {
  let upkeepMultiplier = 1.0;
  const normalized = activeResources.map((r) => r.toLowerCase());

  for (const [resource, modifiers] of Object.entries(NAVY_COST_MODIFIERS)) {
    if (modifiers.upkeepDiscount > 0 && normalized.includes(resource)) {
      upkeepMultiplier *= 1 - modifiers.upkeepDiscount;
    }
  }

  return vessel.upkeep * upkeepMultiplier;
}

/**
 * Calculate the maximum number of each vessel type that can be supported.
 * Shipyards support vessels requiring shipyards (+1 supported per shipyard).
 * Drydocks support vessels requiring drydocks (+1 supported per drydock).
 */
function getMaxSupported(vessel: NavyVesselDef, shipyards: number, drydocks: number): number {
  if (vessel.requiresShipyard) return shipyards;
  if (vessel.requiresDrydock) return drydocks;
  return 0;
}

/**
 * Check if the nation meets the requirements for a vessel and return a note.
 */
function checkRequirements(
  vessel: NavyVesselDef,
  infra: number,
  tech: number,
  shipyards: number,
  drydocks: number
): { meetsRequirements: boolean; requirementNote: string } {
  const notes: string[] = [];

  if (infra < vessel.infraRequired) {
    notes.push(`${vessel.infraRequired} infra required (have ${infra})`);
  }
  if (tech < vessel.techRequired) {
    notes.push(`${vessel.techRequired} tech required (have ${tech})`);
  }
  if (vessel.requiresShipyard && shipyards < 1) {
    notes.push('Requires at least 1 Shipyard');
  }
  if (vessel.requiresDrydock && drydocks < 1) {
    notes.push('Requires at least 1 Drydock');
  }

  return {
    meetsRequirements: notes.length === 0,
    requirementNote: notes.join('; '),
  };
}

/**
 * Calculate navy vessel options and limits for a nation.
 */
export function calculateNavy(input: NavyInput): NavyResult {
  const canBuildNavy = input.land >= 1000;

  // Daily purchase limit: base 0 + naval construction yards not tracked here,
  // so this is computed from input (caller should pass in ncyCount if available).
  // Per the spec: dailyPurchaseLimit is returned here based on available data.
  // Standard CN: 1 ship/day base, +1 per Naval Construction Yard. Since NCY
  // count isn't in NavyInput, we compute base limit = 1 (or 0 if can't build).
  // Note: Naval Construction Yards are tracked via improvements, not this input.
  const dailyPurchaseLimit = canBuildNavy ? 1 : 0;

  const vessels: NavyVesselResult[] = NAVY_VESSELS.map((vessel) => {
    const adjustedCost = calculateVesselCost(vessel, input.activeResources);
    const adjustedUpkeep = calculateVesselUpkeep(vessel, input.activeResources);
    const maxSupported = getMaxSupported(vessel, input.shipyards, input.drydocks);
    const { meetsRequirements, requirementNote } = checkRequirements(
      vessel,
      input.infra,
      input.tech,
      input.shipyards,
      input.drydocks
    );

    return {
      vessel,
      adjustedCost,
      adjustedUpkeep,
      maxSupported,
      meetsRequirements,
      requirementNote,
    };
  });

  return {
    vessels,
    canBuildNavy,
    dailyPurchaseLimit,
  };
}
