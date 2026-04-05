'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useNationData } from '@/hooks/useNationData';
import { calculateMobilize } from '@/lib/calculators/mobilize';
import { calculateSpyOdds, generateSpyOddsChartData, THREAT_MULTIPLIERS } from '@/lib/calculators/spy-odds';
import { calculateNavy } from '@/lib/calculators/navy';
import { calculateEquipment } from '@/lib/calculators/equipment';
import { calculateBattleOdds, generateBattleOddsCurve } from '@/lib/calculators/battle-odds';
import { calculateNationStrength } from '@/lib/calculators/nation-strength';
import { CHART_THEME, TOOLTIP_STYLE, AXIS_TICK } from '@/lib/chart-theme';
import { NumberInput } from '@/components/shared/NumberInput';
import { ResourceCheckboxGrid } from '@/components/shared/ResourceCheckboxGrid';
import { formatCurrency, formatNumber } from '@/components/shared/CurrencyDisplay';
import { MILITARY_MODIFIERS } from '@/lib/data/resources';
import type { ThreatLevel } from '@/lib/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
  type PieLabelRenderProps,
} from 'recharts';

const MILITARY_RESOURCE_OPTIONS = Object.entries(MILITARY_MODIFIERS)
  .filter(([, mod]) => mod.value > 0)
  .map(([key, mod]) => ({
    key,
    label: `${mod.name} (+${(mod.value * 100).toFixed(0)}%)`,
  }));

// Add iron/lead/oil for flat cost reductions
const COST_RESOURCE_OPTIONS = [
  { key: 'iron', label: 'Iron (-$3 soldier)' },
  { key: 'oil', label: 'Oil (-$3 soldier)' },
  { key: 'lead', label: 'Lead (-8% tank)' },
];

const DEFCON_OPTIONS = [1, 2, 3, 4, 5] as const;

const PIE_COLORS = ['#B92432', '#6b7280', '#9ca3af', '#d4d4d8', '#4b5563', '#374151', '#a3a3a3', '#525252', '#737373', '#e5e5e5'];

