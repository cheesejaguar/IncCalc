export interface NSInput {
  infra: number;
  tech: number;
  land: number;
  soldiers: number;
  tanksDeployed: number;
  tanksDefending: number;
  cruiseMissiles: number;
  nukes: number;
  aircraftStrength: number;  // sum of aircraft strength ratings
  navyStrength: number;      // sum of navy vessel strength ratings
}

export interface NSResult {
  nationStrength: number;
  warRangeMin: number;      // 75% of NS — weakest you can attack
  warRangeMax: number;      // 133% of NS — strongest that can attack you
  breakdown: { component: string; value: number }[];
}

/**
 * Calculate Nation Strength and war range.
 *
 * Formula:
 *   NS = land            × 1.5
 *      + tanksDeployed   × 0.15
 *      + tanksDefending  × 0.20
 *      + cruiseMissiles  × 10
 *      + nukes²          × 10
 *      + tech            × 5
 *      + infra           × 3
 *      + soldiers        × 0.02
 *      + aircraftStrength× 5
 *      + navyStrength    × 10
 *
 * War range: nation can attack targets between 75% and 133% of own NS.
 */
export function calculateNationStrength(input: NSInput): NSResult {
  const components: { component: string; value: number }[] = [
    { component: 'Land',             value: input.land            * 1.5 },
    { component: 'Tanks (deployed)', value: input.tanksDeployed   * 0.15 },
    { component: 'Tanks (defending)',value: input.tanksDefending  * 0.20 },
    { component: 'Cruise Missiles',  value: input.cruiseMissiles  * 10 },
    { component: 'Nukes',            value: (input.nukes ** 2)    * 10 },
    { component: 'Technology',       value: input.tech            * 5 },
    { component: 'Infrastructure',   value: input.infra           * 3 },
    { component: 'Soldiers',         value: input.soldiers        * 0.02 },
    { component: 'Aircraft',         value: input.aircraftStrength* 5 },
    { component: 'Navy',             value: input.navyStrength    * 10 },
  ];

  const nationStrength = components.reduce((sum, c) => sum + c.value, 0);

  return {
    nationStrength,
    warRangeMin: nationStrength * 0.75,
    warRangeMax: nationStrength * 1.33,
    breakdown: components,
  };
}
