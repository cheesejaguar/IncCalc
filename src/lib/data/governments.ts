export interface GovernmentDef {
  name: string;
  infraDiscount: boolean;
  soldierBonus: boolean;
  militaryUpkeepDiscount: boolean;
  spyBonus: boolean;
  landBonus: boolean;
  improvementUpkeepDiscount: boolean;
  happinessBonus: number;
  environmentBonus: boolean;
}

export const GOVERNMENTS: Record<string, GovernmentDef> = {
  'Anarchy':                  { name: 'Anarchy',                  infraDiscount: false, soldierBonus: false, militaryUpkeepDiscount: false, spyBonus: false, landBonus: false, improvementUpkeepDiscount: false, happinessBonus: 0, environmentBonus: false },
  'Capitalist':               { name: 'Capitalist',               infraDiscount: true,  soldierBonus: false, militaryUpkeepDiscount: false, spyBonus: false, landBonus: false, improvementUpkeepDiscount: true,  happinessBonus: 0, environmentBonus: true },
  'Communist':                { name: 'Communist',                infraDiscount: false, soldierBonus: true,  militaryUpkeepDiscount: true,  spyBonus: true,  landBonus: true,  improvementUpkeepDiscount: false, happinessBonus: 0, environmentBonus: false },
  'Democracy':                { name: 'Democracy',                infraDiscount: false, soldierBonus: true,  militaryUpkeepDiscount: false, spyBonus: false, landBonus: false, improvementUpkeepDiscount: false, happinessBonus: 1, environmentBonus: true },
  'Dictatorship':             { name: 'Dictatorship',             infraDiscount: true,  soldierBonus: true,  militaryUpkeepDiscount: true,  spyBonus: false, landBonus: false, improvementUpkeepDiscount: false, happinessBonus: 0, environmentBonus: false },
  'Federal Government':       { name: 'Federal Government',       infraDiscount: true,  soldierBonus: true,  militaryUpkeepDiscount: false, spyBonus: false, landBonus: false, improvementUpkeepDiscount: true,  happinessBonus: 0, environmentBonus: false },
  'Monarchy':                 { name: 'Monarchy',                 infraDiscount: true,  soldierBonus: false, militaryUpkeepDiscount: false, spyBonus: false, landBonus: true,  improvementUpkeepDiscount: false, happinessBonus: 1, environmentBonus: false },
  'Republic':                 { name: 'Republic',                 infraDiscount: true,  soldierBonus: false, militaryUpkeepDiscount: false, spyBonus: true,  landBonus: true,  improvementUpkeepDiscount: false, happinessBonus: 0, environmentBonus: true },
  'Revolutionary Government': { name: 'Revolutionary Government', infraDiscount: true,  soldierBonus: false, militaryUpkeepDiscount: false, spyBonus: false, landBonus: false, improvementUpkeepDiscount: true,  happinessBonus: 1, environmentBonus: false },
  'Totalitarian State':       { name: 'Totalitarian State',       infraDiscount: false, soldierBonus: false, militaryUpkeepDiscount: true,  spyBonus: false, landBonus: true,  improvementUpkeepDiscount: false, happinessBonus: 1, environmentBonus: false },
  'Transitional':             { name: 'Transitional',             infraDiscount: false, soldierBonus: true,  militaryUpkeepDiscount: true,  spyBonus: true,  landBonus: true,  improvementUpkeepDiscount: false, happinessBonus: 0, environmentBonus: false },
};
