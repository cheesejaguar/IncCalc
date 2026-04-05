export interface MilitaryEquipmentDef {
  name: string;
  baseCost: number;
  baseUpkeep: number;
  description: string;
}

export const CRUISE_MISSILE: MilitaryEquipmentDef = {
  name: 'Cruise Missile',
  baseCost: 20000,
  baseUpkeep: 200,
  description: 'Base damage: 10 tanks, 1 tech, 5 infra.',
};

export const NUCLEAR_WEAPON: MilitaryEquipmentDef = {
  name: 'Nuclear Weapon',
  baseCost: 500000,
  baseUpkeep: 5000,
  description: 'Massive damage. +10% cost per existing nuke. +10% upkeep per nuke owned.',
};

export const AIRCRAFT_COST_MODIFIERS: Record<string, number> = {
  aluminum: 0.08,
  oil: 0.04,
  rubber: 0.04,
};

export const AIRCRAFT_UPKEEP_MODIFIERS: Record<string, number> = {
  lead: 0.25,
};
