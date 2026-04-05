import type { SpyOddsInput, SpyOddsResult, ThreatLevel } from '../types';

/**
 * Threat level multipliers.
 * Ported from spyodds.class.php setLevel() lines 26-43.
 */
const THREAT_MULTIPLIERS: Record<ThreatLevel, number> = {
  Low: 0.75,
  Guarded: 0.90,
  Elevated: 1.0,
  High: 1.10,
  Severe: 1.25,
};

/**
 * Calculate spy operation success probability.
 * Ported from spyodds.class.php getOdds() lines 77-83.
 *
 * Offensive modifier = mySpies + (myTech / 20)
 * Defensive modifier = (enemySpies + (enemyLand + enemyTech) / 20) * threatMod
 * Success rate = 100 * offensive / (offensive + defensive)
 */
export function calculateSpyOdds(input: SpyOddsInput): SpyOddsResult {
  const threatMod = THREAT_MULTIPLIERS[input.threatLevel];

  const offensiveMod = input.mySpies + input.myTech / 20;
  const defensiveMod =
    (input.enemySpies + (input.enemyLand + input.enemyTech) / 20) * threatMod;

  const successRate =
    offensiveMod + defensiveMod > 0
      ? (100 * offensiveMod) / (offensiveMod + defensiveMod)
      : 0;

  return {
    successRate,
    offensiveMod,
    defensiveMod,
  };
}

/**
 * Generate data points for the spy odds chart.
 * Plots success rate vs enemy spy count from 0 to maxEnemySpies.
 */
export function generateSpyOddsChartData(
  input: Omit<SpyOddsInput, 'enemySpies'>,
  maxEnemySpies = 550,
  step = 10
): Array<{ enemySpies: number; successRate: number }> {
  const data: Array<{ enemySpies: number; successRate: number }> = [];

  for (let spies = 0; spies <= maxEnemySpies; spies += step) {
    const result = calculateSpyOdds({ ...input, enemySpies: spies });
    data.push({
      enemySpies: spies,
      successRate: Math.round(result.successRate * 100) / 100,
    });
  }

  return data;
}

export { THREAT_MULTIPLIERS };
