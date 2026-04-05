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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Military Calculator</h1>

      <Tabs defaultValue="mobilize">
        <TabsList>
          <TabsTrigger value="mobilize">Mobilization</TabsTrigger>
          <TabsTrigger value="spies">Spy Odds</TabsTrigger>
          <TabsTrigger value="navy">Navy</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="enemySpies"
                      label={{ value: 'Enemy Spies', position: 'bottom', fill: '#999', fontSize: 12 }}
                      tick={{ fill: '#999', fontSize: 11 }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      label={{ value: 'Success %', angle: -90, position: 'insideLeft', fill: '#999', fontSize: 12 }}
                      tick={{ fill: '#999', fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                      labelFormatter={(v) => `Enemy Spies: ${v}`}
                      formatter={(v) => [`${v}%`, 'Success Rate']}
                    />
                    <Line
                      type="monotone"
                      dataKey="successRate"
                      stroke="#22c55e"
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
      </Tabs>
    </div>
  );
}
