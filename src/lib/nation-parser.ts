import type { NationData } from './types';
import { createEmptyNation } from './types';

/**
 * Extract text between two marker strings.
 * Ported from resparse.class.php getText() lines 173-183.
 */
function getText(text: string, s1: string, s2: string): string {
  const posS = text.indexOf(s1);
  const posE = text.indexOf(s2, posS + s1.length);
  if (posS === -1) return '';
  const start = posS + s1.length;
  const end = posE === -1 ? text.length : posE;
  return text.substring(start, end);
}

/** Remove commas and trim */
function clean(text: string): string {
  return text.replace(/,/g, '').trim();
}

/** Parse a number from text, defaulting to 0 */
function num(text: string): number {
  const cleaned = clean(text);
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

/**
 * Parse connected resources.
 * New format: "Coal - description.Uranium - description."
 * Legacy format: "[Aluminum icon] [Coal icon]"
 */
function parseResources(raw: string): string[] {
  if (!raw.trim()) return [];

  // Legacy bracket format
  if (raw.includes('[')) {
    const parts = raw.split('] [');
    return parts
      .map((txt) => {
        const cleaned = txt.replace(/[\[\]]/g, '').trim();
        const spaceIdx = cleaned.indexOf(' ');
        return spaceIdx > 0 ? cleaned.substring(0, spaceIdx) : cleaned;
      })
      .filter((r) => r.length > 0);
  }

  // New format: "Name - description text.Name - description text."
  // Split on period immediately followed by an uppercase letter (next resource name)
  const parts = raw.split(/\.(?=[A-Z])/);
  return parts
    .map((txt) => {
      const trimmed = txt.trim();
      const dashIdx = trimmed.indexOf(' - ');
      return dashIdx > 0 ? trimmed.substring(0, dashIdx).trim() : '';
    })
    .filter((r) => r.length > 0);
}

/**
 * Parse bonus resources.
 * New format: "Steel - description.Fine Jewelry - description." or "None"
 * Legacy format: "[Steel - bonus]"
 */
function parseBonusResources(raw: string): string[] {
  const trimmed = raw.trim();
  if (!trimmed || trimmed === 'None') return [];

  // Legacy bracket format
  if (trimmed.includes('[')) {
    const parts = trimmed.split('] [');
    return parts
      .map((txt) => {
        const cleaned = txt.replace(/[\[\]]/g, '').trim();
        const dashIdx = cleaned.indexOf('-');
        return dashIdx > 0 ? cleaned.substring(0, dashIdx).trim() : cleaned;
      })
      .filter((r) => r.length > 0);
  }

  // New format: same as connected resources
  return parseResources(trimmed);
}

/**
 * Parse improvements string into name→count map.
 * e.g. "Banks: 5, Clinics: 2, Factories: 5" → { Banks: 5, Clinics: 2, Factories: 5 }
 */
function parseImprovements(raw: string): Record<string, number> {
  const result: Record<string, number> = {};
  if (!raw.trim()) return result;

  // Split by comma, then each entry is "Name: Count"
  const entries = raw.split(',');
  for (const entry of entries) {
    const colonIdx = entry.indexOf(':');
    if (colonIdx > 0) {
      const name = entry.substring(0, colonIdx).trim();
      const val = parseInt(entry.substring(colonIdx + 1).trim(), 10);
      if (name && !isNaN(val)) {
        result[name] = val;
      }
    }
  }
  return result;
}

/**
 * Parse wonders string.
 * e.g. "Internet, Stock Market" → ["Internet", "Stock Market"]
 * or "No national wonders" / "No national wonders." → []
 */
function parseWonders(raw: string): string[] {
  const trimmed = raw.replace(/[^a-zA-Z ,]/g, '').trim();
  if (!trimmed || trimmed.includes('No national wonders')) return [];
  return trimmed.split(',').map((w) => w.trim()).filter(Boolean);
}

/**
 * Parse a "View My Nation" text dump into a NationData object.
 * Ported from resparse.class.php.
 */
export function parseNationText(rawText: string): NationData {
  const nation = createEmptyNation();

  // Trim to the relevant section
  const text = getText(
    rawText,
    'Government Information',
    'there is more information available for that item.'
  ) || rawText;

  // Government & Religion
  // Try bracket format first (legacy), then extract first non-empty line
  let govRaw = getText(text, 'Government Type:', '(Next');
  let govBracket = getText(govRaw, '[', ']');
  if (govBracket) {
    nation.government = clean(govBracket);
  } else {
    const govLines = govRaw.split('\n').map(l => l.trim()).filter(Boolean);
    nation.government = govLines.length > 0 ? govLines[0] : '';
  }

  let reliRaw = getText(text, 'National Religion:', 'Nation Team:');
  let reliBracket = getText(reliRaw, '[', ']');
  if (reliBracket) {
    nation.religion = clean(reliBracket);
  } else {
    const reliLines = reliRaw.split('\n').map(l => l.trim()).filter(Boolean);
    nation.religion = reliLines.length > 0 ? reliLines[0] : '';
  }

  // Core stats
  nation.tech = num(getText(text, 'Technology:', 'Infrastructure:'));
  nation.infra = num(getText(text, 'Infrastructure:', 'Tax Rate:'));

  const areaRaw = getText(text, 'Area of Influence:', 'War/Peace Preference:');
  nation.land = num(getText(text, 'Area of Influence:', 'mile diameter'));
  nation.purchasedLand = num(getText(areaRaw, 'diameter.', 'in purchases'));
  nation.naturalLand = num(getText(areaRaw, 'modifiers,', 'in growth'));

  nation.population = num(getText(text, 'Total Population:', 'Supporters'));

  const citizenRaw = getText(text, 'Citizens:', 'Avg. Gross Income Per Individual Per Day');
  nation.citizens = num(getText(citizenRaw, 'Soldiers', 'Working Citizens'));

  const incomeRaw = clean(getText(
    text,
    'Avg. Individual Income Taxes Paid Per Day',
    'Avg. Net Daily Population Income (After Taxes)'
  ));
  nation.income = num(incomeRaw.startsWith('$') ? incomeRaw.substring(1) : incomeRaw);

  const grossRaw = getText(text, 'Avg. Gross Income Per Individual', 'Avg. Individual Income Taxes Paid Per Day');
  nation.grossIncome = num(getText(grossRaw, '$', '('));

  // Happiness: try bracket format, then parse first number directly
  const happyRaw = getText(text, 'Population Happiness:', 'Crime Index:');
  const happyBracket = getText(happyRaw, ']', 'Pop');
  nation.happiness = happyBracket ? num(happyBracket) : num(happyRaw);

  nation.nationStrength = num(getText(text, 'Nation Strength:', 'Efficiency:'));

  const soldierRaw = clean(getText(text, 'Number of Soldiers:', 'Deployed Soldiers:'));
  nation.soldiers = num(getText(soldierRaw, '(', ')'));

  nation.tanks = num(getText(text, 'Number of Tanks:', 'Defending Tanks:'));
  nation.aircraft = num(getText(text, 'Aircraft:', 'Number of Cruise Missiles'));
  nation.nukes = num(getText(text, 'Nuclear Weapons:', 'Number of Spies:'));
  nation.spies = num(getText(text, 'Number of Spies:', 'Number of Soldiers Lost in All Wars.'));

  const taxRaw = getText(text, 'Tax Rate', 'Area of Influence:');
  nation.taxRate = num(getText(taxRaw, ':', '%'));

  // Environment: try legacy format, then parse first number directly
  const envirLegacy = getText(text, 'Environment:', ' Radiation');
  const envirBracket = getText(envirLegacy, ']', 'Global');
  if (envirBracket.trim()) {
    nation.environment = num(envirBracket);
  } else {
    const envirRaw = getText(text, 'Environment:', 'Military Information');
    nation.environment = num(envirRaw);
  }

  // Cash: prefer "Current Dollars Available:" marker, fall back to legacy
  const cashDirect = getText(text, 'Current Dollars Available:', '(');
  if (cashDirect.trim()) {
    nation.cash = num(cashDirect.replace('$', ''));
  } else {
    const cashRaw = getText(text, 'Government Financial', 'Anywhere');
    nation.cash = num(getText(cashRaw, '$', '('));
  }

  // DEFCON: try bracket format, then regex extraction
  const defconRaw = getText(text, 'DEFCON Level:', 'Threat Level:');
  const defconBracket = getText(defconRaw, '[DEFCON', '-');
  if (defconBracket.trim()) {
    nation.defcon = num(defconBracket);
  } else {
    const defconMatch = defconRaw.match(/DEFCON\s*(\d)/);
    nation.defcon = defconMatch ? parseInt(defconMatch[1], 10) : 0;
  }

  // Resources
  const connectedRaw = getText(text, 'Connected Resources:', 'Bonus Resources:');
  nation.connectedResources = parseResources(connectedRaw.trim());

  const bonusRaw = getText(text, 'Bonus Resources:', 'Trade Slots Used');
  nation.bonusResources = parseBonusResources(bonusRaw.trim());

  const baseRaw = getText(text, 'My Resources:', 'Connected Resources:');
  nation.baseResources = parseResources(baseRaw.trim());

  // Improvements — strip "View Improvements and Wonders" prefix
  let impRaw = getText(text, 'Improvements:', 'National Wonders:');
  impRaw = impRaw.replace(/View Improvements and Wonders/i, '').trim();
  if (impRaw === 'No improvements purchased.' || !impRaw) {
    nation.improvements = {};
  } else {
    nation.improvements = parseImprovements(impRaw);
  }

  // Wonders — strip "View Improvements and Wonders" prefix
  let wonderRaw = getText(text, 'National Wonders:', 'Environment:');
  wonderRaw = wonderRaw.replace(/View Improvements and Wonders/i, '').trim();
  nation.wonders = parseWonders(wonderRaw);

  return nation;
}
