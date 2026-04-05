export interface ImprovementDef {
  name: string;
  cost: number;
  maxCount: number;
  upkeep: number;
  happinessEffect: number;
  incomeEffect: number;
  populationEffect: number;
  description: string;
  prerequisites: string[];  // improvement/resource names required before purchase
}

export const IMPROVEMENTS: Record<string, ImprovementDef> = {
  'Airports':                  { name: 'Airports',                  cost: 100000, maxCount: 3, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Reduces aircraft cost and upkeep -2% each',                                prerequisites: [] },
  'Banks':                     { name: 'Banks',                     cost: 100000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0.07,  populationEffect: 0,    description: 'Increases population income +7%',                                          prerequisites: [] },
  'Barracks':                  { name: 'Barracks',                  cost: 50000,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases soldier efficiency +10%, reduces soldier upkeep -10%',           prerequisites: [] },
  'Border Fortifications':     { name: 'Border Fortifications',     cost: 125000, maxCount: 3, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Raises defending soldier effectiveness +2%',                               prerequisites: ['Border Walls'] },
  'Border Walls':              { name: 'Border Walls',              cost: 60000,  maxCount: 1, upkeep: 5000, happinessEffect: 2,    incomeEffect: 0,     populationEffect: -0.02, description: 'Decreases citizen count -2%, increases happiness +2',                      prerequisites: [] },
  'Bunkers':                   { name: 'Bunkers',                   cost: 200000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Reduces infra damage from aircraft/missiles/nukes -3%',                   prerequisites: ['Barracks'] },
  'Casinos':                   { name: 'Casinos',                   cost: 100000, maxCount: 2, upkeep: 5000, happinessEffect: 1.5,  incomeEffect: -0.01, populationEffect: 0,    description: 'Increases happiness +1.5, decreases citizen income -1%',                  prerequisites: [] },
  'Churches':                  { name: 'Churches',                  cost: 40000,  maxCount: 5, upkeep: 5000, happinessEffect: 1,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases population happiness +1',                                        prerequisites: [] },
  'Clinics':                   { name: 'Clinics',                   cost: 50000,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0.02, description: 'Increases population count +2%',                                           prerequisites: [] },
  'Drydocks':                  { name: 'Drydocks',                  cost: 100000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases ship support +1 per type',                                       prerequisites: ['Harbors'] },
  'Factories':                 { name: 'Factories',                 cost: 150000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Reduces infra cost -8%, tank cost -10%, cruise missile cost -5%',          prerequisites: [] },
  'Foreign Ministries':        { name: 'Foreign Ministries',        cost: 120000, maxCount: 1, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0.05,  populationEffect: 0,    description: 'Increases population income +5%, opens +1 foreign aid slot',               prerequisites: [] },
  'Forward Operating Bases':   { name: 'Forward Operating Bases',   cost: 125000, maxCount: 2, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases ground attack +5%, reduces defending soldiers -3%',             prerequisites: ['Barracks'] },
  'Guerilla Camps':            { name: 'Guerilla Camps',            cost: 20000,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: -0.08, populationEffect: 0,    description: 'Increases soldier efficiency +35%, reduces income -8%',                   prerequisites: [] },
  'Harbors':                   { name: 'Harbors',                   cost: 200000, maxCount: 1, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0.01,  populationEffect: 0,    description: 'Increases population income +1%, opens +1 trade slot',                    prerequisites: [] },
  'Hospitals':                 { name: 'Hospitals',                 cost: 180000, maxCount: 1, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0.06, description: 'Increases population count +6%. Requires 2 clinics',                      prerequisites: ['Clinics'] },
  'Intelligence Agencies':     { name: 'Intelligence Agencies',     cost: 38500,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Allows +100 spies each, +1 happiness if tax >23%',                        prerequisites: [] },
  'Jails':                     { name: 'Jails',                     cost: 25000,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Incarcerates up to 500 criminals',                                         prerequisites: [] },
  'Labor Camps':               { name: 'Labor Camps',               cost: 150000, maxCount: 5, upkeep: 5000, happinessEffect: -1,   incomeEffect: 0,     populationEffect: 0,    description: 'Reduces infra upkeep -10%, reduces happiness -1',                          prerequisites: [] },
  'Missile Defenses':          { name: 'Missile Defenses',          cost: 90000,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Reduces incoming cruise missile effectiveness -10%',                       prerequisites: [] },
  'Munitions Factories':       { name: 'Munitions Factories',       cost: 200000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases enemy infra damage from aircraft/missiles/nukes +3%',           prerequisites: ['Factories'] },
  'Naval Academies':           { name: 'Naval Academies',           cost: 300000, maxCount: 2, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases navy vessel strength +1 attack and defense',                    prerequisites: ['Harbors'] },
  'Naval Construction Yards':  { name: 'Naval Construction Yards',  cost: 300000, maxCount: 3, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases daily navy purchase limit +1',                                   prerequisites: ['Harbors'] },
  'Offices of Propaganda':     { name: 'Offices of Propaganda',     cost: 200000, maxCount: 2, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Decreases enemy defending soldiers -3%',                                  prerequisites: ['Forward Operating Bases'] },
  'Police Headquarters':       { name: 'Police Headquarters',       cost: 75000,  maxCount: 5, upkeep: 5000, happinessEffect: 2,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases population happiness +2',                                        prerequisites: [] },
  'Prisons':                   { name: 'Prisons',                   cost: 200000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Incarcerates up to 5,000 criminals',                                       prerequisites: [] },
  'Radiation Containment':     { name: 'Radiation Containment',     cost: 200000, maxCount: 2, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Lowers global radiation level -20%',                                       prerequisites: ['Bunkers'] },
  'Red Light Districts':       { name: 'Red Light Districts',       cost: 50000,  maxCount: 2, upkeep: 5000, happinessEffect: 1,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases happiness +1, penalizes environment -0.5',                       prerequisites: [] },
  'Rehabilitation Facilities': { name: 'Rehabilitation Facilities', cost: 500000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Converts up to 500 criminals to citizens',                                 prerequisites: [] },
  'Satellites':                { name: 'Satellites',                cost: 90000,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases cruise missile effectiveness +10%',                              prerequisites: [] },
  'Schools':                   { name: 'Schools',                   cost: 85000,  maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0.05,  populationEffect: 0,    description: 'Increases income +5%, literacy +1%',                                       prerequisites: [] },
  'Shipyards':                 { name: 'Shipyards',                 cost: 100000, maxCount: 5, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0,     populationEffect: 0,    description: 'Enables navy vessels, +1 ship support',                                    prerequisites: ['Harbors'] },
  'Stadiums':                  { name: 'Stadiums',                  cost: 110000, maxCount: 5, upkeep: 5000, happinessEffect: 3,    incomeEffect: 0,     populationEffect: 0,    description: 'Increases population happiness +3',                                        prerequisites: [] },
  'Universities':              { name: 'Universities',              cost: 180000, maxCount: 2, upkeep: 5000, happinessEffect: 0,    incomeEffect: 0.08,  populationEffect: 0,    description: 'Increases income +8%, reduces tech cost -10%. Requires 3 schools',         prerequisites: ['Schools'] },
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
