export interface ImprovementDef {
  name: string;
  cost: number;
  maxCount: number;
}

export const IMPROVEMENTS: Record<string, ImprovementDef> = {
  'Banks':                  { name: 'Banks',                  cost: 100000, maxCount: 5 },
  'Border Walls':           { name: 'Border Walls',           cost: 60000,  maxCount: 5 },
  'Churches':               { name: 'Churches',               cost: 40000,  maxCount: 5 },
  'Clinics':                { name: 'Clinics',                cost: 50000,  maxCount: 5 },
  'Factories':              { name: 'Factories',              cost: 150000, maxCount: 5 },
  'Foreign Ministries':     { name: 'Foreign Ministries',     cost: 120000, maxCount: 1 },
  'Guerilla Camps':         { name: 'Guerilla Camps',         cost: 20000,  maxCount: 5 },
  'Harbors':                { name: 'Harbors',                cost: 200000, maxCount: 1 },
  'Hospitals':              { name: 'Hospitals',              cost: 180000, maxCount: 1 },
  'Intelligence Agencies':  { name: 'Intelligence Agencies',  cost: 38500,  maxCount: 5 },
  'Labor Camps':            { name: 'Labor Camps',            cost: 150000, maxCount: 5 },
  'Police Headquarters':    { name: 'Police Headquarters',    cost: 75000,  maxCount: 5 },
  'Schools':                { name: 'Schools',                cost: 85000,  maxCount: 5 },
  'Stadiums':               { name: 'Stadiums',               cost: 110000, maxCount: 5 },
  'Universities':           { name: 'Universities',           cost: 180000, maxCount: 2 },
};

// Short abbreviations for display in compact grids
export const IMPROVEMENT_ABBREVS: Record<string, string> = {
  'Banks': 'Bank',
  'Border Walls': 'Wall',
  'Churches': 'Chur',
  'Clinics': 'Clin',
  'Factories': 'Fact',
  'Foreign Ministries': 'FMin',
  'Guerilla Camps': 'GCmp',
  'Harbors': 'Harb',
  'Hospitals': 'Hosp',
  'Intelligence Agencies': 'Intl',
  'Labor Camps': 'LabC',
  'Police Headquarters': 'Poli',
  'Schools': 'Schl',
  'Stadiums': 'Stad',
  'Universities': 'Univ',
};
