'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useNationData } from '@/hooks/useNationData';
import { ALL_RESOURCES } from '@/lib/data/resources';
import {
  INFRA_MODIFIERS,
  POPULATION_MODIFIERS,
  UPKEEP_MODIFIERS,
  TECH_MODIFIERS,
  MILITARY_MODIFIERS,
} from '@/lib/data/resources';
import { computeResourceModifier } from '@/lib/calculators/modifiers';
import { CHART_THEME, TOOLTIP_STYLE } from '@/lib/chart-theme';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend, Tooltip,
} from 'recharts';

// Premade resource combos
const PREMADE_COMBOS: Record<string, string[]> = {
  Money: ['Cattle', 'Fish', 'Gems', 'Gold', 'Lead', 'Oil', 'Rubber', 'Silver', 'Sugar', 'Water', 'Wheat', 'Wine'],
  Infra: ['Aluminum', 'Coal', 'Gold', 'Iron', 'Lead', 'Lumber', 'Marble', 'Oil', 'Rubber', 'Uranium', 'Water', 'Wheat'],
  Hybrid: ['Aluminum', 'Cattle', 'Coal', 'Fish', 'Gold', 'Iron', 'Lumber', 'Marble', 'Oil', 'Rubber', 'Uranium', 'Wheat'],
};

function computeModSummary(resources: string[]) {
  const lower = resources.map((r) => r.toLowerCase());
  return {
    infraDiscount: (1 - computeResourceModifier(INFRA_MODIFIERS, lower)) * 100,
    popBonus: (computeResourceModifier(POPULATION_MODIFIERS, lower) - 1) * 100,
    upkeepDiscount: (1 - computeResourceModifier(UPKEEP_MODIFIERS, lower)) * 100,
    techDiscount: (1 - computeResourceModifier(TECH_MODIFIERS, lower)) * 100,
    militaryBonus: (computeResourceModifier(MILITARY_MODIFIERS, lower) - 1) * 100,
  };
}

