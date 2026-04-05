import { BONUS_RECIPES, type BonusRecipe } from '@/lib/data/trade-circles';

export interface TradeCircleInput {
  selectedResources: string[];  // 12 base resources in the circle
}

export interface TradeCircleResult {
  bonusResources: BonusRecipe[];
  totalHappinessBonus: number;
  totalInfraCostDiscount: number;
  totalInfraUpkeepDiscount: number;
  totalPopulationBonus: number;
  totalCitizenIncomeBonus: number;
  missingForBonuses: { bonus: string; missing: string[] }[];
}

/**
 * Resolves which bonus resources are unlocked given a set of base resources,
 * handling chained bonuses recursively (e.g., Automobiles requires Asphalt + Steel,
 * which themselves require base resources).
 */
function resolveUnlockedBonuses(
  baseResources: string[],
  techLevel: number = 0,
): BonusRecipe[] {
  // We do iterative passes until no new bonuses are added, to handle chains
  const unlocked = new Set<string>();
  const unlockedRecipes: BonusRecipe[] = [];

  let changed = true;
  while (changed) {
    changed = false;
    for (const recipe of BONUS_RECIPES) {
      if (unlocked.has(recipe.name)) continue;

      if (recipe.techRequired !== undefined && techLevel < recipe.techRequired) continue;

      // Requirements can be base resources OR already-unlocked bonus resources
      const available = new Set([...baseResources, ...Array.from(unlocked)]);
      const allPresent = recipe.requires.every((req) => available.has(req));

      if (allPresent) {
        unlocked.add(recipe.name);
        unlockedRecipes.push(recipe);
        changed = true;
      }
    }
  }

  return unlockedRecipes;
}

/**
 * Computes near-misses: bonuses that require exactly 1 more base resource to unlock.
 * For chained bonuses, accounts for the full base resource chain needed.
 */
function computeNearMisses(
  baseResources: string[],
  unlockedBonusNames: Set<string>,
  techLevel: number = 0,
): { bonus: string; missing: string[] }[] {
  const nearMisses: { bonus: string; missing: string[] }[] = [];

  for (const recipe of BONUS_RECIPES) {
    if (unlockedBonusNames.has(recipe.name)) continue;
    if (recipe.techRequired !== undefined && techLevel < recipe.techRequired) continue;

    const available = new Set([...baseResources, ...Array.from(unlockedBonusNames)]);
    const missing = recipe.requires.filter((req) => !available.has(req));

    if (missing.length === 1) {
      // For chained bonuses, the missing item might itself be a bonus resource
      // that requires base resources — expand to show actual missing base resources
      const missingItem = missing[0];
      const isBonus = BONUS_RECIPES.some((r) => r.name === missingItem);

      if (isBonus) {
        const subRecipe = BONUS_RECIPES.find((r) => r.name === missingItem)!;
        const subMissing = subRecipe.requires.filter((req) => !available.has(req));
        if (subMissing.length === 1) {
          nearMisses.push({ bonus: recipe.name, missing: [`${missingItem} (needs: ${subMissing[0]})`] });
        }
        // If sub-recipe needs more than 1, skip — not truly a 1-away miss
      } else {
        nearMisses.push({ bonus: recipe.name, missing: [missingItem] });
      }
    }
  }

  return nearMisses;
}

export function calculateTradeCircle(
  input: TradeCircleInput,
  techLevel: number = 0,
): TradeCircleResult {
  const { selectedResources } = input;

  const unlockedRecipes = resolveUnlockedBonuses(selectedResources, techLevel);
  const unlockedNames = new Set(unlockedRecipes.map((r) => r.name));

  const totalHappinessBonus = unlockedRecipes.reduce((sum, r) => sum + r.happinessBonus, 0);
  const totalInfraCostDiscount = unlockedRecipes.reduce((sum, r) => sum + r.infraCostDiscount, 0);
  const totalInfraUpkeepDiscount = unlockedRecipes.reduce((sum, r) => sum + r.infraUpkeepDiscount, 0);
  const totalPopulationBonus = unlockedRecipes.reduce((sum, r) => sum + r.populationBonus, 0);
  const totalCitizenIncomeBonus = unlockedRecipes.reduce((sum, r) => sum + r.citizenIncomeBonus, 0);

  const missingForBonuses = computeNearMisses(selectedResources, unlockedNames, techLevel);

  return {
    bonusResources: unlockedRecipes,
    totalHappinessBonus,
    totalInfraCostDiscount,
    totalInfraUpkeepDiscount,
    totalPopulationBonus,
    totalCitizenIncomeBonus,
    missingForBonuses,
  };
}
