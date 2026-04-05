export interface ImprovementDef {
  name: string;
  cost: number;
  maxCount: number;
  upkeep: number;
  happinessEffect: number;
  incomeEffect: number;
  populationEffect: number;
  description: string;
}

export const IMPROVEMENTS: Record<string, ImprovementDef> = {
  'Airports':                  { name: 'Airports',                  cost: 100000, maxCount: 3, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Reduces aircraft cost and upkeep -2% each' },
  'Banks':                     { name: 'Banks',                     cost: 100000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0.07,  populationEffect: 0,    description: 'Increases population income +7%' },
  'Barracks':                  { name: 'Barracks',                  cost: 50000,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases soldier efficiency +10%, reduces soldier upkeep -10%' },
  'Border Fortifications':     { name: 'Border Fortifications',     cost: 125000, maxCount: 3, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Raises defending soldier effectiveness +2%' },
  'Border Walls':              { name: 'Border Walls',              cost: 60000,  maxCount: 1, upkeep: 5000, happinessEffect: 2,    incomeEffect: 0,     populationEffect: -0.02, description: 'Decreases citizen count -2%, increases happiness +2' },
  'Bunkers':                   { name: 'Bunkers',                   cost: 200000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Reduces infra damage from aircraft/missiles/nukes -3%' },
  'Casinos':                   { name: 'Casinos',                   cost: 100000, maxCount: 2, upkeep: 5000, happinessEffect: 1.5,  incomeEffect: -0.01, populationEffect: 0,    description: 'Increases happiness +1.5, decreases citizen income -1%' },
  'Churches':                  { name: 'Churches',                  cost: 40000,  maxCount: 5, upkeep: 5000, happinessEffect: 1,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases population happiness +1' },
  'Clinics':                   { name: 'Clinics',                   cost: 50000,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0.02, description: 'Increases population count +2%' },
  'Drydocks':                  { name: 'Drydocks',                  cost: 100000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases ship support +1 per type' },
  'Factories':                 { name: 'Factories',                 cost: 150000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Reduces infra cost -8%, tank cost -10%, cruise missile cost -5%' },
  'Foreign Ministries':        { name: 'Foreign Ministries',        cost: 120000, maxCount: 1, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0.05,  populationEffect: 0,    description: 'Increases population income +5%, opens +1 foreign aid slot' },
  'Forward Operating Bases':   { name: 'Forward Operating Bases',   cost: 125000, maxCount: 2, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases ground attack +5%, reduces defending soldiers -3%' },
  'Guerilla Camps':            { name: 'Guerilla Camps',            cost: 20000,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: -0.08, populationEffect: 0,    description: 'Increases soldier efficiency +35%, reduces income -8%' },
  'Harbors':                   { name: 'Harbors',                   cost: 200000, maxCount: 1, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0.01,  populationEffect: 0,    description: 'Increases population income +1%, opens +1 trade slot' },
  'Hospitals':                 { name: 'Hospitals',                 cost: 180000, maxCount: 1, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0.06, description: 'Increases population count +6%. Requires 2 clinics' },
  'Intelligence Agencies':     { name: 'Intelligence Agencies',     cost: 38500,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Allows +100 spies each, +1 happiness if tax >23%' },
  'Jails':                     { name: 'Jails',                     cost: 25000,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Incarcerates up to 500 criminals' },
  'Labor Camps':               { name: 'Labor Camps',               cost: 150000, maxCount: 5, upkeep: 5000, happinessEffect: -1,   incomeEffect: 0,     populationEffect: 0,    description: 'Reduces infra upkeep -10%, reduces happiness -1' },
  'Missile Defenses':          { name: 'Missile Defenses',          cost: 90000,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Reduces incoming cruise missile effectiveness -10%' },
  'Munitions Factories':       { name: 'Munitions Factories',       cost: 200000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases enemy infra damage from aircraft/missiles/nukes +3%' },
  'Naval Academies':           { name: 'Naval Academies',           cost: 300000, maxCount: 2, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases navy vessel strength +1 attack and defense' },
  'Naval Construction Yards':  { name: 'Naval Construction Yards',  cost: 300000, maxCount: 3, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases daily navy purchase limit +1' },
  'Offices of Propaganda':     { name: 'Offices of Propaganda',     cost: 200000, maxCount: 2, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Decreases enemy defending soldiers -3%' },
  'Police Headquarters':       { name: 'Police Headquarters',       cost: 75000,  maxCount: 5, upkeep: 5000, happinessEffect: 2,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases population happiness +2' },
  'Prisons':                   { name: 'Prisons',                   cost: 200000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Incarcerates up to 5,000 criminals' },
  'Radiation Containment':     { name: 'Radiation Containment',     cost: 200000, maxCount: 2, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Lowers global radiation level -20%' },
  'Red Light Districts':       { name: 'Red Light Districts',       cost: 50000,  maxCount: 2, upkeep: 5000, happinessEffect: 1,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases happiness +1, penalizes environment -0.5' },
  'Rehabilitation Facilities': { name: 'Rehabilitation Facilities', cost: 500000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Converts up to 500 criminals to citizens' },
  'Satellites':                { name: 'Satellites',                cost: 90000,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases cruise missile effectiveness +10%' },
  'Schools':                   { name: 'Schools',                   cost: 85000,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0.05,  populationEffect: 0,    description: 'Increases income +5%, literacy +1%' },
  'Shipyards':                 { name: 'Shipyards',                 cost: 100000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Enables navy vessels, +1 ship support' },
  'Stadiums':                  { name: 'Stadiums',                  cost: 110000, maxCount: 5, upkeep: 5000, happinessEffect: 3,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases population happiness +3' },
  'Universities':              { name: 'Universities',              cost: 180000, maxCount: 2, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0.08,  populationEffect: 0,    description: 'Increases income +8%, reduces tech cost -10%. Requires 3 schools' },
};

// Short abbreviations for display in compact grids
export const IMPROVEMENT_ABBREVS: Record<string, string> = {
  'Airports': 'Air', 'Banks': 'Bank', 'Barracks': 'Barr', 'Border Fortifications': 'BFrt',
  'Border Walls': 'Wall', 'Bunkers': 'Bunk', 'Casinos': 'Cas', 'Churches': 'Chur',
  'Clinics': 'Clin', 'Drydocks': 'Dry', 'Factories': 'Fact', 'Foreign Ministries': 'FMin',
  'Forward Operating Bases': 'FOB', 'Guerilla Camps': 'GCmp', 'Harbors': 'Harb',
  'Hospitals': 'Hosp', 'Intelligence Agencies': 'Intl', 'Jails': 'Jail',
  'Labor Camps': 'LabC', 'Missile Defenses': 'MDef', 'Munitions Factories': 'MFac',
  'Naval Academies': 'NAcd', 'Naval Construction Yards': 'NCY', 'Offices of Propaganda': 'Prop',
  'Police Headquarters': 'Poli', 'Prisons': 'Pris', 'Radiation Containment': 'RadC',
  'Red Light Districts': 'RLD', 'Rehabilitation Facilities': 'Rehb', 'Satellites': 'Sat',
  'Schools': 'Schl', 'Shipyards': 'Ship', 'Stadiums': 'Stad', 'Universities': 'Univ',
};
