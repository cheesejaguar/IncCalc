export interface WarchestInput {
  currentCash: number;
  dailyIncome: number;      // gross income from taxes
  dailyBills: number;       // total bills (infra upkeep + military + improvements)
  warMilitaryUpkeep: number; // additional military upkeep during war (soldiers, tanks, aircraft, navy)
}

export interface WarchestResult {
  dailyNetIncome: number;          // income - bills
  daysOfBillsSustainable: number;  // how many days cash covers bills if income = 0
  daysUntilBroke: number;          // how many days until cash runs out at current rate (Infinity if net positive)
  warDaysOfBills: number;          // days sustainable during war (higher bills, same income)
  warDailyNet: number;             // income - bills - warMilitaryUpkeep
  recommendedWarchest: number;     // 30 days of war bills
}

/**
 * Calculate warchest sustainability metrics.
 *
 * Organizes cash-flow information for a nation:
 * - Daily net income (peacetime and wartime)
 * - How long current cash lasts under various scenarios
 * - Recommended minimum warchest (30 days of war bills)
 */
export function calculateWarchest(input: WarchestInput): WarchestResult {
  const dailyNetIncome = input.dailyIncome - input.dailyBills;

  const warDailyBills = input.dailyBills + input.warMilitaryUpkeep;
  const warDailyNet = input.dailyIncome - warDailyBills;

  // Days cash covers bills assuming no income
  const daysOfBillsSustainable =
    input.dailyBills > 0 ? input.currentCash / input.dailyBills : Infinity;

  // Days until broke at current peacetime net rate
  let daysUntilBroke: number;
  if (dailyNetIncome >= 0) {
    daysUntilBroke = Infinity;
  } else {
    daysUntilBroke = input.currentCash / Math.abs(dailyNetIncome);
  }

  // Days cash covers wartime bills assuming no income
  const warDaysOfBills =
    warDailyBills > 0 ? input.currentCash / warDailyBills : Infinity;

  // Recommended warchest: 30 days of wartime bills
  const recommendedWarchest = warDailyBills * 30;

  return {
    dailyNetIncome,
    daysOfBillsSustainable,
    daysUntilBroke,
    warDaysOfBills,
    warDailyNet,
    recommendedWarchest,
  };
}

/**
 * Generate day-by-day cash projection for chart.
 */
export function generateWarchestProjection(
  currentCash: number,
  dailyNetIncome: number,
  warDailyNet: number,
  days = 60
): Array<{ day: number; peacetime: number; wartime: number }> {
  const data: Array<{ day: number; peacetime: number; wartime: number }> = [];
  for (let day = 0; day <= days; day++) {
    data.push({
      day,
      peacetime: Math.max(0, currentCash + dailyNetIncome * day),
      wartime: Math.max(0, currentCash + warDailyNet * day),
    });
  }
  return data;
}