export default function MilitaryPage() {
  const { nation, isLoaded, allMilitaryResources } = useNationData();

  // Mobilize state
  const [citizens, setCitizens] = useState(isLoaded ? nation.citizens : 1000);
  const [currentSoldiers, setCurrentSoldiers] = useState(isLoaded ? nation.soldiers : 0);
  const [currentTanks, setCurrentTanks] = useState(isLoaded ? nation.tanks : 0);
  const [guerillaCamps, setGuerillaCamps] = useState(
    isLoaded ? (nation.improvements['Guerilla Camps'] ?? 0) : 0
  );
  const [barracks, setBarracks] = useState(0);
  const [milResources, setMilResources] = useState<string[]>(
    isLoaded ? allMilitaryResources.filter((r) => r in MILITARY_MODIFIERS || ['iron', 'oil', 'lead'].includes(r)) : []
  );

  // Equipment state
  const [existingNukes, setExistingNukes] = useState(isLoaded ? nation.nukes : 0);

  // Spy state
  const [mySpies, setMySpies] = useState(isLoaded ? nation.spies : 50);
  const [myTech, setMyTech] = useState(isLoaded ? nation.tech : 0);
  const [enemySpies, setEnemySpies] = useState(50);
  const [enemyTech, setEnemyTech] = useState(0);
  const [enemyLand, setEnemyLand] = useState(500);
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>('Elevated');

  // Battle Odds state
  const [atkSoldiers, setAtkSoldiers] = useState(isLoaded ? nation.soldiers : 0);
  const [atkTanks, setAtkTanks] = useState(isLoaded ? nation.tanks : 0);
  const [atkTech, setAtkTech] = useState(isLoaded ? nation.tech : 0);
  const [atkDefcon, setAtkDefcon] = useState<number>(isLoaded ? (nation.defcon || 5) : 5);
  const [defSoldiers, setDefSoldiers] = useState(0);
  const [defTanks, setDefTanks] = useState(0);
  const [defTech, setDefTech] = useState(0);
  const [defInfra, setDefInfra] = useState(0);
  const [defLand, setDefLand] = useState(500);
  const [defDefcon, setDefDefcon] = useState<number>(5);
  const [isNight, setIsNight] = useState(false);

  // NS Projector state
  const [nsInfra, setNsInfra] = useState(isLoaded ? nation.infra : 0);
  const [nsTech, setNsTech] = useState(isLoaded ? nation.tech : 0);
  const [nsLand, setNsLand] = useState(isLoaded ? nation.purchasedLand : 0);
  const [nsSoldiers, setNsSoldiers] = useState(isLoaded ? nation.soldiers : 0);
  const [nsTanksDeployed, setNsTanksDeployed] = useState(isLoaded ? Math.floor(nation.tanks * 0.5) : 0);
  const [nsTanksDefending, setNsTanksDefending] = useState(isLoaded ? Math.ceil(nation.tanks * 0.5) : 0);
  const [nsCruiseMissiles, setNsCruiseMissiles] = useState(0);
  const [nsNukes, setNsNukes] = useState(isLoaded ? nation.nukes : 0);
  const [nsAircraftStrength, setNsAircraftStrength] = useState(0);
  const [nsNavyStrength, setNsNavyStrength] = useState(0);

  const mobilizeResult = useMemo(
    () =>
      calculateMobilize({
        citizens,
        currentSoldiers,
        currentTanks,
        guerillaCamps,
        barracks,
        activeResources: milResources,
        defcon: nation.defcon || 5,
        factories: nation.improvements?.['Factories'] ?? 0,
      }),
    [citizens, currentSoldiers, currentTanks, guerillaCamps, barracks, milResources, nation.defcon]
  );

  const spyResult = useMemo(
    () =>
      calculateSpyOdds({
        mySpies,
        myTech,
        enemySpies,
        enemyTech,
        enemyLand,
        threatLevel,
      }),
    [mySpies, myTech, enemySpies, enemyTech, enemyLand, threatLevel]
  );

  const chartData = useMemo(
    () =>
      generateSpyOddsChartData({
        mySpies,
        myTech,
        enemyTech,
        enemyLand,
        threatLevel,
      }),
    [mySpies, myTech, enemyTech, enemyLand, threatLevel]
  );

  const activeNavyResources = useMemo(() => {
    return [
      ...nation.connectedResources.map((r) => r.toLowerCase()),
      ...nation.bonusResources.map((r) => r.toLowerCase()),
    ];
  }, [nation.connectedResources, nation.bonusResources]);

  const navyResult = useMemo(
    () =>
      calculateNavy({
        infra: nation.infra,
        tech: nation.tech,
        land: nation.land,
        shipyards: nation.improvements['Shipyard'] ?? 0,
        drydocks: nation.improvements['Drydock'] ?? 0,
        activeResources: activeNavyResources,
      }),
    [nation.infra, nation.tech, nation.land, nation.improvements, activeNavyResources]
  );

  const equipmentResult = useMemo(
    () =>
      calculateEquipment({
        activeResources: activeNavyResources,
        existingNukes,
        factories: nation.improvements['Factory'] ?? 0,
        airports: nation.improvements['Airport'] ?? 0,
        hasConstruction: nation.bonusResources.includes('Construction'),
        hasForeignAirBase: nation.wonders.includes('Foreign Air Force Base'),
      }),
    [activeNavyResources, existingNukes, nation.improvements, nation.bonusResources, nation.wonders]
  );

  const battleResult = useMemo(
    () =>
      calculateBattleOdds({
        attackerSoldiers: atkSoldiers,
        attackerTanks: atkTanks,
        attackerTech: atkTech,
        attackerDEFCON: atkDefcon,
        defenderSoldiers: defSoldiers,
        defenderTanks: defTanks,
        defenderTech: defTech,
        defenderInfra: defInfra,
        defenderLand: defLand,
        defenderDEFCON: defDefcon,
        isNightAttack: isNight,
      }),
    [atkSoldiers, atkTanks, atkTech, atkDefcon, defSoldiers, defTanks, defTech, defInfra, defLand, defDefcon, isNight]
  );

  const nsResult = useMemo(
    () =>
      calculateNationStrength({
        infra: nsInfra,
        tech: nsTech,
        land: nsLand,
        soldiers: nsSoldiers,
        tanksDeployed: nsTanksDeployed,
        tanksDefending: nsTanksDefending,
        cruiseMissiles: nsCruiseMissiles,
        nukes: nsNukes,
        aircraftStrength: nsAircraftStrength,
        navyStrength: nsNavyStrength,
      }),
    [nsInfra, nsTech, nsLand, nsSoldiers, nsTanksDeployed, nsTanksDefending, nsCruiseMissiles, nsNukes, nsAircraftStrength, nsNavyStrength]
  );

  const battleChartData = useMemo(
    () =>
      generateBattleOddsCurve(
        {
          attackerTanks: atkTanks,
          attackerTech: atkTech,
          attackerDEFCON: atkDefcon,
          defenderSoldiers: defSoldiers,
          defenderTanks: defTanks,
          defenderTech: defTech,
          defenderInfra: defInfra,
          defenderLand: defLand,
          defenderDEFCON: defDefcon,
          isNightAttack: isNight,
        },
        20000,
        500
      ),
    [atkTanks, atkTech, atkDefcon, defSoldiers, defTanks, defTech, defInfra, defLand, defDefcon, isNight]
  );

  const nsBreakdownData = useMemo(
    () => nsResult.breakdown.filter((row) => row.value > 0),
    [nsResult.breakdown]
  );

  const battleSuccessColor =
    battleResult.successRate >= 60
      ? 'text-green-400'
      : battleResult.successRate >= 40
      ? 'text-yellow-400'
      : 'text-red-400';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Military Calculator</h1>

      <Tabs defaultValue="mobilize">
        <TabsList>
          <TabsTrigger value="mobilize">Mobilization</TabsTrigger>
          <TabsTrigger value="spies">Spy Odds</TabsTrigger>
          <TabsTrigger value="navy">Navy</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="battle">Battle Odds</TabsTrigger>
          <TabsTrigger value="ns">NS Projector</TabsTrigger>
        </TabsList>

        <TabsContent value="mobilize" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">War Mobilization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <NumberInput id="citizens" label="Citizens" value={citizens} onChange={setCitizens} min={0} />
                <NumberInput id="soldiers" label="Current Soldiers" value={currentSoldiers} onChange={setCurrentSoldiers} min={0} />
                <NumberInput id="tanks" label="Current Tanks" value={currentTanks} onChange={setCurrentTanks} min={0} />
                <NumberInput id="gcamps" label="Guerilla Camps" value={guerillaCamps} onChange={setGuerillaCamps} min={0} max={5} />
                <NumberInput id="barracks" label="Barracks" value={barracks} onChange={setBarracks} min={0} max={5} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Military Resources</p>
                <ResourceCheckboxGrid
                  availableResources={[...MILITARY_RESOURCE_OPTIONS, ...COST_RESOURCE_OPTIONS]}
                  selected={milResources}
                  onChange={setMilResources}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                Max soldiers purchasable: <strong>{formatNumber(mobilizeResult.maxSoldiers, 0)}</strong>{' '}
                at {formatCurrency(mobilizeResult.soldierCost)} each ={' '}
                <strong>{formatCurrency(mobilizeResult.totalSoldierCost)}</strong>
              </p>
              <p>
                Max tanks purchasable: <strong>{formatNumber(mobilizeResult.maxTanks, 0)}</strong>{' '}
                at {formatCurrency(mobilizeResult.tankCost)} each ={' '}
                <strong>{formatCurrency(mobilizeResult.totalTankCost)}</strong>
              </p>
              <p>
                Tank Upkeep: <strong>{formatCurrency(mobilizeResult.tankUpkeep)}/tank/day</strong>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Modifier: {(mobilizeResult.modifier * 100).toFixed(2)}%
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spies" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Spy Operation Odds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <NumberInput id="my-spies" label="My Spies" value={mySpies} onChange={setMySpies} min={0} />
                <NumberInput id="my-tech" label="My Tech" value={myTech} onChange={setMyTech} min={0} />
                <NumberInput id="enemy-spies" label="Enemy Spies" value={enemySpies} onChange={setEnemySpies} min={0} />
                <NumberInput id="enemy-tech" label="Enemy Tech" value={enemyTech} onChange={setEnemyTech} min={0} />
                <NumberInput id="enemy-land" label="Enemy Land" value={enemyLand} onChange={setEnemyLand} min={0} />
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Threat Level</Label>
                  <Select value={threatLevel} onValueChange={(v) => setThreatLevel(v as ThreatLevel)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(THREAT_MULTIPLIERS) as ThreatLevel[]).map((level) => (
                        <SelectItem key={level} value={level}>
                          {level} ({THREAT_MULTIPLIERS[level]}x)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-1">
                <p>
                  Success rate:{' '}
                  <strong
                    className={
                      spyResult.successRate >= 50
                        ? 'text-green-400'
                        : 'text-red-400'
                    }
                  >
                    {spyResult.successRate.toFixed(2)}%
                  </strong>
                </p>
                <p>Offensive modifier: {spyResult.offensiveMod.toFixed(2)}</p>
                <p>Defensive modifier: {spyResult.defensiveMod.toFixed(2)}</p>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                    <XAxis
                      dataKey="enemySpies"
                      label={{ value: 'Enemy Spies', position: 'bottom', fill: CHART_THEME.text, fontSize: 12 }}
                      tick={AXIS_TICK}
                    />
                    <YAxis
                      domain={[0, 100]}
                      label={{ value: 'Success %', angle: -90, position: 'insideLeft', fill: CHART_THEME.text, fontSize: 12 }}
                      tick={AXIS_TICK}
                    />
                    <Tooltip
                      {...TOOLTIP_STYLE}
                      labelFormatter={(v) => `Enemy Spies: ${v}`}
                      formatter={(v) => [`${v}%`, 'Success Rate']}
                    />
                    <Line
                      type="monotone"
                      dataKey="successRate"
                      stroke={CHART_THEME.positive}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navy Tab */}
        <TabsContent value="navy" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Navy Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {navyResult.canBuildNavy ? (
                <p className="text-green-400 font-medium">
                  Navy available — land requirement met ({formatNumber(nation.land, 0)} / 1,000 acres)
                </p>
              ) : (
                <p className="text-red-400 font-medium">
                  Navy unavailable — requires 1,000 acres of land (have {formatNumber(nation.land, 0)})
                </p>
              )}
              <div className="text-muted-foreground text-xs">
                Shipyards: {nation.improvements['Shipyard'] ?? 0} &nbsp;|&nbsp;
                Drydocks: {nation.improvements['Drydock'] ?? 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Vessel Costs &amp; Requirements</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vessel</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead className="text-right">Upkeep/day</TableHead>
                    <TableHead className="text-right">Strength</TableHead>
                    <TableHead>Requirements</TableHead>
                    <TableHead className="text-right">Available</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {navyResult.vessels.map((row) => (
                    <TableRow
                      key={row.vessel.name}
                      className={!row.meetsRequirements ? 'opacity-50' : ''}
                    >
                      <TableCell className="font-medium">
                        {row.vessel.name}
                        {row.vessel.bonusStrength && (
                          <span className="block text-xs text-muted-foreground">
                            +{row.vessel.bonusStrength.value} vs {row.vessel.bonusStrength.against}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {row.adjustedCost !== row.vessel.cost ? (
                          <>
                            <span className="line-through text-muted-foreground mr-1">
                              {formatCurrency(row.vessel.cost)}
                            </span>
                            {formatCurrency(row.adjustedCost)}
                          </>
                        ) : (
                          formatCurrency(row.vessel.cost)
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {row.adjustedUpkeep !== row.vessel.upkeep ? (
                          <>
                            <span className="line-through text-muted-foreground mr-1">
                              {formatCurrency(row.vessel.upkeep)}
                            </span>
                            {formatCurrency(row.adjustedUpkeep)}
                          </>
                        ) : (
                          formatCurrency(row.vessel.upkeep)
                        )}
                      </TableCell>
                      <TableCell className="text-right">{row.vessel.strength}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] whitespace-normal">
                        {row.requirementNote || '—'}
                      </TableCell>
                      <TableCell className="text-right">{row.maxSupported}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Aircraft</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                Cost modifier:{' '}
                <strong>{((1 - equipmentResult.aircraftCostModifier) * 100).toFixed(1)}% discount</strong>
                {' '}(multiplier: {equipmentResult.aircraftCostModifier.toFixed(3)})
              </p>
              <p>
                Upkeep modifier:{' '}
                <strong>{((1 - equipmentResult.aircraftUpkeepModifier) * 100).toFixed(1)}% discount</strong>
                {' '}(multiplier: {equipmentResult.aircraftUpkeepModifier.toFixed(3)})
              </p>
              <p>
                Aircraft limit: <strong>{formatNumber(equipmentResult.aircraftLimit, 0)}</strong>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Cruise Missiles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                Cost per missile: <strong>{formatCurrency(equipmentResult.cruiseMissileCost)}</strong>
              </p>
              <p>
                Upkeep per missile: <strong>{formatCurrency(200)}</strong>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Nuclear Weapons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="w-40">
                <NumberInput
                  id="existing-nukes"
                  label="Existing Nukes"
                  value={existingNukes}
                  onChange={setExistingNukes}
                  min={0}
                />
              </div>
              <p>
                Cost for next nuke: <strong>{formatCurrency(equipmentResult.nukeCost)}</strong>
              </p>
              <p>
                Upkeep per nuke: <strong>{formatCurrency(equipmentResult.nukeUpkeep)}</strong>
              </p>
              <p>
                Total nuke upkeep ({existingNukes} nukes):{' '}
                <strong>{formatCurrency(equipmentResult.nukeUpkeep * existingNukes)}</strong>
              </p>
              {!activeNavyResources.includes('uranium') && (
                <p className="text-xs text-yellow-500">
                  No uranium — nuke upkeep doubled
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Battle Odds Tab */}
        <TabsContent value="battle" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Attacker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <NumberInput
                    id="atk-soldiers"
                    label="Soldiers"
                    value={atkSoldiers}
                    onChange={setAtkSoldiers}
                    min={0}
                  />
                  <NumberInput
                    id="atk-tanks"
                    label="Tanks"
                    value={atkTanks}
                    onChange={setAtkTanks}
                    min={0}
                  />
                  <NumberInput
                    id="atk-tech"
                    label="Technology"
                    value={atkTech}
                    onChange={setAtkTech}
                    min={0}
                  />
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">DEFCON</Label>
                    <Select
                      value={String(atkDefcon)}
                      onValueChange={(v) => setAtkDefcon(Number(v))}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DEFCON_OPTIONS.map((d) => (
                          <SelectItem key={d} value={String(d)}>
                            DEFCON {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Defender</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <NumberInput
                    id="def-soldiers"
                    label="Soldiers"
                    value={defSoldiers}
                    onChange={setDefSoldiers}
                    min={0}
                  />
                  <NumberInput
                    id="def-tanks"
                    label="Tanks"
                    value={defTanks}
                    onChange={setDefTanks}
                    min={0}
                  />
                  <NumberInput
                    id="def-tech"
                    label="Technology"
                    value={defTech}
                    onChange={setDefTech}
                    min={0}
                  />
                  <NumberInput
                    id="def-infra"
                    label="Infrastructure"
                    value={defInfra}
                    onChange={setDefInfra}
                    min={0}
                  />
                  <NumberInput
                    id="def-land"
                    label="Land"
                    value={defLand}
                    onChange={setDefLand}
                    min={0}
                  />
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">DEFCON</Label>
                    <Select
                      value={String(defDefcon)}
                      onValueChange={(v) => setDefDefcon(Number(v))}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DEFCON_OPTIONS.map((d) => (
                          <SelectItem key={d} value={String(d)}>
                            DEFCON {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Time of Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsNight(false)}
                  className={`px-4 py-1.5 rounded text-sm font-medium border transition-colors ${
                    !isNight
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setIsNight(true)}
                  className={`px-4 py-1.5 rounded text-sm font-medium border transition-colors ${
                    isNight
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Night (+5% attacker tech)
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className={`text-5xl font-bold font-mono ${battleSuccessColor}`}>
                  {battleResult.successRate.toFixed(1)}%
                </p>
                <p className={`text-sm font-medium mt-1 ${battleSuccessColor}`}>
                  {battleResult.attackerAdvantage}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                <span className="text-muted-foreground">Attacker strength</span>
                <span className="font-mono font-medium">{formatNumber(battleResult.attackerStrength, 0)}</span>
                <span className="text-muted-foreground">Defender strength</span>
                <span className="font-mono font-medium">{formatNumber(battleResult.defenderStrength, 0)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Success Rate vs Attacker Soldiers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={battleChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                    <XAxis dataKey="soldiers" tick={AXIS_TICK} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                    <YAxis domain={[0, 100]} tick={AXIS_TICK} tickFormatter={(v) => `${v}%`} />
                    <Tooltip {...TOOLTIP_STYLE} labelFormatter={(v) => `Soldiers: ${Number(v).toLocaleString()}`} formatter={(v) => [`${Number(v)}%`, 'Success Rate']} />
                    <ReferenceLine y={50} stroke={CHART_THEME.secondary} strokeDasharray="5 5" label={{ value: '50%', fill: CHART_THEME.text, fontSize: 11 }} />
                    <Line type="monotone" dataKey="successRate" stroke={CHART_THEME.primary} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NS Projector Tab */}
        <TabsContent value="ns" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Nation Strength Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <NumberInput
                  id="ns-infra"
                  label="Infrastructure"
                  value={nsInfra}
                  onChange={setNsInfra}
                  min={0}
                />
                <NumberInput
                  id="ns-tech"
                  label="Technology"
                  value={nsTech}
                  onChange={setNsTech}
                  min={0}
                />
                <NumberInput
                  id="ns-land"
                  label="Land (purchased)"
                  value={nsLand}
                  onChange={setNsLand}
                  min={0}
                />
                <NumberInput
                  id="ns-soldiers"
                  label="Soldiers"
                  value={nsSoldiers}
                  onChange={setNsSoldiers}
                  min={0}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <NumberInput
                  id="ns-tanks-deployed"
                  label="Tanks Deployed"
                  value={nsTanksDeployed}
                  onChange={setNsTanksDeployed}
                  min={0}
                />
                <NumberInput
                  id="ns-tanks-defending"
                  label="Tanks Defending"
                  value={nsTanksDefending}
                  onChange={setNsTanksDefending}
                  min={0}
                />
                <NumberInput
                  id="ns-cm"
                  label="Cruise Missiles"
                  value={nsCruiseMissiles}
                  onChange={setNsCruiseMissiles}
                  min={0}
                />
                <NumberInput
                  id="ns-nukes"
                  label="Nuclear Weapons"
                  value={nsNukes}
                  onChange={setNsNukes}
                  min={0}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <NumberInput
                  id="ns-aircraft"
                  label="Aircraft Strength (sum)"
                  value={nsAircraftStrength}
                  onChange={setNsAircraftStrength}
                  min={0}
                />
                <NumberInput
                  id="ns-navy"
                  label="Navy Strength (sum)"
                  value={nsNavyStrength}
                  onChange={setNsNavyStrength}
                  min={0}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Nation Strength</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-5xl font-bold font-mono text-primary">
                  {formatNumber(nsResult.nationStrength, 2)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Nation Strength</p>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                <span className="text-muted-foreground">War range (can attack)</span>
                <span className="font-mono font-medium">
                  {formatNumber(nsResult.warRangeMin, 2)} — {formatNumber(nsResult.warRangeMax, 2)}
                </span>
                <span className="text-muted-foreground">Nations that can attack you</span>
                <span className="font-mono text-xs text-muted-foreground">
                  NS between {formatNumber(nsResult.nationStrength / 1.33, 2)} and {formatNumber(nsResult.nationStrength / 0.75, 2)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Component</th>
                    <th className="text-right px-4 py-2 font-medium text-muted-foreground">Value</th>
                    <th className="text-right px-4 py-2 font-medium text-muted-foreground">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {nsResult.breakdown.map((row) => (
                    <tr key={row.component} className="border-b border-border/50 last:border-0">
                      <td className="px-4 py-1.5">{row.component}</td>
                      <td className="px-4 py-1.5 text-right font-mono">{formatNumber(row.value, 2)}</td>
                      <td className="px-4 py-1.5 text-right font-mono text-muted-foreground">
                        {nsResult.nationStrength > 0
                          ? `${((row.value / nsResult.nationStrength) * 100).toFixed(1)}%`
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-border">
                    <td className="px-4 pt-2 pb-3 font-semibold">Total</td>
                    <td className="px-4 pt-2 pb-3 text-right font-mono font-bold">
                      {formatNumber(nsResult.nationStrength, 2)}
                    </td>
                    <td className="px-4 pt-2 pb-3 text-right font-mono text-muted-foreground">100%</td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>

          {nsBreakdownData.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Strength Composition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={nsBreakdownData}
                        dataKey="value"
                        nameKey="component"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={(props: PieLabelRenderProps) => {
                          const entry = props.index !== undefined ? nsBreakdownData[props.index] : null;
                          const comp = entry?.component ?? '';
                          const pct = typeof props.percent === 'number' ? props.percent : 0;
                          return `${comp} ${(pct * 100).toFixed(0)}%`;
                        }}
                        labelLine={false}
                      >
                        {nsBreakdownData.map((_, idx) => (
                          <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [Number(v).toLocaleString(undefined, {maximumFractionDigits: 1}), 'NS']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
