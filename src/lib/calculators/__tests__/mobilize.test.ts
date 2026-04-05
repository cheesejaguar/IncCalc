import { describe, it, expect } from 'vitest';
import { calculateMobilize } from '../mobilize';

describe('calculateMobilize', () => {
  it('calculates tank cost as soldierCost × 40', () => {
    const result = calculateMobilize({
      citizens: 10000, currentSoldiers: 0, currentTanks: 0,
      guerillaCamps: 0, barracks: 0, activeResources: [], defcon: 3, factories: 0,
    });
    expect(result.soldierCost).toBeCloseTo(8);
    expect(result.tankCost).toBeCloseTo(320);
    expect(result.tankUpkeep).toBeCloseTo(40);
  });

  it('applies iron and oil discounts to soldier cost, which cascades to tank cost', () => {
    const result = calculateMobilize({
      citizens: 10000, currentSoldiers: 0, currentTanks: 0,
      guerillaCamps: 0, barracks: 0, activeResources: ['iron', 'oil'], defcon: 3, factories: 0,
    });
    expect(result.soldierCost).toBeCloseTo(2);
    expect(result.tankCost).toBeCloseTo(80);
    expect(result.tankUpkeep).toBeCloseTo(40 * 0.95 * 0.95); // 36.1
  });

  it('applies DEFCON modifier to soldier cost', () => {
    const result = calculateMobilize({
      citizens: 10000, currentSoldiers: 0, currentTanks: 0,
      guerillaCamps: 0, barracks: 0, activeResources: [], defcon: 5, factories: 0,
    });
    expect(result.soldierCost).toBeCloseTo(9.6);
    expect(result.tankCost).toBeCloseTo(384);
    expect(result.tankUpkeep).toBeCloseTo(40);
  });

  it('applies lead discount to tank cost after base calculation', () => {
    const result = calculateMobilize({
      citizens: 10000, currentSoldiers: 0, currentTanks: 0,
      guerillaCamps: 0, barracks: 0, activeResources: ['lead'], defcon: 3, factories: 0,
    });
    expect(result.tankCost).toBeCloseTo(294.4);
    expect(result.tankUpkeep).toBeCloseTo(40);
  });
});
