export interface DefconLevel {
  level: number;
  happiness: number;
  soldierCostModifier: number;
  soldierEfficiency: number;
}

export const DEFCON_LEVELS: Record<number, DefconLevel> = {
  5: { level: 5, happiness: 2,  soldierCostModifier: 1.20, soldierEfficiency: 0.76 },
  4: { level: 4, happiness: 1,  soldierCostModifier: 1.10, soldierEfficiency: 0.81 },
  3: { level: 3, happiness: 0,  soldierCostModifier: 1.00, soldierEfficiency: 0.86 },
  2: { level: 2, happiness: -1, soldierCostModifier: 0.90, soldierEfficiency: 0.93 },
  1: { level: 1, happiness: -2, soldierCostModifier: 0.80, soldierEfficiency: 1.00 },
};
