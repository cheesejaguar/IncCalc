export const ALL_RESOURCES = [
  'Aluminum', 'Coal', 'Gold', 'Iron', 'Lead', 'Lumber',
  'Marble', 'Oil', 'Rubber', 'Uranium', 'Water', 'Wheat',
  'Cattle', 'Fish', 'Furs', 'Gems', 'Pigs', 'Silver',
  'Spices', 'Sugar', 'Wine',
] as const;

export type ResourceName = typeof ALL_RESOURCES[number];

// Bonus resources that come from having certain resource combos
export const BONUS_RESOURCES = [
  'Affluent Population', 'Asphalt', 'Automobiles', 'Beer', 'Construction',
  'Fast Food', 'Fine Jewelry', 'Interstate', 'Microchips',
  'Radiation Cleanup', 'Scholar', 'Steel',
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

// Citizen daily income bonuses from resources (flat $ per citizen per day)
export const RESOURCE_INCOME_BONUSES: Record<string, number> = {
  furs: 3.50,
  gems: 1.50,
  gold: 3.00,
  silver: 2.00,
  scholar: 3.00,
};

// Happiness bonuses from resources
export const RESOURCE_HAPPINESS_BONUSES: Record<string, number> = {
  gems: 2.5,
  oil: 1.5,
  silver: 2.0,
  spices: 2.0,
  sugar: 1.0,
  water: 2.5,
  wine: 3.0,
  automobiles: 3.0,
  beer: 2.0,
  'fast food': 2.0,
  'fine jewelry': 3.0,
  microchips: 2.0,
};

// Purchased land area bonuses from resources
export const RESOURCE_LAND_BONUSES: Record<string, number> = {
  coal: 0.15,
  rubber: 0.20,
  spices: 0.08,
};

// Land purchase cost discounts
export const RESOURCE_LAND_COST_DISCOUNTS: Record<string, number> = {
  cattle: 0.10,
  fish: 0.05,
  rubber: 0.10,
};

// Soldier upkeep cost reductions (flat $ per soldier per day)
export const RESOURCE_SOLDIER_UPKEEP_DISCOUNTS: Record<string, number> = {
  lead: 0.50,
  pigs: 0.50,
};

// Population growth bonuses from bonus resources
export const BONUS_POPULATION_MODIFIERS: Record<string, ResourceModifier> = {
  'affluent population': { name: 'Affluent Population', value: 0.05, direction: 'bonus' },
};

// Moon/Mars bonus resources
export const MOON_MARS_RESOURCES = [
  'Basalt', 'Calcium', 'Magnesium', 'Potassium',
  'Radon', 'Silicon', 'Sodium', 'Titanium',
] as const;

// Moon/Mars resource effects (conditional on other resources/bonuses)
export const MOON_MARS_EFFECTS: Record<string, { condition: string; effect: string; happinessBonus?: number; infraCostDiscount?: number; infraUpkeepDiscount?: number; citizenIncomeBonus?: number }[]> = {
  'Basalt': [
    { condition: 'Automobiles', effect: '+3 happiness', happinessBonus: 3 },
    { condition: 'Asphalt', effect: '-5% infra upkeep', infraUpkeepDiscount: 0.05 },
    { condition: 'Construction', effect: '-5% infra cost', infraCostDiscount: 0.05 },
  ],
  'Calcium': [
    { condition: 'Rubber, Furs, Spices, Wine', effect: '+$3/citizen per matching resource', citizenIncomeBonus: 3 },
  ],
  'Magnesium': [
    { condition: 'Microchips', effect: '+4 happiness', happinessBonus: 4 },
    { condition: 'Steel', effect: '-4% infra upkeep', infraUpkeepDiscount: 0.04 },
  ],
  'Potassium': [
    { condition: 'Fine Jewelry', effect: '+3 happiness', happinessBonus: 3 },
    { condition: 'Scholar', effect: '+$3 citizen income', citizenIncomeBonus: 3 },
    { condition: 'Affluent Population', effect: '+$3 citizen income', citizenIncomeBonus: 3 },
  ],
  'Radon': [
    { condition: 'Lead, Gold, Water, Uranium', effect: '+$3/citizen per matching resource', citizenIncomeBonus: 3 },
  ],
  'Silicon': [
    { condition: 'Rubber, Furs, Gems, Silver', effect: '+$3/citizen per matching resource', citizenIncomeBonus: 3 },
  ],
  'Sodium': [
    { condition: 'Fast Food', effect: '+2 happiness', happinessBonus: 2 },
    { condition: 'Beer', effect: '+2 happiness', happinessBonus: 2 },
    { condition: 'Radiation Cleanup', effect: '-50% additional GRL (75% total)', },
  ],
  'Titanium': [
    { condition: 'Gold, Lead, Coal, Oil', effect: '+$3/citizen per matching resource', citizenIncomeBonus: 3 },
  ],
};
