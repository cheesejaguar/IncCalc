import { RESOURCE_INCOME_BONUSES } from '../data/resources';

export interface TaxOptimizerInput {
  citizens: number;
  grossIncome: number;       // per-citizen gross daily income (before tax)
  currentTaxRate: number;    // percentage, e.g. 28
  // Improvement counts that affect income
  banks: number;
  foreignMinistries: number;
  guerillaCamps: number;
  harbors: number;
  schools: number;
  universities: number;
  // For happiness calculation
  baseHappiness: number;     // total happiness EXCLUDING tax component
  // Connected resources for income bonuses
  connectedResources: string[];
  bonusResources: string[];
}

export interface TaxRatePoint {
  taxRate: number;
  happiness: number;
  perCitizenIncome: number;
  taxPerCitizen: number;
  dailyNetIncome: number;
}

export interface TaxOptimizerResult {
  optimalRate: number;
  optimalIncome: number;
  currentIncome: number;
  curve: TaxRatePoint[];
}

/**
 * Tax happiness: each 1% below 28% adds +1 happiness, each 1% above costs -1.
 */
function getTaxHappiness(taxRate: number): number {
  return 28 - taxRate;
}

/**
 * Calculate income at a given tax rate.
 *
 * CN income formula (approximate):
 *   base_citizen_income = $30 + ($2 × happiness) + resource_bonuses + improvement_bonuses
 *   tax_collected = citizens × base_citizen_income × (taxRate / 100)
 *
 * Happiness feeds back into income through the $2 × happiness term.
 * The improvement income modifier multiplies the base.
 */
function calculateIncomeAtRate(input: TaxOptimizerInput, taxRate: number): TaxRatePoint {
  // Income modifier from improvements (multiplicative)
  const incomeMod =
    (1 + 0.07 * input.banks) *
    (1 + 0.05 * input.foreignMinistries) *
    (1 - 0.08 * input.guerillaCamps) *
    (1 + 0.01 * input.harbors) *
    (1 + 0.05 * input.schools) *
    (1 + 0.08 * input.universities);

  // Total happiness at this tax rate
  const taxHappiness = getTaxHappiness(taxRate);
  const totalHappiness = input.baseHappiness + taxHappiness;

  // Resource income bonuses (flat $ per citizen)
  let resourceIncomeBonus = 0;
  const allResources = [...input.connectedResources, ...input.bonusResources];
  for (const resource of allResources) {
    const bonus = RESOURCE_INCOME_BONUSES[resource.toLowerCase()];
    if (bonus) resourceIncomeBonus += bonus;
  }

  // Per-citizen gross income: ($30 + $2 × happiness + resource bonuses) × improvement modifier
  // This is the standard CN income formula
  const baseIncome = 30 + 2 * Math.max(totalHappiness, 0) + resourceIncomeBonus;
  const perCitizenGross = baseIncome * incomeMod;

  // Tax collected per citizen
  const taxPerCitizen = perCitizenGross * (taxRate / 100);

  // Daily net income (total tax collection across all citizens)
  const dailyNetIncome = input.citizens * taxPerCitizen;

  return {
    taxRate,
    happiness: totalHappiness,
    perCitizenIncome: perCitizenGross,
    taxPerCitizen,
    dailyNetIncome,
  };
}

/**
 * Sweep tax rates from 10% to 30% and find the optimal rate
 * that maximizes daily net income.
 */
export function optimizeTaxRate(input: TaxOptimizerInput): TaxOptimizerResult {
  const curve: TaxRatePoint[] = [];

  // Sweep 10% to 30% in 1% increments
  for (let rate = 10; rate <= 30; rate++) {
    curve.push(calculateIncomeAtRate(input, rate));
  }

  // Find optimal (highest daily net income)
  let optimalIdx = 0;
  for (let i = 1; i < curve.length; i++) {
    if (curve[i].dailyNetIncome > curve[optimalIdx].dailyNetIncome) {
      optimalIdx = i;
    }
  }

  // Current rate income
  const currentPoint = calculateIncomeAtRate(input, input.currentTaxRate);

  return {
    optimalRate: curve[optimalIdx].taxRate,
    optimalIncome: curve[optimalIdx].dailyNetIncome,
    currentIncome: currentPoint.dailyNetIncome,
    curve,
  };
}
