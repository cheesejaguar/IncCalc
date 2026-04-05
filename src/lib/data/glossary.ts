/**
 * Game term definitions used for tooltips and help text throughout the app.
 * Each term has a short definition (for tooltips) and optionally a longer explanation.
 */
export const GLOSSARY: Record<string, { short: string; long?: string }> = {
  // Core stats
  'Infrastructure': {
    short: 'Represents your nation\'s development level. Higher infra increases population, income, and costs.',
    long: 'Infrastructure prices increase as you buy more due to supply and demand. Infra can be destroyed in war. Defenders receive a battle bonus based on their infra level.',
  },
  'Technology': {
    short: 'Improves combat effectiveness, spy success, and lowers infrastructure upkeep. Costs increase with each level.',
    long: 'Each tech level adds +0.01% damage in combat. Tech also gives happiness (+5 at level 15+) and reduces infra upkeep by up to 10%. Formula: (Tech×2)/NS = % off upkeep.',
  },
  'Nation Strength': {
    short: 'Composite score determining your war targets. Calculated from infra, tech, land, military, and equipment.',
    long: 'NS = Land×1.5 + Tanks(deployed)×0.15 + Tanks(defending)×0.20 + Cruise Missiles×10 + Nukes²×10 + Tech×5 + Infra×3 + Soldiers×0.02 + Aircraft×5 + Navy×10.',
  },
  'War Range': {
    short: 'You can attack nations between 75% and 133% of your Nation Strength. Nations outside this range cannot be targeted.',
  },
  'DEFCON': {
    short: 'Defense Condition level (1-5). DEFCON 5 is peacetime (+2 happiness, soldiers cost +20%). DEFCON 1 is maximum readiness (-2 happiness, soldiers cost -20%, 100% efficiency).',
  },
  'Threat Level': {
    short: 'Risk of spy attacks against your nation. Affects counter-intelligence and happiness. Low (-0 hap, 75% CI), Guarded (-0.5, 90%), Elevated (-1, 100%), High (-1.5, 110%), Severe (-2, 125%).',
  },
  'Happiness': {
    short: 'Determines citizen income. Each point of happiness adds $2/citizen/day to base income. Affected by tax rate, tech, DEFCON, resources, improvements, and wonders.',
  },
  'Environment': {
    short: 'Affects population count and happiness. Improved by Water, Border Walls, and National Environment Office. Harmed by Coal, Oil, Uranium, and nuclear weapons.',
  },
  'Tax Rate': {
    short: 'Percentage of citizen income collected as taxes. Higher rates collect more but reduce happiness (each 1% above 28% costs -1 happiness). Optimal rate balances collection vs. happiness loss.',
  },
  'Crime Index': {
    short: 'Ranges from 0 (negligible) to 6 (extreme). Affects infrastructure upkeep (-2% to +3%) and happiness (+2 to -3). Improved by Police HQ, Schools, Universities, and low tax rates.',
  },

  // Land
  'Land': {
    short: 'Your nation\'s territory in miles. Grows naturally at 0.5 miles/day. Affects population density, spy defense (+Land/70), and can be captured in war.',
  },
  'Peak Land': {
    short: 'The highest land level your nation has ever reached. If you buy land below this peak, you get a 50% rebuy discount.',
  },

  // Military
  'Soldiers': {
    short: 'Base military units. Can deploy up to 80% per day. Battle strength = Soldiers × 2 × DEFCON efficiency. Soldier cost is $8 base, modified by DEFCON, Iron (-$3), and Oil (-$3).',
  },
  'Tanks': {
    short: 'Heavy military units. Purchase limit: min(10% of soldiers, 8% of citizens). Cost = Soldier Cost × 40. Attack strength: Tanks × 25. Defense strength: Tanks × 30.',
  },
  'Aircraft': {
    short: 'Air units with strength ratings 1-9. Base limit: 50 (+10 with Construction, +20 with Foreign Air Force Base). Two attack missions per war per day.',
  },
  'Cruise Missiles': {
    short: '$20,000 each, $200/day upkeep. Base damage: 10 tanks, 1 tech, 5 infra destroyed. Up to 2 per battle front per day. Lead reduces cost/upkeep by 20%.',
  },
  'Nuclear Weapons': {
    short: '$500K base (+10% per existing nuke). $5K/day upkeep (+10% per nuke, doubled without Uranium). Devastating damage but require Tech 75+, Infra 1000+, and Uranium.',
  },
  'Spies': {
    short: '$100K each. Base limit: 50 (+100 per Intelligence Agency, +250 with CIA wonder). Success = Spies + Tech/20 vs enemy Spies + Tech/20 + Land/70.',
  },

  // Economy
  'Warchest': {
    short: 'Your cash reserve for sustaining bills during wartime. Recommended: 30 days of wartime bills. Nations at war face higher military upkeep costs.',
  },
  'Upkeep': {
    short: 'Daily infrastructure maintenance cost. Increases with infra level. Reduced by Iron (-10%), Lumber (-8%), Uranium (-3%), Labor Camps (-10%), and Technology.',
  },
  'K-Value': {
    short: 'Cost multiplier that increases at infra level breakpoints (20, 30, 100, 300, 1000, 3000, 5000, 8000). Higher K-values make each level more expensive.',
  },
  'Income Modifier': {
    short: 'Multiplicative bonus from improvements: Banks (+7%), Schools (+5%), Universities (+8%), Foreign Ministry (+5%), Harbor (+1%). Guerilla Camps reduce income by -8%.',
  },

  // Improvements
  'Factories': {
    short: 'Reduce infrastructure purchase cost by 8% each (up to 5). Also reduce tank cost by 10% and cruise missile cost by 5%. $150K each, $5K/day upkeep.',
  },
  'Banks': {
    short: 'Increase population income by 7% each (up to 5). $100K each, $5K/day upkeep.',
  },
  'Clinics': {
    short: 'Increase population count by 2% each (up to 5). Purchasing 2+ clinics allows buying a Hospital. $50K each.',
  },
  'Hospitals': {
    short: 'Increase population count by 6%. Max 1. Requires 2+ Clinics. $180K, $5K/day upkeep.',
  },
  'Labor Camps': {
    short: 'Reduce infrastructure upkeep by 10% each but cost -1 happiness each. Also incarcerate 200 criminals each. $150K, max 5.',
  },
  'Universities': {
    short: 'Increase income by 8% and reduce tech cost by 10% each. Max 2, requires 3+ Schools. $180K each.',
  },
  'Guerilla Camps': {
    short: 'Increase soldier efficiency by +35% each (exponential stacking) but reduce citizen income by -8% each. Very powerful for military but costly economically.',
  },
  'Barracks': {
    short: 'Increase soldier efficiency by +10% each (exponential) and reduce soldier upkeep by 10%. $50K each, max 5.',
  },

  // Wonders
  'Interstate System': {
    short: 'Wonder. Reduces infra purchase cost -8% AND infra upkeep -8%. $45M. One of the best economic wonders.',
  },
  'Stock Market': {
    short: 'Wonder. Adds +$10 to citizen daily income. $30M. Best early wonder for income-focused nations.',
  },

  // Trade
  'Trade Circle': {
    short: 'A group of 6 players who trade resources. Each player produces 2 resources, giving the circle access to 12 resources total. Specific combinations unlock bonus resources.',
  },
  'Bonus Resources': {
    short: 'Secondary resources unlocked when your trade circle contains specific base resource combinations. Examples: Steel (Coal+Iron), Construction (Lumber+Iron+Marble+Aluminum+Tech>5).',
  },

  // Scenario
  'ROI': {
    short: 'Return on Investment — days until a purchase pays for itself through increased income. Lower is better.',
  },
};
