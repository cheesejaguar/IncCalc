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
    // defensiveMod = (50 + 1000/20 + 700/70) * 1.0 = 110
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
