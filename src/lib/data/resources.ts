export const ALL_RESOURCES = [
  'Aluminum', 'Coal', 'Gold', 'Iron', 'Lead', 'Lumber',
  'Marble', 'Oil', 'Rubber', 'Uranium', 'Water', 'Wheat',
  'Cattle', 'Fish', 'Furs', 'Gems', 'Pigs', 'Silver',
  'Spices', 'Sugar', 'Wine',
] as const;

export type ResourceName = typeof ALL_RESOURCES[number];

// Bonus resources that come from having certain resource combos
export const BONUS_RESOURCES = [
  'Asphalt', 'Automobiles', 'Beer', 'Construction', 'Fine Jewelry',
  'Interstate', 'Microchips', 'Radiation Cleanup', 'Scholar',
  'Steel',
] as const;

export type BonusResourceName = typeof BONUS_RESOURCES[number];

// Modifier definitions per calculator type
export type ModifierDirection = 'discount' | 'bonus';

export interface ResourceModifier {
  name: string;
  value: number;
  direction: ModifierDirection;
}

// Infrastructure cost modifiers (discount = multiply by 1 - value)
export const INFRA_MODIFIERS: Record<string, ResourceModifier> = {
  aluminum:     { name: 'Aluminum',     value: 0.07, direction: 'discount' },
  coal:         { name: 'Coal',         value: 0.04, direction: 'discount' },
  iron:         { name: 'Iron',         value: 0.05, direction: 'discount' },
  lumber:       { name: 'Lumber',       value: 0.06, direction: 'discount' },
  marble:       { name: 'Marble',       value: 0.10, direction: 'discount' },
  rubber:       { name: 'Rubber',       value: 0.03, direction: 'discount' },
  construction: { name: 'Construction', value: 0.05, direction: 'discount' },
  steel:        { name: 'Steel',        value: 0.02, direction: 'discount' },
  government:   { name: 'Government',   value: 0.05, direction: 'discount' },
  interstate:   { name: 'Interstate',   value: 0.08, direction: 'discount' },
};

// Population growth modifiers (bonus = multiply by 1 + value)
export const POPULATION_MODIFIERS: Record<string, ResourceModifier> = {
  cattle: { name: 'Cattle', value: 0.05,   direction: 'bonus' },
  fish:   { name: 'Fish',   value: 0.08,   direction: 'bonus' },
  pigs:   { name: 'Pigs',   value: 0.035,  direction: 'bonus' },
  sugar:  { name: 'Sugar',  value: 0.03,   direction: 'bonus' },
  wheat:  { name: 'Wheat',  value: 0.08,   direction: 'bonus' },
};

// Population improvement modifiers (used with exponential stacking)
export const POPULATION_IMPROVEMENT_MODIFIERS: Record<string, ResourceModifier> = {
  clinic:   { name: 'Clinic',       value: 0.02,  direction: 'bonus' },
  hospital: { name: 'Hospital',     value: 0.06,  direction: 'bonus' },
  walls:    { name: 'Border Walls', value: -0.02, direction: 'bonus' },
};

// Upkeep cost modifiers (discount = multiply by 1 - value)
export const UPKEEP_MODIFIERS: Record<string, ResourceModifier> = {
  iron:       { name: 'Iron',       value: 0.10, direction: 'discount' },
  lumber:     { name: 'Lumber',     value: 0.08, direction: 'discount' },
  uranium:    { name: 'Uranium',    value: 0.03, direction: 'discount' },
  asphalt:    { name: 'Asphalt',    value: 0.05, direction: 'discount' },
  interstate: { name: 'Interstate', value: 0.08, direction: 'discount' },
};

// Tech cost modifiers (discount = multiply by 1 - value)
export const TECH_MODIFIERS: Record<string, ResourceModifier> = {
  gold:       { name: 'Gold',             value: 0.05, direction: 'discount' },
  microchips: { name: 'Microchips',       value: 0.08, direction: 'discount' },
  univ:       { name: 'University',       value: 0.10, direction: 'discount' },
  greatuniv:  { name: 'Great University', value: 0.10, direction: 'discount' },
  space:      { name: 'Space Program',    value: 0.03, direction: 'discount' },
  rlab:       { name: 'Research Lab',     value: 0.03, direction: 'discount' },
};

// Military modifiers (bonus = multiply by 1 + value, increases unit count)
export const MILITARY_MODIFIERS: Record<string, ResourceModifier> = {
  aluminum:   { name: 'Aluminum',   value: 0.20, direction: 'bonus' },
  coal:       { name: 'Coal',       value: 0.08, direction: 'bonus' },
  iron:       { name: 'Iron',       value: 0,    direction: 'bonus' },
  lead:       { name: 'Lead',       value: 0,    direction: 'bonus' },
  oil:        { name: 'Oil',        value: 0.10, direction: 'bonus' },
  pigs:       { name: 'Pigs',       value: 0.15, direction: 'bonus' },
  government: { name: 'Government', value: 0.08, direction: 'bonus' },
};

// Military improvement modifiers (exponential stacking)
export const MILITARY_IMPROVEMENT_MODIFIERS: Record<string, ResourceModifier> = {
  gcamp: { name: 'Guerilla Camps', value: 0.35, direction: 'bonus' },
  barr:  { name: 'Barracks',       value: 0.10, direction: 'bonus' },
};

// Governments that qualify for infrastructure cost -5% modifier
export const GOVERNMENT_INFRA_ELIGIBLE = [
  'Capitalist', 'Dictatorship', 'Federal Government',
  'Monarchy', 'Republic', 'Revolutionary Government',
];

// Governments that qualify for soldier efficiency +8% modifier
export const GOVERNMENT_MILITARY_ELIGIBLE = [
  'Communist', 'Democracy', 'Dictatorship',
  'Federal Government', 'Transitional',
];
