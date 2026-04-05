export interface BonusRecipe {
  name: string;
  requires: string[];           // base resources needed
  techRequired?: number;        // minimum tech level if any
  happinessBonus: number;
  infraCostDiscount: number;    // as decimal, e.g. 0.05
  infraUpkeepDiscount: number;
  populationBonus: number;      // as decimal, e.g. 0.05
  citizenIncomeBonus: number;   // flat $ per citizen
  otherEffects: string;
}

export const BONUS_RECIPES: BonusRecipe[] = [
  { name: 'Affluent Population', requires: ['Fine Jewelry', 'Fish', 'Furs', 'Wine'], happinessBonus: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, populationBonus: 0.05, citizenIncomeBonus: 0, otherEffects: '+5% citizens' },
  { name: 'Asphalt', requires: ['Construction', 'Oil', 'Rubber'], happinessBonus: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0.05, populationBonus: 0, citizenIncomeBonus: 0, otherEffects: '-5% infra upkeep' },
  { name: 'Automobiles', requires: ['Asphalt', 'Steel'], happinessBonus: 3, infraCostDiscount: 0, infraUpkeepDiscount: 0, populationBonus: 0, citizenIncomeBonus: 0, otherEffects: '' },
  { name: 'Beer', requires: ['Water', 'Wheat', 'Lumber', 'Aluminum'], happinessBonus: 2, infraCostDiscount: 0, infraUpkeepDiscount: 0, populationBonus: 0, citizenIncomeBonus: 0, otherEffects: '' },
  { name: 'Construction', requires: ['Lumber', 'Iron', 'Marble', 'Aluminum'], techRequired: 5, happinessBonus: 0, infraCostDiscount: 0.05, infraUpkeepDiscount: 0, populationBonus: 0, citizenIncomeBonus: 0, otherEffects: '-5% infra cost, +10 aircraft limit' },
  { name: 'Fast Food', requires: ['Cattle', 'Sugar', 'Spices', 'Pigs'], happinessBonus: 2, infraCostDiscount: 0, infraUpkeepDiscount: 0, populationBonus: 0, citizenIncomeBonus: 0, otherEffects: '' },
  { name: 'Fine Jewelry', requires: ['Gold', 'Silver', 'Gems', 'Coal'], happinessBonus: 3, infraCostDiscount: 0, infraUpkeepDiscount: 0, populationBonus: 0, citizenIncomeBonus: 0, otherEffects: '' },
  { name: 'Microchips', requires: ['Gold', 'Lead', 'Oil'], techRequired: 10, happinessBonus: 2, infraCostDiscount: 0, infraUpkeepDiscount: 0, populationBonus: 0, citizenIncomeBonus: 0, otherEffects: '-8% tech cost, -10% navy cost (Frigate+)' },
  { name: 'Radiation Cleanup', requires: ['Construction', 'Microchips', 'Steel'], techRequired: 15, happinessBonus: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, populationBonus: 0, citizenIncomeBonus: 0, otherEffects: '-1 day nuke anarchy, +1 environment, -50% global radiation' },
  { name: 'Scholar', requires: ['Lumber', 'Lead'], happinessBonus: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, populationBonus: 0, citizenIncomeBonus: 3, otherEffects: '+$3 citizen income (requires 90%+ literacy)' },
  { name: 'Steel', requires: ['Coal', 'Iron'], happinessBonus: 0, infraCostDiscount: 0.02, infraUpkeepDiscount: 0, populationBonus: 0, citizenIncomeBonus: 0, otherEffects: '-2% infra cost, -15% navy purchase cost' },
];
