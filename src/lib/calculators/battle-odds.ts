import { DEFCON_LEVELS } from '../data/defcon';

export interface BattleInput {
  attackerSoldiers: number;
  attackerTanks: number;
  attackerTech: number;
  attackerDEFCON: number;
  defenderSoldiers: number;
  defenderTanks: number;
  defenderTech: number;
  defenderInfra: number;
  defenderLand: number;
  defenderDEFCON: number;
  isNightAttack: boolean;
}

export interface BattleResult {
  attackerStrength: number;
  defenderStrength: number;
  successRate: number;        // probability of attacker winning (0–100)
  attackerAdvantage: string;  // "Attacker favored" / "Defender favored" / "Even"
}

/**
 * Clamp a DEFCON value to valid range 1–5, defaulting to 5 if invalid.
 */
function clampDefcon(defcon: number): number {
  if (defcon >= 1 && defcon <= 5) return Math.round(defcon);
  return 5;
}

/**
 * Calculate ground battle odds.
 *
 * Battle strength formulas:
 *   soldier_efficiency = DEFCON_LEVELS[defcon].soldierEfficiency
 *   soldier_strength   = soldiers × 2 × efficiency
 *   tank_attack_str    = tanks × 25
 *   tank_defend_str    = tanks × 30
 *   tech_bonus         = 1 + tech × 0.0001
 *
 *   attacker_total = (soldier_strength + tank_attack_strength) × tech_bonus
 *   defender_total = (soldier_strength + tank_defend_strength)
 *                    × tech_bonus
 *                    × (1 + infra / 100000)
 *                    × (1 + land / 100000)
 *
 * Night attack: +5% attacker tech bonus (multiply tech_bonus × 1.05).
 * Day bonus:    +1% soldier efficiency for both sides.
 *
 * Success rate = 100 × attackerTotal / (attackerTotal + defenderTotal)
 */
export function calculateBattleOdds(input: BattleInput): BattleResult {
  const atkDefcon = DEFCON_LEVELS[clampDefcon(input.attackerDEFCON)];
  const defDefcon = DEFCON_LEVELS[clampDefcon(input.defenderDEFCON)];

  let atkEfficiency = atkDefcon.soldierEfficiency;
  let defEfficiency = defDefcon.soldierEfficiency;

  // Day bonus: +1% soldier efficiency for both sides
  if (!input.isNightAttack) {
    atkEfficiency *= 1.01;
    defEfficiency *= 1.01;
  }

  const atkSoldierStrength = input.attackerSoldiers * 2 * atkEfficiency;
  const defSoldierStrength = input.defenderSoldiers * 2 * defEfficiency;

  const atkTankStrength = input.attackerTanks * 25;
  const defTankStrength = input.defenderTanks * 30;

  let atkTechBonus = 1 + input.attackerTech * 0.0001;
  const defTechBonus = 1 + input.defenderTech * 0.0001;

  // Night attack: attacker gets +5% tech bonus
  if (input.isNightAttack) {
    atkTechBonus *= 1.05;
  }

  const defInfraBonus = 1 + input.defenderInfra / 100000;
  const defLandBonus  = 1 + input.defenderLand  / 100000;

  const attackerStrength =
    (atkSoldierStrength + atkTankStrength) * atkTechBonus;

  const defenderStrength =
    (defSoldierStrength + defTankStrength) *
    defTechBonus *
    defInfraBonus *
    defLandBonus;

  const total = attackerStrength + defenderStrength;
  const successRate = total > 0 ? (100 * attackerStrength) / total : 50;

  let attackerAdvantage: string;
  if (successRate > 52) {
    attackerAdvantage = 'Attacker favored';
  } else if (successRate < 48) {
    attackerAdvantage = 'Defender favored';
  } else {
    attackerAdvantage = 'Even';
  }

  return {
    attackerStrength,
    defenderStrength,
    successRate,
    attackerAdvantage,
  };
}

/**
 * Generate battle odds curve: success rate vs attacker soldier count.
 */
export function generateBattleOddsCurve(
  input: Omit<BattleInput, 'attackerSoldiers'>,
  maxSoldiers: number,
  step = 100
): Array<{ soldiers: number; successRate: number }> {
  const data: Array<{ soldiers: number; successRate: number }> = [];
  for (let soldiers = 0; soldiers <= maxSoldiers; soldiers += step) {
    const result = calculateBattleOdds({ ...input, attackerSoldiers: soldiers });
    data.push({
      soldiers,
      successRate: Math.round(result.successRate * 100) / 100,
    });
  }
  return data;
}
