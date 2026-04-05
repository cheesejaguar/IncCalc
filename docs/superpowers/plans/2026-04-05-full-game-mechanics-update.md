# Full Game Mechanics Update - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 6 formula bugs, add all 34 improvements, 40+ wonders, missing resources, and build new calculator pages for happiness, crime, navy, and military equipment.

**Architecture:** Update data definition files with complete game mechanics from the Cyber Nations about page. Fix calculator formulas. Add new calculator modules and UI tabs to existing pages. No new route files — add tabs to Economy and Military pages.

**Tech Stack:** Next.js 16, TypeScript, React 19, Tailwind CSS v4, shadcn/ui, recharts, Vitest

---

## File Structure

### New Files
- `vitest.config.ts` — test configuration
- `src/lib/data/governments.ts` — government types with all effects
- `src/lib/data/defcon.ts` — DEFCON level effects
- `src/lib/data/navy.ts` — navy vessel definitions
- `src/lib/data/aircraft.ts` — aircraft type definitions
- `src/lib/data/crime.ts` — crime index tiers and formulas
- `src/lib/calculators/happiness.ts` — happiness breakdown calculator
- `src/lib/calculators/crime.ts` — crime index calculator
- `src/lib/calculators/navy.ts` — navy cost calculator
- `src/lib/calculators/equipment.ts` — aircraft/cruise missile/nuke calculator
- `src/lib/calculators/__tests__/spy-odds.test.ts`
- `src/lib/calculators/__tests__/mobilize.test.ts`
- `src/lib/calculators/__tests__/infrastructure.test.ts`
- `src/lib/calculators/__tests__/happiness.test.ts`
- `src/lib/calculators/__tests__/crime.test.ts`

### Modified Files
- `package.json` — add vitest dev dependency
- `src/lib/data/resources.ts` — add missing resources, fix government modifier, add resource effects
- `src/lib/data/improvements.ts` — add all 34 improvements with full effects
- `src/lib/data/wonders.ts` — add all 40+ wonders with full effects
- `src/lib/calculators/spy-odds.ts` — fix land/70 bug
- `src/lib/calculators/mobilize.ts` — fix tank cost, add DEFCON
- `src/lib/calculators/improvement-advisor.ts` — fix FM income, add all improvements
- `src/lib/calculators/wonder-advisor.ts` — add all wonders
- `src/lib/calculators/infrastructure.ts` — add wonder modifiers
- `src/lib/calculators/upkeep.ts` — add wonder/crime modifiers
- `src/lib/calculators/population.ts` — add wonder modifiers
- `src/lib/types.ts` — add new input/result types
- `src/hooks/useNationData.tsx` — update government modifier logic
- `src/app/economy/page.tsx` — add Happiness and Crime tabs
- `src/app/military/page.tsx` — add Navy and Equipment tabs
- `src/components/layout/Sidebar.tsx` — no changes needed (tabs within existing pages)

---

## Task 1: Set Up Vitest Test Infrastructure

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Install vitest**

```bash
npm install -D vitest
```

