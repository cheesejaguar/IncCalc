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

export const NAVY_COST_MODIFIERS: Record<string, { costDiscount: number; upkeepDiscount: number }> = {
  steel:      { costDiscount: 0.15, upkeepDiscount: 0 },
  oil:        { costDiscount: 0,    upkeepDiscount: 0.10 },
  lead:       { costDiscount: 0,    upkeepDiscount: 0.20 },
  uranium:    { costDiscount: 0.05, upkeepDiscount: 0.05 },
  microchips: { costDiscount: 0.10, upkeepDiscount: 0.10 },
};