export default function ResourcesPage() {
  const { nation, isLoaded } = useNationData();

  const currentResources = isLoaded
    ? [...nation.connectedResources, ...nation.bonusResources]
    : [];

  const [newResources, setNewResources] = useState<string[]>([]);
  const baseResources = isLoaded ? nation.baseResources : [];

  const toggleResource = (name: string) => {
    if (baseResources.includes(name)) return; // Can't toggle base resources
    setNewResources((prev) =>
      prev.includes(name)
        ? prev.filter((r) => r !== name)
        : [...prev, name]
    );
  };

  const setCombo = (name: string) => {
    const combo = PREMADE_COMBOS[name];
    if (combo) {
      setNewResources(combo.filter((r) => !baseResources.includes(r)));
    }
  };

  const currentMods = useMemo(() => computeModSummary(currentResources), [currentResources]);
  const newMods = useMemo(
    () => computeModSummary([...baseResources, ...newResources]),
    [baseResources, newResources]
  );

  const radarData = useMemo(() => [
    { category: 'Infra Cost', current: currentMods.infraDiscount, proposed: newMods.infraDiscount },
    { category: 'Population', current: currentMods.popBonus, proposed: newMods.popBonus },
    { category: 'Upkeep', current: currentMods.upkeepDiscount, proposed: newMods.upkeepDiscount },
    { category: 'Tech Cost', current: currentMods.techDiscount, proposed: newMods.techDiscount },
    { category: 'Military', current: currentMods.militaryBonus, proposed: newMods.militaryBonus },
  ], [currentMods, newMods]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Resource Optimizer</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Current resources */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Current Resources</CardTitle>
            <CardDescription>
              {isLoaded
                ? 'Your current connected and bonus resources.'
                : 'Load nation data to see your resources.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentResources.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {currentResources.map((r) => (
                  <span
                    key={r}
                    className="px-2 py-1 text-xs rounded bg-secondary text-secondary-foreground"
                  >
                    {r}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No resources loaded.</p>
            )}

            <Separator className="my-4" />
            <ModSummary label="Current Modifiers" mods={currentMods} />
          </CardContent>
        </Card>

        {/* New resource selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">New Resources</CardTitle>
            <CardDescription>
              Select resources to compare. Base resources are locked.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {Object.keys(PREMADE_COMBOS).map((name) => (
                <Button
                  key={name}
                  variant="outline"
                  size="sm"
                  onClick={() => setCombo(name)}
                >
                  {name}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNewResources([])}
              >
                Clear
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {ALL_RESOURCES.map((res) => {
                const isBase = baseResources.includes(res);
                const isChecked = isBase || newResources.includes(res);
                return (
                  <div key={res} className="flex items-center gap-1.5">
                    <Checkbox
                      id={`new-${res}`}
                      checked={isChecked}
                      disabled={isBase}
                      onCheckedChange={() => toggleResource(res)}
                    />
                    <Label
                      htmlFor={`new-${res}`}
                      className={`text-xs cursor-pointer select-none ${
                        isBase ? 'text-muted-foreground' : ''
                      }`}
                    >
                      {res}
                    </Label>
                  </div>
                );
              })}
            </div>

            <Separator />
            <ModSummary label="New Modifiers" mods={newMods} />
          </CardContent>
        </Card>
      </div>

      {/* Comparison */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Modifier Comparison</CardTitle>
          <CardDescription>
            Compare resource sets by their modifier effects on infrastructure, population, upkeep, technology, and military. Toggle resources on/off to see the impact.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 text-sm">
            {(['infraDiscount', 'popBonus', 'upkeepDiscount', 'techDiscount', 'militaryBonus'] as const).map(
              (key) => {
                const labels: Record<string, string> = {
                  infraDiscount: 'Infra Discount',
                  popBonus: 'Pop Growth',
                  upkeepDiscount: 'Upkeep Discount',
                  techDiscount: 'Tech Discount',
                  militaryBonus: 'Military Bonus',
                };
                const diff = newMods[key] - currentMods[key];
                return (
                  <div key={key} className="text-center">
                    <p className="text-xs text-muted-foreground">{labels[key]}</p>
                    <p className="font-medium">{currentMods[key].toFixed(1)}%</p>
                    <p className="text-xs">{'-> '}{newMods[key].toFixed(1)}%</p>
                    <p
                      className={`text-xs font-medium ${
                        diff > 0
                          ? 'text-green-400'
                          : diff < 0
                            ? 'text-red-400'
                            : 'text-muted-foreground'
                      }`}
                    >
                      {diff > 0 ? '+' : ''}
                      {diff.toFixed(1)}%
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </CardContent>
      </Card>

      {/* Radar chart */}
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Modifier Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke={CHART_THEME.grid} />
                <PolarAngleAxis dataKey="category" tick={{ fill: CHART_THEME.text, fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fill: CHART_THEME.text, fontSize: 10 }} />
                <Radar name="Current" dataKey="current" stroke={CHART_THEME.primary} fill={CHART_THEME.area1} fillOpacity={0.5} />
                <Radar name="Proposed" dataKey="proposed" stroke={CHART_THEME.secondary} fill={CHART_THEME.area2} fillOpacity={0.5} />
                <Legend wrapperStyle={{ fontSize: 12, color: CHART_THEME.text }} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v) => { const n = Number(v); return isNaN(n) ? ['—', ''] : [`${n.toFixed(1)}%`, '']; }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ModSummary({
  label,
  mods,
}: {
  label: string;
  mods: ReturnType<typeof computeModSummary>;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <div className="grid grid-cols-2 gap-1 text-xs">
        <span className="text-muted-foreground">Infra Discount:</span>
        <span>{mods.infraDiscount.toFixed(1)}%</span>
        <span className="text-muted-foreground">Pop Growth:</span>
        <span>{mods.popBonus.toFixed(1)}%</span>
        <span className="text-muted-foreground">Upkeep Discount:</span>
        <span>{mods.upkeepDiscount.toFixed(1)}%</span>
        <span className="text-muted-foreground">Tech Discount:</span>
        <span>{mods.techDiscount.toFixed(1)}%</span>
        <span className="text-muted-foreground">Military Bonus:</span>
        <span>{mods.militaryBonus.toFixed(1)}%</span>
      </div>
    </div>
  );
}
