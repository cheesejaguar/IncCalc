'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Military Calculator</h1>

      <Tabs defaultValue="mobilize">
        <TabsList>
          <TabsTrigger value="mobilize">Mobilization</TabsTrigger>
          <TabsTrigger value="spies">Spy Odds</TabsTrigger>
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
      </Tabs>
    </div>
  );
}
