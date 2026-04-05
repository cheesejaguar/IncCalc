import type { ImprovementAnalysis } from '../types';
import { IMPROVEMENTS } from '../data/improvements';

interface ImprovementAdvisorInput {
  citizenCount: number;
  citizenIncome: number;
  netIncome: number;
  happiness: number;
  tech: number;
  taxRate: number; // as decimal
  infraUpkeepBill: number; // total upkeep bill
  infraCostPerUnit: number; // cost of 1 infra at current level
  // Improvement counts
  improvements: Record<string, number>;
  // Owned wonders (for prereqs)
  ownedWonders?: string[];
}

const UPKEEP_PER_IMPROVEMENT = 5000;

/**
 * Calculate improvement analysis with income change, ROI, and infra/day.
 * Ported from improvement.inc.php.
 */
export function calculateImprovementAnalysis(
  input: ImprovementAdvisorInput
): ImprovementAnalysis[] {
  const {
    citizenCount,
    citizenIncome,
    netIncome,
    taxRate,
    infraUpkeepBill,
    infraCostPerUnit,
    improvements,
  } = input;

  // Income modifier from improvements
  const banks = 1 + 0.07 * (improvements['Banks'] ?? 0);
  const fm = 1 + 0.05 * (improvements['Foreign Ministries'] ?? 0);
  const gc = 1 - 0.08 * (improvements['Guerilla Camps'] ?? 0);
  const harbor = 1 + 0.01 * (improvements['Harbors'] ?? 0);
  const school = 1 + 0.05 * (improvements['Schools'] ?? 0);
  const univ = 1 + 0.08 * (improvements['Universities'] ?? 0);

  const incomeMod = banks * fm * gc * harbor * school * univ;
  const hapIncome = 2 * incomeMod * taxRate;

  // Per-improvement income change formulas (from improvement.inc.php lines 59-87)
  const incomeChanges: Record<string, number> = {
    'Banks':                  0.07 * netIncome,
    'Border Walls':           (citizenIncome + 2 * hapIncome) * (citizenCount * 0.98) - netIncome,
    'Churches':               (citizenIncome + 1 * hapIncome) * (citizenCount * 1.00) - netIncome,
    'Clinics':                (citizenIncome + 0 * hapIncome) * (citizenCount * 1.02) - netIncome,
    'Factories':              0,
    'Foreign Ministries':     0.05 * netIncome,
    'Guerilla Camps':         -0.08 * netIncome,
    'Harbors':                (citizenIncome + 1 * hapIncome) * (citizenCount * 1.00) - netIncome,
    'Hospitals':              (citizenIncome + 0 * hapIncome) * (citizenCount * 1.06) - netIncome,
    'Intelligence Agencies':  (citizenIncome + 1 * hapIncome) * (citizenCount * 1.00) - netIncome,
    'Labor Camps':            ((citizenIncome - 1 * hapIncome) * (citizenCount * 1.00) - netIncome) + (infraUpkeepBill * 0.10),
    'Police Headquarters':    (citizenIncome + 2 * hapIncome) * (citizenCount * 1.00) - netIncome,
    'Schools':                0.05 * netIncome,
    'Stadiums':               (citizenIncome + 3 * hapIncome) * (citizenCount * 1.00) - netIncome,
    'Universities':           0.08 * netIncome,
  };

  const results: ImprovementAnalysis[] = [];

  for (const [name, def] of Object.entries(IMPROVEMENTS)) {
    const currentCount = improvements[name] ?? 0;
    let incChange = incomeChanges[name] ?? 0;

    // Check purchase eligibility (from improvement.inc.php lines 128-155)
    let canPurchase = true;
    const specialImps = ['Universities', 'Harbors', 'Hospitals', 'Foreign Ministries', 'Factories'];

    if (specialImps.includes(name)) {
      switch (name) {
        case 'Harbors':
          if (currentCount !== 0) canPurchase = false;
          break;
        case 'Hospitals':
          if (currentCount !== 0 || (improvements['Clinics'] ?? 0) < 2) canPurchase = false;
          break;
        case 'Foreign Ministries':
          if (currentCount > 0) canPurchase = false;
          break;
        case 'Universities':
          if (currentCount === 2 || (improvements['Schools'] ?? 0) < 3) canPurchase = false;
          break;
        case 'Factories':
          canPurchase = currentCount < 5;
          break;
      }
    } else {
      if (currentCount >= def.maxCount) canPurchase = false;
    }

    if (!canPurchase) {
      incChange = 0;
    }

    // Subtract $5,000/day upkeep for having the improvement
    if (incChange > 0) {
      incChange -= UPKEEP_PER_IMPROVEMENT;
    } else if (incChange < 0) {
      incChange -= UPKEEP_PER_IMPROVEMENT;
    }
    // If incChange is exactly 0 (Factories, or can't purchase), don't subtract upkeep

    // ROI
    let roi: string;
    if (def.cost === 0 || incChange === 0) {
      roi = 'N/A';
    } else if (incChange < 0) {
      roi = 'Never';
    } else {
      roi = `${Math.round(def.cost / incChange)} days`;
    }

    // Infra/day
    const newCash = netIncome + incChange;
    let infraPerDay: number;
    if (name === 'Factories' && currentCount < 5) {
      infraPerDay = infraCostPerUnit > 0 ? newCash / infraCostPerUnit / 0.8 : 0;
    } else {
      infraPerDay = infraCostPerUnit > 0 ? newCash / infraCostPerUnit : 0;
    }

    results.push({
      name,
      currentCount,
      incomeChange: incChange,
      cost: def.cost,
      roi,
      infraPerDay,
      canPurchase,
    });
  }

  return results;
}