- [ ] **Step 2: Create vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    include: ['src/**/__tests__/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- [ ] **Step 3: Add test script to package.json**

Add to the `"scripts"` section of `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Verify vitest runs**

```bash
npx vitest run
```

Expected: "No test files found" (no errors).

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts package.json package-lock.json
git commit -m "chore: add vitest test infrastructure"
```

---

## Task 2: Fix Spy Odds Formula Bug

The defending formula uses `(enemyLand + enemyTech) / 20` but should be `(enemyTech / 20) + (enemyLand / 70)` per the game's about page.

**Files:**
- Modify: `src/lib/calculators/spy-odds.ts:27-28`
- Create: `src/lib/calculators/__tests__/spy-odds.test.ts`

- [ ] **Step 1: Write failing test**

Create `src/lib/calculators/__tests__/spy-odds.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { calculateSpyOdds } from '../spy-odds';

describe('calculateSpyOdds', () => {
  it('calculates defensive modifier with land/70 not land/20', () => {
    const result = calculateSpyOdds({
      mySpies: 50,
      myTech: 1000,
      enemySpies: 50,
      enemyTech: 1000,
      enemyLand: 700,
      threatLevel: 'Elevated',
    });

    // offensiveMod = 50 + 1000/20 = 100
    expect(result.offensiveMod).toBeCloseTo(100);

    // defensiveMod = (50 + 1000/20 + 700/70) * 1.0 = (50 + 50 + 10) * 1.0 = 110
    expect(result.defensiveMod).toBeCloseTo(110);

    // successRate = 100 * 100 / (100 + 110) = 47.62%
    expect(result.successRate).toBeCloseTo(47.619, 1);
  });

  it('applies threat level multiplier to defense', () => {
    const result = calculateSpyOdds({
      mySpies: 50,
      myTech: 200,
      enemySpies: 50,
      enemyTech: 200,
      enemyLand: 350,
      threatLevel: 'Severe',
    });

    // offensiveMod = 50 + 200/20 = 60
    expect(result.offensiveMod).toBeCloseTo(60);

    // defensiveMod = (50 + 200/20 + 350/70) * 1.25 = (50 + 10 + 5) * 1.25 = 81.25
    expect(result.defensiveMod).toBeCloseTo(81.25);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/lib/calculators/__tests__/spy-odds.test.ts
```

Expected: FAIL — defensiveMod will be wrong (uses /20 for land instead of /70).

- [ ] **Step 3: Fix the formula in spy-odds.ts**

In `src/lib/calculators/spy-odds.ts`, replace lines 27-28:

Old:
```ts
  const defensiveMod =
    (input.enemySpies + (input.enemyLand + input.enemyTech) / 20) * threatMod;
```

New:
```ts
  const defensiveMod =
    (input.enemySpies + input.enemyTech / 20 + input.enemyLand / 70) * threatMod;
```

Also update the JSDoc comment (lines 19-20) from:
```
 * Defensive modifier = (enemySpies + (enemyLand + enemyTech) / 20) * threatMod
```
To:
```
 * Defensive modifier = (enemySpies + enemyTech / 20 + enemyLand / 70) * threatMod
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/lib/calculators/__tests__/spy-odds.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/calculators/spy-odds.ts src/lib/calculators/__tests__/spy-odds.test.ts
git commit -m "fix: correct spy odds defending formula (land/70 not land/20)"
```

---

## Task 3: Fix Government Modifier System

The calculator uses a single `GOVERNMENT_MODIFIER_ELIGIBLE` list for both infrastructure (-5%) and military (+5%). But the game has different eligible governments for each, and the military bonus is +8%, not +5%.

**Files:**
- Create: `src/lib/data/governments.ts`
- Modify: `src/lib/data/resources.ts:85,94-102`
- Modify: `src/lib/hooks/useNationData.tsx:54-63`

- [ ] **Step 1: Create governments.ts data file**

Create `src/lib/data/governments.ts`:

```ts
export interface GovernmentDef {
  name: string;
  infraDiscount: boolean;     // -5% infrastructure purchase cost
  soldierBonus: boolean;      // +8% soldier efficiency
  militaryUpkeepDiscount: boolean; // -2% military upkeep
  spyBonus: boolean;          // +10% spy attack strength
  landBonus: boolean;         // +5% purchased land
  improvementUpkeepDiscount: boolean; // -5% improvement/wonder upkeep
  happinessBonus: number;     // direct happiness modifier
  environmentBonus: boolean;  // positive environment effect
}

export const GOVERNMENTS: Record<string, GovernmentDef> = {
  'Anarchy': {
    name: 'Anarchy',
    infraDiscount: false,
    soldierBonus: false,
    militaryUpkeepDiscount: false,
    spyBonus: false,
    landBonus: false,
    improvementUpkeepDiscount: false,
    happinessBonus: 0,
    environmentBonus: false,
  },
  'Capitalist': {
    name: 'Capitalist',
    infraDiscount: true,
    soldierBonus: false,
    militaryUpkeepDiscount: false,
    spyBonus: false,
    landBonus: true,
    improvementUpkeepDiscount: true,
    happinessBonus: 0,
    environmentBonus: true,
  },
  'Communist': {
    name: 'Communist',
    infraDiscount: false,
    soldierBonus: true,
    militaryUpkeepDiscount: true,
    spyBonus: true,
    landBonus: true,
    improvementUpkeepDiscount: false,
    happinessBonus: 0,
    environmentBonus: false,
  },
  'Democracy': {
    name: 'Democracy',
    infraDiscount: false,
    soldierBonus: true,
    militaryUpkeepDiscount: false,
    spyBonus: false,
    landBonus: false,
    improvementUpkeepDiscount: false,
    happinessBonus: 1,
    environmentBonus: true,
  },
  'Dictatorship': {
    name: 'Dictatorship',
    infraDiscount: true,
    soldierBonus: true,
    militaryUpkeepDiscount: true,
    spyBonus: false,
    landBonus: false,
    improvementUpkeepDiscount: false,
    happinessBonus: 0,
    environmentBonus: false,
  },
  'Federal Government': {
    name: 'Federal Government',
    infraDiscount: true,
    soldierBonus: true,
    militaryUpkeepDiscount: false,
    spyBonus: false,
    landBonus: false,
    improvementUpkeepDiscount: true,
    happinessBonus: 0,
    environmentBonus: false,
  },
  'Monarchy': {
    name: 'Monarchy',
    infraDiscount: true,
    soldierBonus: false,
    militaryUpkeepDiscount: false,
    spyBonus: false,
    landBonus: true,
    improvementUpkeepDiscount: false,
    happinessBonus: 1,
    environmentBonus: false,
  },
  'Republic': {
    name: 'Republic',
    infraDiscount: true,
    soldierBonus: false,
    militaryUpkeepDiscount: false,
    spyBonus: true,
    landBonus: true,
    improvementUpkeepDiscount: false,
    happinessBonus: 0,
    environmentBonus: true,
  },
  'Revolutionary Government': {
    name: 'Revolutionary Government',
    infraDiscount: true,
    soldierBonus: false,
    militaryUpkeepDiscount: false,
    spyBonus: false,
    landBonus: false,
    improvementUpkeepDiscount: true,
    happinessBonus: 1,
    environmentBonus: false,
  },
  'Totalitarian State': {
    name: 'Totalitarian State',
    infraDiscount: false,
    soldierBonus: false,
    militaryUpkeepDiscount: true,
    spyBonus: false,
    landBonus: true,
    improvementUpkeepDiscount: false,
    happinessBonus: 1,
    environmentBonus: false,
  },
  'Transitional': {
    name: 'Transitional',
    infraDiscount: false,
    soldierBonus: true,
    militaryUpkeepDiscount: true,
    spyBonus: true,
    landBonus: true,
    improvementUpkeepDiscount: false,
    happinessBonus: 0,
    environmentBonus: false,
  },
};
```

- [ ] **Step 2: Update resources.ts — fix military modifier value and split government lists**

In `src/lib/data/resources.ts`, change the military government modifier value from 0.05 to 0.08 on line 85:

```ts
  government: { name: 'Government', value: 0.08, direction: 'bonus' },
```

Replace the `GOVERNMENT_MODIFIER_ELIGIBLE` constant (lines 94-102) with two separate lists:

```ts
// Governments that qualify for infrastructure cost -5% modifier
export const GOVERNMENT_INFRA_ELIGIBLE = [
  'Capitalist',
  'Dictatorship',
  'Federal Government',
  'Monarchy',
  'Republic',
  'Revolutionary Government',
];

// Governments that qualify for soldier efficiency +8% modifier
export const GOVERNMENT_MILITARY_ELIGIBLE = [
  'Communist',
  'Democracy',
  'Dictatorship',
  'Federal Government',
  'Transitional',
];
```

- [ ] **Step 3: Update useNationData.tsx to use split government lists**

In `src/hooks/useNationData.tsx`, update the import to use the new list names and compute both modifiers.

Replace the import of `GOVERNMENT_MODIFIER_ELIGIBLE` with:
```ts
import { GOVERNMENT_INFRA_ELIGIBLE, GOVERNMENT_MILITARY_ELIGIBLE } from '@/lib/data/resources';
```

Replace the `hasGovernmentModifier` and `allResources` logic (around lines 54-63) with:

```ts
    const hasInfraGovernmentModifier = GOVERNMENT_INFRA_ELIGIBLE.includes(nation.government);
    const hasMilitaryGovernmentModifier = GOVERNMENT_MILITARY_ELIGIBLE.includes(nation.government);

    const allResources = useMemo(() => {
      const res = [
        ...nation.connectedResources.map((r) => r.toLowerCase()),
        ...nation.bonusResources.map((r) => r.toLowerCase()),
      ];
      if (hasInfraGovernmentModifier) res.push('government');
      return res;
    }, [nation.connectedResources, nation.bonusResources, hasInfraGovernmentModifier]);

    const allMilitaryResources = useMemo(() => {
      const res = [
        ...nation.connectedResources.map((r) => r.toLowerCase()),
        ...nation.bonusResources.map((r) => r.toLowerCase()),
      ];
      if (hasMilitaryGovernmentModifier) res.push('government');
      return res;
    }, [nation.connectedResources, nation.bonusResources, hasMilitaryGovernmentModifier]);
```

Update the context type and value to expose `allMilitaryResources`:

In the `NationDataContextType` interface, add:
```ts
  allMilitaryResources: string[];
```

And include it in the context value object.

- [ ] **Step 4: Update military page to use allMilitaryResources**

In `src/app/military/page.tsx`, where the mobilization calculator is called, use `allMilitaryResources` instead of `allResources` for the `activeResources` parameter.

- [ ] **Step 5: Verify build passes**

```bash
npx tsc --noEmit && npm run build
```

Expected: clean build.

- [ ] **Step 6: Commit**

```bash
git add src/lib/data/governments.ts src/lib/data/resources.ts src/hooks/useNationData.tsx src/app/military/page.tsx
git commit -m "fix: split government modifiers — infra -5% vs military +8% with correct government lists"
```

---

## Task 4: Fix Mobilize Calculator Bugs

Three bugs: (1) tank cost should be `soldierCost × 40`, not flat $96; (2) DEFCON should affect soldier cost; (3) Border Walls maxCount should be 1.

**Files:**
- Create: `src/lib/data/defcon.ts`
- Modify: `src/lib/calculators/mobilize.ts`
- Modify: `src/lib/data/improvements.ts:9`
- Modify: `src/lib/types.ts` (MobilizeInput)
- Create: `src/lib/calculators/__tests__/mobilize.test.ts`

- [ ] **Step 1: Create DEFCON data file**

Create `src/lib/data/defcon.ts`:

```ts
export interface DefconLevel {
  level: number;
  happiness: number;
  soldierCostModifier: number;  // multiplier: 1.2 = +20%, 0.8 = -20%
  soldierEfficiency: number;    // 0.76 to 1.0
}

export const DEFCON_LEVELS: Record<number, DefconLevel> = {
  5: { level: 5, happiness: 2,  soldierCostModifier: 1.20, soldierEfficiency: 0.76 },
  4: { level: 4, happiness: 1,  soldierCostModifier: 1.10, soldierEfficiency: 0.81 },
  3: { level: 3, happiness: 0,  soldierCostModifier: 1.00, soldierEfficiency: 0.86 },
  2: { level: 2, happiness: -1, soldierCostModifier: 0.90, soldierEfficiency: 0.93 },
  1: { level: 1, happiness: -2, soldierCostModifier: 0.80, soldierEfficiency: 1.00 },
};
```

- [ ] **Step 2: Add defcon to MobilizeInput type**

In `src/lib/types.ts`, add `defcon` to `MobilizeInput` (around line 140):

```ts
export interface MobilizeInput {
  citizens: number;
  currentSoldiers: number;
  currentTanks: number;
  guerillaCamps: number;
  barracks: number;
  activeResources: string[];
  defcon: number;
}
```

- [ ] **Step 3: Write failing test for mobilize**

Create `src/lib/calculators/__tests__/mobilize.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { calculateMobilize } from '../mobilize';

describe('calculateMobilize', () => {
  it('calculates tank cost as soldierCost × 40', () => {
    const result = calculateMobilize({
      citizens: 10000,
      currentSoldiers: 0,
      currentTanks: 0,
      guerillaCamps: 0,
      barracks: 0,
      activeResources: [],
      defcon: 3,
    });

    // Base soldier cost: $8 at DEFCON 3 (1.0x)
    expect(result.soldierCost).toBeCloseTo(8);
    // Tank cost = soldierCost × 40 = $320
    expect(result.tankCost).toBeCloseTo(320);
  });

  it('applies iron and oil discounts to soldier cost, which cascades to tank cost', () => {
    const result = calculateMobilize({
      citizens: 10000,
      currentSoldiers: 0,
      currentTanks: 0,
      guerillaCamps: 0,
      barracks: 0,
      activeResources: ['iron', 'oil'],
      defcon: 3,
    });

    // Soldier: $8 - $3 (iron) - $3 (oil) = $2
    expect(result.soldierCost).toBeCloseTo(2);
    // Tank: $2 × 40 = $80
    expect(result.tankCost).toBeCloseTo(80);
  });

  it('applies DEFCON modifier to soldier cost', () => {
    const result = calculateMobilize({
      citizens: 10000,
      currentSoldiers: 0,
      currentTanks: 0,
      guerillaCamps: 0,
      barracks: 0,
      activeResources: [],
      defcon: 5,
    });

    // DEFCON 5: soldier cost +20% → $8 × 1.2 = $9.60
    expect(result.soldierCost).toBeCloseTo(9.6);
    // Tank: $9.60 × 40 = $384
    expect(result.tankCost).toBeCloseTo(384);
  });

  it('applies lead discount to tank cost after base calculation', () => {
    const result = calculateMobilize({
      citizens: 10000,
      currentSoldiers: 0,
      currentTanks: 0,
      guerillaCamps: 0,
      barracks: 0,
      activeResources: ['lead'],
      defcon: 3,
    });

    // Soldier: $8, Tank: $8 × 40 = $320, with Lead -8%: $320 × 0.92 = $294.40
    expect(result.tankCost).toBeCloseTo(294.4);
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

```bash
npx vitest run src/lib/calculators/__tests__/mobilize.test.ts
```

Expected: FAIL — tank cost is $96 not $320, DEFCON not applied.

- [ ] **Step 5: Rewrite mobilize.ts**

Replace the full contents of `src/lib/calculators/mobilize.ts`:

```ts
import type { MobilizeInput, MobilizeResult } from '../types';
import { MILITARY_MODIFIERS, MILITARY_IMPROVEMENT_MODIFIERS } from '../data/resources';
import { DEFCON_LEVELS } from '../data/defcon';
import { computeResourceModifier, exponentialImprovementModifier } from './modifiers';

/**
 * Calculate military mobilization costs and limits.
 *
 * Max soldiers = (citizens * 0.8 - currentSoldiers) / modifier
 * Max tanks = 0.1 * 0.8 * citizens - currentTanks
 *
 * Soldier base cost: $8, modified by DEFCON, minus $3 for iron, minus $3 for oil
 * Tank cost: soldierCost × 40, * 0.92 if lead, * 0.90 if factory (not yet modeled)
 */
export function calculateMobilize(input: MobilizeInput): MobilizeResult {
  // Compute resource modifier for soldier count
  let modifier = computeResourceModifier(MILITARY_MODIFIERS, input.activeResources);

  // Apply improvement modifiers (exponential stacking)
  modifier *= exponentialImprovementModifier(
    MILITARY_IMPROVEMENT_MODIFIERS.gcamp,
    input.guerillaCamps
  );
  modifier *= exponentialImprovementModifier(
    MILITARY_IMPROVEMENT_MODIFIERS.barr,
    input.barracks
  );

  // Max soldiers purchasable
  const maxSoldiers = (input.citizens * 0.8 - input.currentSoldiers) / modifier;

  // DEFCON modifier on soldier cost
  const defconData = DEFCON_LEVELS[input.defcon] ?? DEFCON_LEVELS[5];
  const defconCostMod = defconData.soldierCostModifier;

  // Soldier cost: base $8, apply DEFCON, then resource discounts
  let soldierCost = 8 * defconCostMod;
  const lowerRes = input.activeResources.map((r) => r.toLowerCase());
  if (lowerRes.includes('iron')) soldierCost -= 3;
  if (lowerRes.includes('oil')) soldierCost -= 3;
  soldierCost = Math.max(soldierCost, 0);

  // Max tanks
  const maxTanks = 0.1 * 0.8 * input.citizens - input.currentTanks;

  // Tank cost: soldierCost × 40, then lead -8%
  let tankCost = soldierCost * 40;
  if (lowerRes.includes('lead')) tankCost *= 0.92;

  return {
    maxSoldiers: Math.max(0, maxSoldiers),
    soldierCost,
    totalSoldierCost: Math.max(0, maxSoldiers) * soldierCost,
    maxTanks: Math.max(0, maxTanks),
    tankCost,
    totalTankCost: Math.max(0, maxTanks) * tankCost,
    modifier,
  };
}
```

- [ ] **Step 6: Fix Border Walls maxCount**

In `src/lib/data/improvements.ts` line 9, change:

```ts
  'Border Walls':           { name: 'Border Walls',           cost: 60000,  maxCount: 1 },
```

- [ ] **Step 7: Run tests**

```bash
npx vitest run src/lib/calculators/__tests__/mobilize.test.ts
```

Expected: PASS

- [ ] **Step 8: Update military page to pass defcon**

In `src/app/military/page.tsx`, where `calculateMobilize` is called, add `defcon: nation.defcon || 5` to the input object.

- [ ] **Step 9: Verify build**

```bash
npx tsc --noEmit
```

- [ ] **Step 10: Commit**

```bash
git add src/lib/data/defcon.ts src/lib/data/improvements.ts src/lib/calculators/mobilize.ts src/lib/types.ts src/lib/calculators/__tests__/mobilize.test.ts src/app/military/page.tsx
git commit -m "fix: tank cost formula (soldierCost×40), DEFCON soldier cost, Border Walls max 1"
```

---

## Task 5: Fix Improvement Advisor Foreign Ministry Bug

Foreign Ministry income modifier is 7% but should be 5%.

**Files:**
- Modify: `src/lib/calculators/improvement-advisor.ts:56`

- [ ] **Step 1: Fix the value**

In `src/lib/calculators/improvement-advisor.ts` line 56, change:

```ts
    'Foreign Ministries':     0.05 * netIncome,
```

(was `0.07 * netIncome`)

- [ ] **Step 2: Verify build**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/calculators/improvement-advisor.ts
git commit -m "fix: Foreign Ministry income modifier 5% not 7%"
```

---

## Task 6: Add All Missing Data Definitions

Add complete game data: all 34 improvements with effects, all wonders with effects, missing bonus resources, all resource effects (income, happiness, land), crime index data, navy vessels, aircraft.

**Files:**
- Modify: `src/lib/data/resources.ts` — add missing resources, add income/happiness/land effect maps
- Modify: `src/lib/data/improvements.ts` — all 34 improvements with effects
- Modify: `src/lib/data/wonders.ts` — all wonders with effects
- Create: `src/lib/data/crime.ts`
- Create: `src/lib/data/navy.ts`
- Create: `src/lib/data/aircraft.ts`

- [ ] **Step 1: Update resources.ts with missing bonus resources and effect maps**

In `src/lib/data/resources.ts`, update `BONUS_RESOURCES` to include missing ones:

```ts
export const BONUS_RESOURCES = [
  'Affluent Population', 'Asphalt', 'Automobiles', 'Beer', 'Construction',
  'Fast Food', 'Fine Jewelry', 'Interstate', 'Microchips',
  'Radiation Cleanup', 'Scholar', 'Steel',
] as const;
```

Add new modifier maps after the existing ones:

```ts
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

// Land purchase cost discounts from resources
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
```

- [ ] **Step 2: Rewrite improvements.ts with all 34 improvements**

Replace the full contents of `src/lib/data/improvements.ts`:

```ts
export interface ImprovementDef {
  name: string;
  cost: number;
  maxCount: number;
  upkeep: number;
  happinessEffect: number;
  incomeEffect: number;       // % modifier on income (e.g. 0.07 for +7%)
  populationEffect: number;   // % modifier on population (e.g. 0.02 for +2%)
  description: string;
}

export const IMPROVEMENTS: Record<string, ImprovementDef> = {
  'Airports':                 { name: 'Airports',                 cost: 100000, maxCount: 3, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Reduces aircraft cost and upkeep -2% each' },
  'Banks':                    { name: 'Banks',                    cost: 100000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0.07,  populationEffect: 0,    description: 'Increases population income +7%' },
  'Barracks':                 { name: 'Barracks',                 cost: 50000,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases soldier efficiency +10%, reduces soldier upkeep -10%' },
  'Border Fortifications':    { name: 'Border Fortifications',    cost: 125000, maxCount: 3, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Raises defending soldier effectiveness +2%, reduces max deployment -2%' },
  'Border Walls':             { name: 'Border Walls',             cost: 60000,  maxCount: 1, upkeep: 5000, happinessEffect: 2,    incomeEffect: 0,     populationEffect: -0.02, description: 'Decreases citizen count -2%, increases happiness +2' },
  'Bunkers':                  { name: 'Bunkers',                  cost: 200000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Reduces infrastructure damage from aircraft/missiles/nukes -3%' },
  'Casinos':                  { name: 'Casinos',                  cost: 100000, maxCount: 2, upkeep: 5000, happinessEffect: 1.5,  incomeEffect: -0.01, populationEffect: 0,    description: 'Increases happiness +1.5, decreases citizen income -1%' },
  'Churches':                 { name: 'Churches',                 cost: 40000,  maxCount: 5, upkeep: 5000, happinessEffect: 1,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases population happiness +1' },
  'Clinics':                  { name: 'Clinics',                  cost: 50000,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0.02, description: 'Increases population count +2%' },
  'Drydocks':                 { name: 'Drydocks',                 cost: 100000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases ship support +1 per type' },
  'Factories':                { name: 'Factories',                cost: 150000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Reduces infra cost -8%, tank cost -10%, cruise missile cost -5%' },
  'Foreign Ministries':       { name: 'Foreign Ministries',       cost: 120000, maxCount: 1, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0.05,  populationEffect: 0,    description: 'Increases population income +5%, opens +1 foreign aid slot' },
  'Forward Operating Bases':  { name: 'Forward Operating Bases',  cost: 125000, maxCount: 2, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases ground attack +5%, reduces own defending soldiers -3%' },
  'Guerilla Camps':           { name: 'Guerilla Camps',           cost: 20000,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: -0.08, populationEffect: 0,    description: 'Increases soldier efficiency +35%, reduces soldier upkeep -10%, reduces income -8%' },
  'Harbors':                  { name: 'Harbors',                  cost: 200000, maxCount: 1, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0.01,  populationEffect: 0,    description: 'Increases population income +1%, opens +1 trade slot' },
  'Hospitals':                { name: 'Hospitals',                cost: 180000, maxCount: 1, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0.06, description: 'Increases population count +6%. Requires 2 clinics' },
  'Intelligence Agencies':    { name: 'Intelligence Agencies',    cost: 38500,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Allows +100 spies each, +1 happiness if tax rate >23%' },
  'Jails':                    { name: 'Jails',                    cost: 25000,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Incarcerates up to 500 criminals' },
  'Labor Camps':              { name: 'Labor Camps',              cost: 150000, maxCount: 5, upkeep: 5000, happinessEffect: -1,   incomeEffect: 0,     populationEffect: 0,    description: 'Reduces infrastructure upkeep -10%, reduces happiness -1, incarcerates 200 criminals' },
  'Missile Defenses':         { name: 'Missile Defenses',         cost: 90000,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Reduces incoming cruise missile effectiveness -10%' },
  'Munitions Factories':      { name: 'Munitions Factories',      cost: 200000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases enemy infra damage from aircraft/missiles/nukes +3%' },
  'Naval Academies':          { name: 'Naval Academies',          cost: 300000, maxCount: 2, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases attacking and defending navy vessel strength +1' },
  'Naval Construction Yards': { name: 'Naval Construction Yards', cost: 300000, maxCount: 3, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases daily navy vessel purchase limit +1' },
  'Offices of Propaganda':    { name: 'Offices of Propaganda',    cost: 200000, maxCount: 2, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Decreases enemy defending soldiers effectiveness -3%' },
  'Police Headquarters':      { name: 'Police Headquarters',      cost: 75000,  maxCount: 5, upkeep: 5000, happinessEffect: 2,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases population happiness +2' },
  'Prisons':                  { name: 'Prisons',                  cost: 200000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Incarcerates up to 5,000 criminals' },
  'Radiation Containment':    { name: 'Radiation Containment',    cost: 200000, maxCount: 2, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Lowers global radiation level -20%' },
  'Red Light Districts':      { name: 'Red Light Districts',      cost: 50000,  maxCount: 2, upkeep: 5000, happinessEffect: 1,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases happiness +1, penalizes environment -0.5' },
  'Rehabilitation Facilities': { name: 'Rehabilitation Facilities', cost: 500000, maxCount: 5, upkeep: 5000, happinessEffect: 0,  incomeEffect: 0,     populationEffect: 0,    description: 'Converts up to 500 criminals back into citizens' },
  'Satellites':               { name: 'Satellites',               cost: 90000,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases cruise missile effectiveness +10%' },
  'Schools':                  { name: 'Schools',                  cost: 85000,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0.05,  populationEffect: 0,    description: 'Increases population income +5%, increases literacy rate +1%' },
  'Shipyards':                { name: 'Shipyards',                cost: 100000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Enables navy vessels, increases ship support +1' },
  'Stadiums':                 { name: 'Stadiums',                 cost: 110000, maxCount: 5, upkeep: 5000, happinessEffect: 3,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases population happiness +3' },
  'Universities':             { name: 'Universities',             cost: 180000, maxCount: 2, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0.08,  populationEffect: 0,    description: 'Increases income +8%, reduces tech cost -10%, literacy +3%. Requires 3 schools' },
};

// Short abbreviations for display in compact grids
export const IMPROVEMENT_ABBREVS: Record<string, string> = {
  'Airports': 'Air',
  'Banks': 'Bank',
  'Barracks': 'Barr',
  'Border Fortifications': 'BFrt',
  'Border Walls': 'Wall',
  'Bunkers': 'Bunk',
  'Casinos': 'Cas',
  'Churches': 'Chur',
  'Clinics': 'Clin',
  'Drydocks': 'Dry',
  'Factories': 'Fact',
  'Foreign Ministries': 'FMin',
  'Forward Operating Bases': 'FOB',
  'Guerilla Camps': 'GCmp',
  'Harbors': 'Harb',
  'Hospitals': 'Hosp',
  'Intelligence Agencies': 'Intl',
  'Jails': 'Jail',
  'Labor Camps': 'LabC',
  'Missile Defenses': 'MDef',
  'Munitions Factories': 'MFac',
  'Naval Academies': 'NAcd',
  'Naval Construction Yards': 'NCY',
  'Offices of Propaganda': 'Prop',
  'Police Headquarters': 'Poli',
  'Prisons': 'Pris',
  'Radiation Containment': 'RadC',
  'Red Light Districts': 'RLD',
  'Rehabilitation Facilities': 'Rehb',
  'Satellites': 'Sat',
  'Schools': 'Schl',
  'Shipyards': 'Ship',
  'Stadiums': 'Stad',
  'Universities': 'Univ',
};
```

- [ ] **Step 3: Rewrite wonders.ts with all wonders**

Replace the full contents of `src/lib/data/wonders.ts`:

```ts
export interface WonderDef {
  name: string;
  cost: number;              // base cost in dollars
  upkeep: number;            // daily upkeep
  happinessEffect: number;   // direct happiness bonus
  infraCostDiscount: number; // % reduction on infra purchase cost
  infraUpkeepDiscount: number; // % reduction on infra upkeep
  techCostDiscount: number;  // % reduction on tech cost
  populationEffect: number;  // % increase in population
  citizenIncomeBonus: number; // flat $ bonus per citizen per day
  description: string;
  requirements: string;
}

export const WONDERS: WonderDef[] = [
  // === Economic Wonders ===
  { name: 'Internet', cost: 35_000_000, upkeep: 5000, happinessEffect: 5, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Increases population happiness +5', requirements: '' },
  { name: 'Stock Market', cost: 30_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 10, description: 'Increases citizen income +$10', requirements: '' },
  { name: 'Great Monument', cost: 35_000_000, upkeep: 5000, happinessEffect: 4, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Increases happiness +4, citizens always happy with government', requirements: '' },
  { name: 'Great Temple', cost: 35_000_000, upkeep: 5000, happinessEffect: 5, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Increases happiness +5, citizens always happy with religion', requirements: '' },
  { name: 'Movie Industry', cost: 26_000_000, upkeep: 5000, happinessEffect: 3, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Increases population happiness +3', requirements: '' },
  { name: 'National War Memorial', cost: 27_000_000, upkeep: 5000, happinessEffect: 4, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Increases population happiness +4', requirements: '50,000+ soldier casualties' },
  { name: 'Social Security System', cost: 40_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Allows raising taxes to 30% without additional penalty', requirements: '' },
  { name: 'Political Lobbyists', cost: 50_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Vote counts as two in senate', requirements: '' },

  // === Infrastructure & Upkeep Wonders ===
  { name: 'Interstate System', cost: 45_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0.08, infraUpkeepDiscount: 0.08, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Decreases infra cost -8% and infra upkeep -8%', requirements: '' },
  { name: 'Moon Base', cost: 50_000_000, upkeep: 5000, happinessEffect: 5, infraCostDiscount: 0.04, infraUpkeepDiscount: 0.04, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Reduces infra cost/bills -4%, +5 happiness', requirements: 'Space Program' },
  { name: 'Mars Base', cost: 100_000_000, upkeep: 5000, happinessEffect: 6, infraCostDiscount: 0.03, infraUpkeepDiscount: 0.03, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Reduces infra cost/bills -3%, up to +6 happiness', requirements: 'Space Program' },

  // === Technology Wonders ===
  { name: 'Great University', cost: 35_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0.10, populationEffect: 0, citizenIncomeBonus: 0, description: 'Decreases tech cost -10%, +0.2% of tech level happiness (up to 3000 tech)', requirements: '' },
  { name: 'Space Program', cost: 30_000_000, upkeep: 5000, happinessEffect: 3, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0.03, populationEffect: 0, citizenIncomeBonus: 0, description: 'Increases happiness +3, lowers tech cost -3%, lowers aircraft cost -5%', requirements: '' },
  { name: 'National Research Lab', cost: 35_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0.03, populationEffect: 0.05, citizenIncomeBonus: 0, description: 'Increases population +5%, decreases tech cost -3%', requirements: '' },
  { name: 'Scientific Development Center', cost: 150_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Buffs factories to -10% infra, universities to +10% income, Great University tech happiness to 5000', requirements: 'Great University, National Research Lab, 14000 infra, 3000 tech' },

  // === Population Wonders ===
  { name: 'Disaster Relief Agency', cost: 40_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0.03, citizenIncomeBonus: 0, description: 'Increases population +3%, opens one foreign aid slot', requirements: '' },
  { name: 'Universal Health Care', cost: 100_000_000, upkeep: 5000, happinessEffect: 2, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0.03, citizenIncomeBonus: 0, description: 'Increases population +3%, happiness +2', requirements: 'Hospital, National Research Lab, 11000 infra' },
  { name: 'National Environment Office', cost: 100_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0.03, techCostDiscount: 0, populationEffect: 0.03, citizenIncomeBonus: 0, description: 'Removes Coal/Oil/Uranium environment penalties, +3% pop, -3% upkeep, +1 environment', requirements: '13000 infra' },
  { name: 'Nuclear Power Plant', cost: 75_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0.05, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 3, description: 'Enables Uranium income bonus (+$3 +$0.15/tech up to 30), reduces all upkeep -5%', requirements: '12000 infra, 1000 tech, Uranium' },

  // === Income Wonders ===
  { name: 'Agriculture Development Program', cost: 30_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 2, description: 'Increases land +15%, citizen income +$2, land citizen bonus from 0.2 to 0.5', requirements: '3000 land, 500 tech' },
  { name: 'Mining Industry Consortium', cost: 25_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Increases income +$2 for Coal, Lead, Oil, Uranium resources', requirements: '5000 infra, 3000 land, 1000 tech' },
  { name: 'Federal Aid Commission', cost: 25_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Raises foreign money aid cap +50%, allows secret aid', requirements: '' },
  { name: 'Federal Reserve', cost: 100_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Increases max banks +2', requirements: 'Stock Market' },

  // === Military Wonders ===
  { name: 'Pentagon', cost: 30_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Increases ground battle strength +20%', requirements: '' },
  { name: 'Superior Logistical Support', cost: 80_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Reduces aircraft/naval maintenance -10%, tank maintenance -5%, ground battle +10%', requirements: 'Pentagon' },
  { name: 'Foreign Air Force Base', cost: 35_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Raises aircraft limit +20, aircraft per attack +20', requirements: '' },
  { name: 'Foreign Army Base', cost: 200_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Adds +1 offensive war slot', requirements: '8000 tech' },
  { name: 'Foreign Naval Base', cost: 200_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Allows +2 naval purchases/day, +1 naval deployment/day', requirements: '20000 infra' },

  // === Nuclear/Defense Wonders ===
  { name: 'Manhattan Project', cost: 100_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Allows nations below 5% to develop nuclear weapons', requirements: '3000 infra, 300 tech, Uranium' },
  { name: 'Strategic Defense Initiative', cost: 75_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Reduces odds of successful nuclear attack -60%', requirements: '3 Satellites, 3 Missile Defenses' },
  { name: 'Interceptor Missile System', cost: 50_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Thwarts cruise missile attacks 50%', requirements: '5000 tech, SDI' },
  { name: 'Anti-Air Defense Network', cost: 50_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Reduces incoming aircraft odds -25%, damage -10%', requirements: '' },
  { name: 'Fallout Shelter System', cost: 40_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: '50% soldiers survive nukes, -25% tank/cm/aircraft losses, -1 day anarchy', requirements: '6000 infra, 2000 tech' },
  { name: 'Hidden Nuclear Missile Silo', cost: 30_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Allows +5 nukes that cannot be destroyed by spies', requirements: '' },
  { name: 'EMP Weaponization', cost: 200_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Enables targeted EMP nuclear attacks', requirements: '5000 tech, Weapons Research Complex' },
  { name: 'Weapons Research Complex', cost: 150_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Doubles tech damage bonus, allows 2 nukes/day', requirements: '8500 infra, 2000 tech, National Research Lab, Pentagon' },

  // === Spy Wonder ===
  { name: 'Central Intelligence Agency', cost: 40_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Increases spy limit +250, spy attack strength +10%', requirements: '' },

  // === Space Wonders ===
  { name: 'Moon Colony', cost: 50_000_000, upkeep: 5000, happinessEffect: 3, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Stores 6% of citizens, +3 happiness', requirements: 'Space Program, Moon Base' },
  { name: 'Moon Mine', cost: 50_000_000, upkeep: 5000, happinessEffect: 3, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Provides random Lunar bonus resource, +3 happiness', requirements: 'Space Program, Moon Base' },
  { name: 'Mars Colony', cost: 100_000_000, upkeep: 5000, happinessEffect: 4, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Stores 5% of citizens, up to +4 happiness', requirements: 'Space Program, Mars Base' },
  { name: 'Mars Mine', cost: 100_000_000, upkeep: 5000, happinessEffect: 4, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: 'Provides random Martian bonus resource, up to +4 happiness', requirements: 'Space Program, Mars Base' },

  // === Misc Wonders ===
  { name: 'National Cemetery', cost: 150_000_000, upkeep: 5000, happinessEffect: 0, infraCostDiscount: 0, infraUpkeepDiscount: 0, techCostDiscount: 0, populationEffect: 0, citizenIncomeBonus: 0, description: '+0.20 happiness per 1M casualties up to +5', requirements: 'National War Memorial, 5M casualties' },
];
```

- [ ] **Step 4: Create crime.ts data file**

Create `src/lib/data/crime.ts`:

```ts
export interface CrimeIndexTier {
  index: number;
  label: string;
  minScore: number;
  maxScore: number;
  upkeepModifier: number;    // % modifier on upkeep (-0.02 to +0.03)
  happinessEffect: number;
  criminalPercent: number;   // % of population that are criminals
}

export const CRIME_INDEX_TIERS: CrimeIndexTier[] = [
  { index: 0, label: 'Negligible',  minScore: 500, maxScore: Infinity, upkeepModifier: -0.02, happinessEffect: 2,    criminalPercent: 0.005 },
  { index: 1, label: 'Very Low',    minScore: 420, maxScore: 500,      upkeepModifier: -0.01, happinessEffect: 1,    criminalPercent: 0.01 },
  { index: 2, label: 'Minimal',     minScore: 340, maxScore: 420,      upkeepModifier: -0.01, happinessEffect: 0,    criminalPercent: 0.02 },
  { index: 3, label: 'Moderate',    minScore: 260, maxScore: 340,      upkeepModifier: 0,     happinessEffect: -1,   criminalPercent: 0.03 },
  { index: 4, label: 'High',        minScore: 180, maxScore: 260,      upkeepModifier: 0.01,  happinessEffect: -1.5, criminalPercent: 0.04 },
  { index: 5, label: 'Very High',   minScore: 100, maxScore: 180,      upkeepModifier: 0.02,  happinessEffect: -2,   criminalPercent: 0.05 },
  { index: 6, label: 'Extreme',     minScore: 0,   maxScore: 100,      upkeepModifier: 0.03,  happinessEffect: -3,   criminalPercent: 0.06 },
];
```

- [ ] **Step 5: Create navy.ts data file**

Create `src/lib/data/navy.ts`:

```ts
export interface NavyVesselDef {
  name: string;
  cost: number;
  upkeep: number;
  strength: number;
  bonusStrength?: { against: string; value: number };
  infraRequired: number;
  techRequired: number;
  requiresShipyard: boolean;
  requiresDrydock: boolean;
}

export const NAVY_VESSELS: NavyVesselDef[] = [
  { name: 'Corvette',         cost: 300000,  upkeep: 5000,  strength: 1,  bonusStrength: { against: 'Landing Ship', value: 3 }, infraRequired: 2000, techRequired: 200,  requiresShipyard: false, requiresDrydock: true },
  { name: 'Landing Ship',     cost: 300000,  upkeep: 10000, strength: 3,  infraRequired: 2000, techRequired: 200,  requiresShipyard: true,  requiresDrydock: false },
  { name: 'Battleship',       cost: 300000,  upkeep: 25000, strength: 5,  infraRequired: 2500, techRequired: 300,  requiresShipyard: false, requiresDrydock: true },
  { name: 'Cruiser',          cost: 500000,  upkeep: 10000, strength: 6,  bonusStrength: { against: 'Destroyer', value: 10 }, infraRequired: 3000, techRequired: 350,  requiresShipyard: false, requiresDrydock: true },
  { name: 'Frigate',          cost: 750000,  upkeep: 15000, strength: 8,  bonusStrength: { against: 'Submarine', value: 12 }, infraRequired: 3500, techRequired: 400,  requiresShipyard: true,  requiresDrydock: false },
  { name: 'Destroyer',        cost: 1000000, upkeep: 20000, strength: 11, infraRequired: 4000, techRequired: 600,  requiresShipyard: false, requiresDrydock: true },
  { name: 'Submarine',        cost: 1500000, upkeep: 25000, strength: 12, bonusStrength: { against: 'Aircraft Carrier', value: 15 }, infraRequired: 4500, techRequired: 750,  requiresShipyard: true,  requiresDrydock: false },
  { name: 'Aircraft Carrier', cost: 2000000, upkeep: 30000, strength: 15, infraRequired: 5000, techRequired: 1000, requiresShipyard: true,  requiresDrydock: false },
];

// Resource discounts on navy vessel costs/upkeep
export const NAVY_COST_MODIFIERS: Record<string, { costDiscount: number; upkeepDiscount: number }> = {
  steel:      { costDiscount: 0.15, upkeepDiscount: 0 },
  oil:        { costDiscount: 0,    upkeepDiscount: 0.10 },
  lead:       { costDiscount: 0,    upkeepDiscount: 0.20 },
  uranium:    { costDiscount: 0.05, upkeepDiscount: 0.05 },  // Submarine & Aircraft Carrier only
  microchips: { costDiscount: 0.10, upkeepDiscount: 0.10 },  // Frigate, Destroyer, Submarine, Aircraft Carrier only
};
```

- [ ] **Step 6: Create aircraft.ts data file**

Create `src/lib/data/aircraft.ts`:

```ts
export interface MilitaryEquipmentDef {
  name: string;
  baseCost: number;
  baseUpkeep: number;
  description: string;
}

// Cruise missile and nuclear weapon definitions
export const CRUISE_MISSILE: MilitaryEquipmentDef = {
  name: 'Cruise Missile',
  baseCost: 20000,
  baseUpkeep: 200,
  description: 'Base damage: 10 tanks, 1 tech, 5 infra. Up to 2 per battle front per day.',
};

export const NUCLEAR_WEAPON: MilitaryEquipmentDef = {
  name: 'Nuclear Weapon',
  baseCost: 500000,
  baseUpkeep: 5000,
  description: 'Massive damage. +10% cost per existing nuke. +10% upkeep per nuke owned.',
};

// Aircraft cost modifiers from resources
export const AIRCRAFT_COST_MODIFIERS: Record<string, number> = {
  aluminum: 0.08,
  oil: 0.04,
  rubber: 0.04,
};

// Aircraft upkeep modifiers
export const AIRCRAFT_UPKEEP_MODIFIERS: Record<string, number> = {
  lead: 0.25,
};
```

- [ ] **Step 7: Verify build**

```bash
npx tsc --noEmit
```

Fix any import/type errors that arise from the new ImprovementDef interface (the improvement-advisor and improvement page may need updates to handle the new fields — add `as any` casts or update interfaces as needed to keep things compiling; the actual logic updates happen in later tasks).

- [ ] **Step 8: Commit**

```bash
git add src/lib/data/
git commit -m "feat: add complete game data — all improvements, wonders, resources, crime, navy, aircraft"
```

---

## Task 7: Update Improvement Advisor for All 34 Improvements

Update the improvement advisor to handle all 34 improvements with correct income change formulas.

**Files:**
- Modify: `src/lib/calculators/improvement-advisor.ts`
- Modify: `src/app/improvements/page.tsx`

- [ ] **Step 1: Rewrite improvement-advisor.ts**

Replace the full contents of `src/lib/calculators/improvement-advisor.ts`:

```ts
import type { ImprovementAnalysis } from '../types';
import { IMPROVEMENTS } from '../data/improvements';

interface ImprovementAdvisorInput {
  citizenCount: number;
  citizenIncome: number;
  netIncome: number;
  happiness: number;
  tech: number;
  taxRate: number;
  infraUpkeepBill: number;
  infraCostPerUnit: number;
  improvements: Record<string, number>;
  ownedWonders?: string[];
}

const UPKEEP_PER_IMPROVEMENT = 5000;

/**
 * Calculate improvement analysis with income change, ROI, and infra/day.
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

  // Per-improvement income change formulas
  const incomeChanges: Record<string, number> = {
    // Income % improvements
    'Banks':                  0.07 * netIncome,
    'Schools':                0.05 * netIncome,
    'Universities':           0.08 * netIncome,
    'Foreign Ministries':     0.05 * netIncome,
    'Harbors':                0.01 * netIncome,
    'Casinos':                (hapIncome * 1.5 - 0.01 * netIncome) + (hapIncome * 1.5 * citizenCount - netIncome) * 0, // net: happiness gain minus income loss
    'Guerilla Camps':         -0.08 * netIncome,

    // Happiness improvements — income gain from happiness increase
    'Border Walls':           (citizenIncome + 2 * hapIncome) * (citizenCount * 0.98) - netIncome,
    'Churches':               hapIncome * 1 * citizenCount,
    'Intelligence Agencies':  hapIncome * 1 * citizenCount, // +1 happiness if tax >23%
    'Police Headquarters':    hapIncome * 2 * citizenCount,
    'Stadiums':               hapIncome * 3 * citizenCount,
    'Red Light Districts':    hapIncome * 1 * citizenCount,

    // Population improvements — income gain from more citizens
    'Clinics':                citizenIncome * (citizenCount * 0.02),
    'Hospitals':              citizenIncome * (citizenCount * 0.06),

    // Upkeep reduction
    'Labor Camps':            (infraUpkeepBill * 0.10) - hapIncome * 1 * citizenCount,

    // Factories — no direct income, but infra cost savings
    'Factories':              0,

    // Military — no direct income effect
    'Barracks':               0,
    'Airports':               0,
    'Border Fortifications':  0,
    'Bunkers':                0,
    'Drydocks':               0,
    'Forward Operating Bases': 0,
    'Jails':                  0,
    'Missile Defenses':       0,
    'Munitions Factories':    0,
    'Naval Academies':        0,
    'Naval Construction Yards': 0,
    'Offices of Propaganda':  0,
    'Prisons':                0,
    'Radiation Containment':  0,
    'Rehabilitation Facilities': 0,
    'Satellites':             0,
    'Shipyards':              0,
  };

  const results: ImprovementAnalysis[] = [];

  for (const [name, def] of Object.entries(IMPROVEMENTS)) {
    const currentCount = improvements[name] ?? 0;
    let incChange = incomeChanges[name] ?? 0;

    // Check purchase eligibility
    let canPurchase = currentCount < def.maxCount;

    // Special prereqs
    switch (name) {
      case 'Hospitals':
        if ((improvements['Clinics'] ?? 0) < 2) canPurchase = false;
        break;
      case 'Universities':
        if ((improvements['Schools'] ?? 0) < 3) canPurchase = false;
        break;
    }

    if (!canPurchase) {
      incChange = 0;
    }

    // Subtract daily upkeep for the improvement
    if (incChange !== 0) {
      incChange -= UPKEEP_PER_IMPROVEMENT;
    }

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
```

- [ ] **Step 2: Verify build**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/calculators/improvement-advisor.ts
git commit -m "feat: update improvement advisor with all 34 improvements"
```

---

## Task 8: Update Wonder Advisor for All Wonders

**Files:**
- Modify: `src/lib/calculators/wonder-advisor.ts`
- Modify: `src/app/wonders/page.tsx`

- [ ] **Step 1: Rewrite wonder-advisor.ts**

Replace the full contents of `src/lib/calculators/wonder-advisor.ts`:

```ts
import type { WonderProjection } from '../types';
import { WONDERS } from '../data/wonders';

interface WonderAdvisorInput {
  citizenCount: number;
  citizenIncome: number;
  netIncome: number;
  happiness: number;
  tech: number;
  taxRate: number;
  banks: number;
  foreignMinistries: number;
  guerillaCamps: number;
  harbors: number;
  schools: number;
  universities: number;
  ownedWonders: string[];
}

/**
 * Calculate wonder projections and recommendations.
 *
 * Income modifier = (1+0.07*banks) * (1+0.05*FM) * (1-0.08*GC)
 *                  * (1+0.01*harbors) * (1+0.05*schools) * (1+0.08*universities)
 *
 * Happiness income = 2 * incomeMod * taxRate
 */
export function calculateWonderProjections(
  input: WonderAdvisorInput
): WonderProjection[] {
  const incomeMod =
    (1 + 0.07 * input.banks) *
    (1 + 0.05 * input.foreignMinistries) *
    (1 - 0.08 * input.guerillaCamps) *
    (1 + 0.01 * input.harbors) *
    (1 + 0.05 * input.schools) *
    (1 + 0.08 * input.universities);

  const hapIncome = 2 * incomeMod * input.taxRate;

  // Calculate projected income for each wonder based on its effects
  function wonderIncome(wonder: typeof WONDERS[number]): number {
    const { name, happinessEffect, populationEffect, citizenIncomeBonus, infraUpkeepDiscount } = wonder;
    let income = input.netIncome;

    // Happiness-based income gain
    if (happinessEffect > 0) {
      income += hapIncome * happinessEffect * input.citizenCount;
    }

    // Population-based income gain
    if (populationEffect > 0) {
      income += input.citizenIncome * (input.citizenCount * populationEffect);
    }

    // Flat citizen income bonus
    if (citizenIncomeBonus > 0) {
      income += citizenIncomeBonus * input.taxRate * input.citizenCount;
    }

    // Upkeep discount savings (approximate)
    if (infraUpkeepDiscount > 0) {
      income += input.netIncome * infraUpkeepDiscount * 0.5; // rough estimate of savings
    }

    // Special cases
    switch (name) {
      case 'Great University':
        // +0.2% of tech level happiness (up to 3000 tech)
        income += hapIncome * Math.min(input.tech, 3000) * 0.002 * input.citizenCount;
        break;
      case 'Social Security System':
        // Allows raising taxes to 30% — estimate extra 2% of income over 28 days
        income += (input.netIncome * 2) / 28;
        break;
      case 'Stock Market':
        // +$10 citizen income
        income = input.netIncome + 10 * input.taxRate * incomeMod * input.citizenCount;
        break;
      case 'Mining Industry Consortium':
        // +$2 income for Coal, Lead, Oil, Uranium resources (up to 4 resources × $2)
        income += 2 * input.taxRate * input.citizenCount * 2; // rough: assume 2 qualifying resources
        break;
    }

    return income;
  }

  const projections: WonderProjection[] = WONDERS.map((wonder) => {
    const owned = input.ownedWonders.includes(wonder.name);
    const projectedIncome = owned ? input.netIncome : wonderIncome(wonder);
    const incomeGain = projectedIncome - input.netIncome;
    const daysToROI = incomeGain > 0 ? wonder.cost / incomeGain : 0;

    return {
      name: wonder.name,
      projectedIncome,
      incomeGain,
      cost: wonder.cost,
      daysToROI,
      owned,
      isBest: false,
    };
  });

  // Find the best non-owned wonder
  let maxIncome = -Infinity;
  let bestIdx = -1;
  projections.forEach((p, idx) => {
    if (!p.owned && p.projectedIncome > maxIncome) {
      maxIncome = p.projectedIncome;
      bestIdx = idx;
    }
  });
  if (bestIdx >= 0) {
    projections[bestIdx].isBest = true;
  }

  return projections;
}
```

- [ ] **Step 2: Verify build**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/calculators/wonder-advisor.ts
git commit -m "feat: update wonder advisor with all 40+ wonders and income projections"
```

---

## Task 9: Add Happiness Calculator

Create a comprehensive happiness breakdown calculator that sums all happiness sources.

**Files:**
- Create: `src/lib/calculators/happiness.ts`
- Modify: `src/lib/types.ts` (add HappinessResult type)

- [ ] **Step 1: Add HappinessResult type**

In `src/lib/types.ts`, add:

```ts
export interface HappinessBreakdownItem {
  source: string;
  value: number;
}

export interface HappinessResult {
  total: number;
  breakdown: HappinessBreakdownItem[];
}
```

- [ ] **Step 2: Create happiness.ts calculator**

Create `src/lib/calculators/happiness.ts`:

```ts
import type { HappinessResult, HappinessBreakdownItem } from '../types';
import { RESOURCE_HAPPINESS_BONUSES } from '../data/resources';
import { DEFCON_LEVELS } from '../data/defcon';
import { IMPROVEMENTS } from '../data/improvements';
import { WONDERS } from '../data/wonders';
import { CRIME_INDEX_TIERS } from '../data/crime';

interface HappinessInput {
  tech: number;
  taxRate: number;          // as percentage, e.g. 28
  defcon: number;
  environment: number;
  connectedResources: string[];
  bonusResources: string[];
  improvements: Record<string, number>;
  ownedWonders: string[];
  crimePreventionScore: number;
}

// Technology happiness brackets
function getTechHappiness(tech: number): number {
  if (tech === 0) return -1;
  if (tech <= 0.5) return 0;
  if (tech <= 1) return 1;
  if (tech <= 3) return 2;
  if (tech <= 6) return 3;
  if (tech <= 10) return 4;
  if (tech <= 15) return 5;
  return Math.min(5 + tech * 0.02, 200);
}

// Tax happiness penalty (approximate: base 2% tax = 0 penalty, each 1% above is roughly -0.5)
function getTaxHappiness(taxRate: number): number {
  if (taxRate <= 10) return 0;
  if (taxRate <= 20) return -(taxRate - 10) * 0.1;
  if (taxRate <= 28) return -1 - (taxRate - 20) * 0.15;
  return -2.2 - (taxRate - 28) * 0.5;
}

export function calculateHappiness(input: HappinessInput): HappinessResult {
  const breakdown: HappinessBreakdownItem[] = [];

  // Base happiness
  breakdown.push({ source: 'Base', value: 5 });

  // Technology
  const techHap = getTechHappiness(input.tech);
  if (techHap !== 0) {
    breakdown.push({ source: `Technology (${input.tech.toFixed(2)})`, value: techHap });
  }

  // Tax rate
  const taxHap = getTaxHappiness(input.taxRate);
  if (taxHap !== 0) {
    breakdown.push({ source: `Tax Rate (${input.taxRate}%)`, value: taxHap });
  }

  // DEFCON
  const defconData = DEFCON_LEVELS[input.defcon];
  if (defconData && defconData.happiness !== 0) {
    breakdown.push({ source: `DEFCON ${input.defcon}`, value: defconData.happiness });
  }

  // Environment (approximate: positive if > 0)
  if (input.environment > 0) {
    breakdown.push({ source: `Environment (${input.environment.toFixed(2)})`, value: Math.min(input.environment * 0.5, 5) });
  }

  // Resource happiness bonuses
  const allRes = [...input.connectedResources, ...input.bonusResources].map(r => r.toLowerCase());
  for (const [res, bonus] of Object.entries(RESOURCE_HAPPINESS_BONUSES)) {
    if (allRes.includes(res)) {
      breakdown.push({ source: `${res.charAt(0).toUpperCase() + res.slice(1)}`, value: bonus });
    }
  }

  // Improvement happiness
  for (const [name, def] of Object.entries(IMPROVEMENTS)) {
    const count = input.improvements[name] ?? 0;
    if (count > 0 && def.happinessEffect !== 0) {
      breakdown.push({ source: `${name} (${count})`, value: def.happinessEffect * count });
    }
  }

  // Wonder happiness
  for (const wonder of WONDERS) {
    if (input.ownedWonders.includes(wonder.name) && wonder.happinessEffect > 0) {
      breakdown.push({ source: wonder.name, value: wonder.happinessEffect });
    }
  }

  // Crime index happiness
  const crimeTier = CRIME_INDEX_TIERS.find(
    t => input.crimePreventionScore >= t.minScore
  ) ?? CRIME_INDEX_TIERS[CRIME_INDEX_TIERS.length - 1];
  if (crimeTier.happinessEffect !== 0) {
    breakdown.push({ source: `Crime (${crimeTier.label})`, value: crimeTier.happinessEffect });
  }

  const total = breakdown.reduce((sum, item) => sum + item.value, 0);

  return { total, breakdown };
}
```

- [ ] **Step 3: Verify build**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/calculators/happiness.ts src/lib/types.ts
git commit -m "feat: add happiness breakdown calculator with all sources"
```

---

## Task 10: Add Crime Index Calculator

**Files:**
- Create: `src/lib/calculators/crime.ts`

- [ ] **Step 1: Create crime.ts calculator**

Create `src/lib/calculators/crime.ts`:

```ts
import { CRIME_INDEX_TIERS, type CrimeIndexTier } from '../data/crime';

interface CrimeInput {
  literacyRate: number;       // percentage, e.g. 90
  policeHQ: number;           // count
  schools: number;
  universities: number;
  taxRate: number;            // percentage
  infra: number;
  citizens: number;
  jails: number;
  prisons: number;
  rehabFacilities: number;
}

interface CrimeResult {
  preventionScore: number;
  tier: CrimeIndexTier;
  criminals: number;
  incarcerated: number;
  happinessEffect: number;
  upkeepModifier: number;
  criminalHappinessPenalty: number;
}

/**
 * Crime Prevention Score formula from the about page:
 * ((Literacy%) × 80) + (((Police HQ × 1.5) + (Schools × 3) + (Universities × 10)) × Tax Crime Modifier × 12)
 *   + Gov Crime Modifier + (Infrastructure / 100) + Gen Crime Modifier
 *
 * Simplified version (Gov Crime Modifier and Tax Crime Modifier are approximations)
 */
export function calculateCrime(input: CrimeInput): CrimeResult {
  // General crime modifier: 400 - (Citizens / 500), minimum -200, stops at 200k citizens
  const genCrimeMod = Math.max(400 - input.citizens / 500, -200);

  // Tax crime modifier (approximate: lower taxes = better)
  const taxCrimeMod = input.taxRate <= 20 ? 1 : Math.max(1 - (input.taxRate - 20) * 0.05, 0.5);

  const preventionScore =
    (input.literacyRate * 80) / 100 +
    ((input.policeHQ * 1.5 + input.schools * 3 + input.universities * 10) * taxCrimeMod * 12) +
    (input.infra / 100) +
    genCrimeMod;

  // Find crime tier
  const tier = CRIME_INDEX_TIERS.find(t => preventionScore >= t.minScore)
    ?? CRIME_INDEX_TIERS[CRIME_INDEX_TIERS.length - 1];

  // Criminals
  const criminals = Math.floor(input.citizens * tier.criminalPercent);

  // Incarceration capacity
  const incarcerated = Math.min(
    criminals,
    input.jails * 500 + input.prisons * 5000
  );

  // Criminal happiness penalty: (Criminals Not Incarcerated / 2000) up to -5, no penalty for 0-200
  const unincarcerated = Math.max(criminals - incarcerated, 0);
  const criminalHappinessPenalty = unincarcerated <= 200
    ? 0
    : Math.min(unincarcerated / 2000, 5);

  return {
    preventionScore: Math.round(preventionScore),
    tier,
    criminals,
    incarcerated,
    happinessEffect: tier.happinessEffect,
    upkeepModifier: tier.upkeepModifier,
    criminalHappinessPenalty: -criminalHappinessPenalty,
  };
}
```

- [ ] **Step 2: Verify build**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/calculators/crime.ts
git commit -m "feat: add crime index calculator with prevention score and incarceration"
```

---

## Task 11: Add Navy Calculator

**Files:**
- Create: `src/lib/calculators/navy.ts`

- [ ] **Step 1: Create navy.ts calculator**

Create `src/lib/calculators/navy.ts`:

```ts
import { NAVY_VESSELS, NAVY_COST_MODIFIERS, type NavyVesselDef } from '../data/navy';

interface NavyInput {
  infra: number;
  tech: number;
  land: number;
  shipyards: number;
  drydocks: number;
  activeResources: string[];
}

interface NavyVesselResult {
  vessel: NavyVesselDef;
  adjustedCost: number;
  adjustedUpkeep: number;
  maxSupported: number;
  meetsRequirements: boolean;
  requirementNote: string;
}

interface NavyResult {
  vessels: NavyVesselResult[];
  canBuildNavy: boolean;
  dailyPurchaseLimit: number;
}

export function calculateNavy(input: NavyInput): NavyResult {
  const lowerRes = input.activeResources.map(r => r.toLowerCase());
  const canBuildNavy = input.land >= 1000 && (input.shipyards > 0 || input.drydocks > 0);

  const vessels: NavyVesselResult[] = NAVY_VESSELS.map(vessel => {
    // Calculate cost and upkeep modifiers
    let costMod = 1;
    let upkeepMod = 1;

    for (const [res, mods] of Object.entries(NAVY_COST_MODIFIERS)) {
      if (!lowerRes.includes(res)) continue;

      // Uranium and Microchips only apply to certain vessels
      if (res === 'uranium' && !['Submarine', 'Aircraft Carrier'].includes(vessel.name)) continue;
      if (res === 'microchips' && !['Frigate', 'Destroyer', 'Submarine', 'Aircraft Carrier'].includes(vessel.name)) continue;

      costMod *= (1 - mods.costDiscount);
      upkeepMod *= (1 - mods.upkeepDiscount);
    }

    const adjustedCost = vessel.cost * costMod;
    const adjustedUpkeep = vessel.upkeep * upkeepMod;

    // Check requirements
    const meetsInfra = input.infra >= vessel.infraRequired;
    const meetsTech = input.tech >= vessel.techRequired;
    const meetsBuilding = vessel.requiresShipyard ? input.shipyards > 0 : input.drydocks > 0;

    let requirementNote = '';
    if (!meetsInfra) requirementNote += `Needs ${vessel.infraRequired} infra. `;
    if (!meetsTech) requirementNote += `Needs ${vessel.techRequired} tech. `;
    if (!meetsBuilding) requirementNote += `Needs ${vessel.requiresShipyard ? 'Shipyard' : 'Drydock'}. `;

    // Max supported = shipyards + drydocks (depending on vessel type)
    const maxSupported = vessel.requiresShipyard ? input.shipyards : input.drydocks;

    return {
      vessel,
      adjustedCost,
      adjustedUpkeep,
      maxSupported,
      meetsRequirements: meetsInfra && meetsTech && meetsBuilding,
      requirementNote: requirementNote.trim(),
    };
  });

  return {
    vessels,
    canBuildNavy,
    dailyPurchaseLimit: 5, // war mode default
  };
}
```

- [ ] **Step 2: Verify build**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/calculators/navy.ts
git commit -m "feat: add navy calculator with vessel costs, requirements, and resource modifiers"
```

---

## Task 12: Add Equipment Calculator (Aircraft, Cruise Missiles, Nukes)

**Files:**
- Create: `src/lib/calculators/equipment.ts`

- [ ] **Step 1: Create equipment.ts calculator**

Create `src/lib/calculators/equipment.ts`:

```ts
import { CRUISE_MISSILE, NUCLEAR_WEAPON, AIRCRAFT_COST_MODIFIERS, AIRCRAFT_UPKEEP_MODIFIERS } from '../data/aircraft';

interface EquipmentInput {
  activeResources: string[];
  existingNukes: number;
  factories: number;
  airports: number;
  hasConstruction: boolean;     // Construction bonus resource
  hasForeignAirBase: boolean;   // Foreign Air Force Base wonder
}

interface EquipmentResult {
  aircraftCostModifier: number;
  aircraftUpkeepModifier: number;
  aircraftLimit: number;
  cruiseMissileCost: number;
  cruiseMissileUpkeep: number;
  nukePurchaseCost: number;
  nukeUpkeep: number;
  nukeUpkeepTotal: number;
}

export function calculateEquipment(input: EquipmentInput): EquipmentResult {
  const lowerRes = input.activeResources.map(r => r.toLowerCase());

  // Aircraft cost modifier
  let aircraftCostMod = 1;
  for (const [res, discount] of Object.entries(AIRCRAFT_COST_MODIFIERS)) {
    if (lowerRes.includes(res)) {
      aircraftCostMod *= (1 - discount);
    }
  }
  // Airport improvement: -2% per airport
  aircraftCostMod *= (1 - 0.02 * input.airports);

  // Aircraft upkeep modifier
  let aircraftUpkeepMod = 1;
  for (const [res, discount] of Object.entries(AIRCRAFT_UPKEEP_MODIFIERS)) {
    if (lowerRes.includes(res)) {
      aircraftUpkeepMod *= (1 - discount);
    }
  }
  aircraftUpkeepMod *= (1 - 0.02 * input.airports);

  // Aircraft limit: 50 base, +10 with Construction, +20 with Foreign Air Force Base
  let aircraftLimit = 50;
  if (input.hasConstruction) aircraftLimit += 10;
  if (input.hasForeignAirBase) aircraftLimit += 20;

  // Cruise missile cost: $20,000 base, -5% per factory
  const cmCost = CRUISE_MISSILE.baseCost * (1 - 0.05 * input.factories);
  // Lead discount
  const cmCostFinal = lowerRes.includes('lead') ? cmCost * 0.80 : cmCost;

  // Nuke cost: $500,000 + 10% per existing nuke
  const nukeCost = NUCLEAR_WEAPON.baseCost * (1 + 0.10 * input.existingNukes);
  // Lead discount
  const nukeCostFinal = lowerRes.includes('lead') ? nukeCost * 0.80 : nukeCost;

  // Nuke upkeep: $5,000 base + 10% per nuke owned
  const nukeUpkeepPer = NUCLEAR_WEAPON.baseUpkeep * (1 + 0.10 * input.existingNukes);
  // Double if no uranium
  const nukeUpkeepFinal = lowerRes.includes('uranium') ? nukeUpkeepPer : nukeUpkeepPer * 2;

  return {
    aircraftCostModifier: aircraftCostMod,
    aircraftUpkeepModifier: aircraftUpkeepMod,
    aircraftLimit,
    cruiseMissileCost: cmCostFinal,
    cruiseMissileUpkeep: CRUISE_MISSILE.baseUpkeep,
    nukePurchaseCost: nukeCostFinal,
    nukeUpkeep: nukeUpkeepFinal,
    nukeUpkeepTotal: nukeUpkeepFinal * input.existingNukes,
  };
}
```

- [ ] **Step 2: Verify build**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/calculators/equipment.ts
git commit -m "feat: add equipment calculator for aircraft, cruise missiles, and nukes"
```

---

## Task 13: Add Happiness & Crime Tabs to Economy Page

**Files:**
- Modify: `src/app/economy/page.tsx`

- [ ] **Step 1: Add Happiness tab**

In `src/app/economy/page.tsx`, add imports at the top:

```ts
import { calculateHappiness } from '@/lib/calculators/happiness';
import { calculateCrime } from '@/lib/calculators/crime';
```

Add two new `TabsTrigger` entries to the tab bar (alongside "Infrastructure Purchase" and "Population Growth"):

```tsx
<TabsTrigger value="happiness">Happiness</TabsTrigger>
<TabsTrigger value="crime">Crime Index</TabsTrigger>
```

Add new `TabsContent` for happiness:

```tsx
<TabsContent value="happiness" className="space-y-4">
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Happiness Breakdown</CardTitle>
      <CardDescription>All sources contributing to your population happiness.</CardDescription>
    </CardHeader>
    <CardContent>
      {/* Call calculateHappiness with nation data and display breakdown table */}
      {/* Each row: Source | Value (+/-) */}
      {/* Final row: Total happiness */}
    </CardContent>
  </Card>
</TabsContent>
```

The happiness tab should call `calculateHappiness()` with data from `useNationData()` and render a table of all happiness sources with their values, plus the total.

- [ ] **Step 2: Add Crime Index tab**

Add `TabsContent` for crime:

```tsx
<TabsContent value="crime" className="space-y-4">
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Crime Index</CardTitle>
      <CardDescription>Crime prevention score, criminal count, and effects on happiness/upkeep.</CardDescription>
    </CardHeader>
    <CardContent>
      {/* Call calculateCrime with nation data */}
      {/* Display: Prevention Score, Crime Index level, Criminals, Incarcerated */}
      {/* Effects: Happiness modifier, Upkeep modifier, Criminal happiness penalty */}
    </CardContent>
  </Card>
</TabsContent>
```

The crime tab should call `calculateCrime()` and display the prevention score, crime level, criminal counts, incarceration capacity, and the effects on happiness and upkeep.

- [ ] **Step 3: Verify build**

```bash
npx tsc --noEmit && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/economy/page.tsx
git commit -m "feat: add happiness breakdown and crime index tabs to economy page"
```

---

## Task 14: Add Navy & Equipment Tabs to Military Page

**Files:**
- Modify: `src/app/military/page.tsx`

- [ ] **Step 1: Add Navy tab**

In `src/app/military/page.tsx`, add imports:

```ts
import { calculateNavy } from '@/lib/calculators/navy';
import { calculateEquipment } from '@/lib/calculators/equipment';
```

Add two new `TabsTrigger` entries:

```tsx
<TabsTrigger value="navy">Navy</TabsTrigger>
<TabsTrigger value="equipment">Equipment</TabsTrigger>
```

Add `TabsContent` for navy showing a table of all vessel types with: Name, Cost, Upkeep, Strength, Requirements, Max Supported. Rows for vessels that don't meet requirements should be dimmed.

- [ ] **Step 2: Add Equipment tab**

Add `TabsContent` for equipment showing:
- Aircraft: cost modifier, upkeep modifier, current limit
- Cruise Missiles: adjusted cost, upkeep
- Nuclear Weapons: purchase cost (with existing nuke count input), per-nuke upkeep, total upkeep

Include number inputs for `existingNukes` and `factories` so users can simulate costs.

- [ ] **Step 3: Verify build**

```bash
npx tsc --noEmit && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/military/page.tsx
git commit -m "feat: add navy and equipment tabs to military page"
```

---

## Task 15: Update Infrastructure & Upkeep Calculators with Wonder Modifiers

Wonders like Interstate System, Moon Base, Mars Base provide infra cost and upkeep discounts.

**Files:**
- Modify: `src/lib/calculators/infrastructure.ts`
- Modify: `src/lib/calculators/upkeep.ts`

- [ ] **Step 1: Update infrastructure.ts to accept wonder modifiers**

In `calculateInfraCost()`, after computing the factory modifier, add wonder-based discounts. The function should accept an optional `ownedWonders: string[]` parameter and apply:
- Interstate System: -8% (already in INFRA_MODIFIERS as 'interstate')
- Moon Base: -4%
- Mars Base: -3%
- Scientific Development Center: changes factory modifier from 0.08 to 0.10

Update the `InfraInput` type in `types.ts` to add `ownedWonders?: string[]`.

Apply after resource modifier:
```ts
if (input.ownedWonders?.includes('Moon Base')) modifier *= 0.96;
if (input.ownedWonders?.includes('Mars Base')) modifier *= 0.97;
if (input.ownedWonders?.includes('Scientific Development Center')) {
  // Factory effect is 10% instead of 8%
  // Already applied at 8%, so apply extra 2%
  if (input.factories > 0) {
    modifier *= (1 - input.factories * 0.02) / 1; // additional reduction
  }
}
```

- [ ] **Step 2: Update upkeep.ts similarly**

Add wonder-based upkeep discounts to `computeUpkeepModifier()`:
- Interstate System: -8% (already modeled)
- Moon Base: -4%
- Mars Base: -3%
- National Environment Office: -3%
- Nuclear Power Plant: -5%

- [ ] **Step 3: Verify build and run existing tests**

```bash
npx vitest run && npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/calculators/infrastructure.ts src/lib/calculators/upkeep.ts src/lib/types.ts
git commit -m "feat: add wonder-based modifiers to infrastructure and upkeep calculators"
```

---

## Task 16: Final Build Verification & Deploy

**Files:** None new — verification only.

- [ ] **Step 1: Run all tests**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Full build**

```bash
npm run build
```

Expected: all pages build successfully.

- [ ] **Step 4: Verify locally**

```bash
npm run dev
```

Manually verify:
- Home page: paste nation text, all fields parse correctly
- Economy page: infra calculator works, happiness tab shows breakdown, crime tab shows score
- Military page: mobilize shows correct tank costs, navy tab shows vessels, equipment tab shows costs
- Tech page: works as before
- Improvements page: shows all 34 improvements
- Wonders page: shows all 40+ wonders
- Resources page: works as before

- [ ] **Step 5: Deploy to Vercel**

```bash
vercel deploy --prod
```

- [ ] **Step 6: Commit all remaining changes**

```bash
git add -A
git commit -m "feat: complete game mechanics update — all improvements, wonders, calculators"
```
