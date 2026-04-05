export interface NationData {
  // Government
  government: string;
  religion: string;

  // Core stats
  tech: number;
  infra: number;
  land: number;
  purchasedLand: number;
  naturalLand: number;
  population: number;
  citizens: number;
  income: number;
  grossIncome: number;
  happiness: number;
  nationStrength: number;
  taxRate: number;
  environment: number;
  cash: number;
  defcon: number;

  // Military
  soldiers: number;
  tanks: number;
  aircraft: number;
  nukes: number;
  spies: number;

  // Resources
  baseResources: string[];
  connectedResources: string[];
  bonusResources: string[];

  // Improvements (name -> count)
  improvements: Record<string, number>;

  // Wonders
  wonders: string[];
}

export function createEmptyNation(): NationData {
  return {
    government: '',
    religion: '',
    tech: 0,
    infra: 0,
    land: 0,
    purchasedLand: 0,
    naturalLand: 0,
    population: 0,
    citizens: 0,
    income: 0,
    grossIncome: 0,
    happiness: 0,
    nationStrength: 0,
    taxRate: 0,
    environment: 0,
    cash: 0,
    defcon: 0,
    soldiers: 0,
    tanks: 0,
    aircraft: 0,
    nukes: 0,
    spies: 0,
    baseResources: [],
    connectedResources: [],
    bonusResources: [],
    improvements: {},
    wonders: [],
  };
}

export interface InfraInput {
  currentInfra: number;
  purchaseAmount: number;
  factories: number;
  activeResources: string[];
  ownedWonders?: string[];
}

export interface InfraResult {
  totalCost: number;
  modifier: number;
  kValue: number;
}

export interface PopulationInput {
  currentInfra: number;
  purchaseAmount: number;
  land: number;
  existingCitizens: number;
  clinics: number;
  walls: number;
  hospitals: number;
  activeResources: string[];
}

export interface PopulationResult {
  citizensGained: number;
  totalCitizens: number;
  modifier: number;
}

export interface UpkeepInput {
  currentInfra: number;
  purchaseAmount: number;
  tech: number;
  nationStrength: number;
  laborCamps: number;
  activeResources: string[];
  ownedWonders?: string[];
}

export interface UpkeepResult {
  costPerLevel: number;
  costPerLevelAfter: number;
  totalBillBefore: number;
  totalBillAfter: number;
  billIncrease: number;
  modifier: number;
}

export interface TechInput {
  currentTech: number;
  purchaseAmount: number;
  universities: number;
  activeResources: string[];
}

export interface TechResult {
  totalCost: number;
  costPerLevel: number;
  modifier: number;
}

export interface MobilizeInput {
  citizens: number;
  currentSoldiers: number;
  currentTanks: number;
  guerillaCamps: number;
  barracks: number;
  activeResources: string[];
  defcon: number;
}

export interface MobilizeResult {
  maxSoldiers: number;
  soldierCost: number;
  totalSoldierCost: number;
  maxTanks: number;
  tankCost: number;
  totalTankCost: number;
  modifier: number;
}

export interface SpyOddsInput {
  mySpies: number;
  myTech: number;
  enemySpies: number;
  enemyTech: number;
  enemyLand: number;
  threatLevel: ThreatLevel;
}

export type ThreatLevel = 'Low' | 'Guarded' | 'Elevated' | 'High' | 'Severe';

export interface SpyOddsResult {
  successRate: number;
  offensiveMod: number;
  defensiveMod: number;
}

export interface WonderProjection {
  name: string;
  projectedIncome: number;
  incomeGain: number;
  cost: number;
  daysToROI: number;
  owned: boolean;
  isBest: boolean;
}

export interface ImprovementAnalysis {
  name: string;
  currentCount: number;
  incomeChange: number;
  cost: number;
  roi: string;
  infraPerDay: number;
  canPurchase: boolean;
}

export interface HappinessBreakdownItem {
  source: string;
  value: number;
}

export interface HappinessResult {
  total: number;
  breakdown: HappinessBreakdownItem[];
}
