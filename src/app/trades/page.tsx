'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNationData } from '@/hooks/useNationData';
import { ALL_RESOURCES } from '@/lib/data/resources';
import { calculateTradeCircle } from '@/lib/calculators/trade-circle';
import { HelpTip } from '@/components/shared/HelpTip';

// ─── Preset circles ────────────────────────────────────────────────────────────

interface Preset {
  label: string;
  description: string;
  slots: [string, string][];   // 6 pairs of resources
}

const PRESETS: Preset[] = [
  {
    label: 'Money Circle',
    description: 'Max citizen income via Fine Jewelry, Scholar, and happiness bonuses.',
    slots: [
      ['Gold', 'Silver'],
      ['Gems', 'Coal'],
      ['Furs', 'Wine'],
      ['Fish', 'Lead'],
      ['Lumber', 'Water'],
      ['Wheat', 'Sugar'],
    ],
  },
  {
    label: 'Infra Circle',
    description: 'Construction + Steel for deep infra cost discounts.',
    slots: [
      ['Aluminum', 'Iron'],
      ['Lumber', 'Marble'],
      ['Coal', 'Oil'],
      ['Rubber', 'Water'],
      ['Wheat', 'Uranium'],
      ['Lead', 'Gold'],
    ],
  },
  {
    label: 'War Circle',
    description: 'Military effectiveness: aircraft, tanks, and tech/upkeep savings.',
    slots: [
      ['Aluminum', 'Iron'],
      ['Coal', 'Lead'],
      ['Oil', 'Uranium'],
      ['Gold', 'Rubber'],
      ['Lumber', 'Marble'],
      ['Water', 'Wheat'],
    ],
  },
];

// ─── Blank template ─────────────────────────────────────────────────────────

const EMPTY_SLOTS: [string, string][] = [
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
];

const RESOURCE_OPTIONS = ['', ...ALL_RESOURCES] as const;

// ─── Component ───────────────────────────────────────────────────────────────

export default function TradesPage() {
  const { nation, isLoaded } = useNationData();

  // Initialise Player 1 from nation data if available
  const initialSlots = useMemo((): [string, string][] => {
    const slots: [string, string][] = EMPTY_SLOTS.map((s) => [...s] as [string, string]);
    if (isLoaded && nation.baseResources.length >= 1) {
      slots[0][0] = nation.baseResources[0] ?? '';
      slots[0][1] = nation.baseResources[1] ?? '';
    }
    return slots;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // intentionally run once on mount

  const [slots, setSlots] = useState<[string, string][]>(initialSlots);

  const updateSlot = (playerIdx: number, slotIdx: 0 | 1, value: string) => {
    setSlots((prev) => {
      const next = prev.map((s) => [...s] as [string, string]);
      next[playerIdx][slotIdx] = value;
      return next;
    });
  };

  const applyPreset = (preset: Preset) => {
    setSlots(preset.slots.map((pair) => [...pair] as [string, string]));
  };

  const clearAll = () => {
    setSlots(EMPTY_SLOTS.map((s) => [...s] as [string, string]));
  };

  // Collect all 12 resources (non-empty)
  const allSelected = useMemo(
    () => slots.flatMap((pair) => pair).filter(Boolean),
    [slots],
  );

  const result = useMemo(
    () => calculateTradeCircle({ selectedResources: allSelected }, isLoaded ? nation.tech : 0),
    [allSelected, isLoaded, nation.tech],
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Trade Circle Optimizer</h1>

      {/* Presets */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Preset Circles</CardTitle>
          <CardDescription>
            Build a <HelpTip term="Trade Circle" /> of 6 players (12 resources total). Specific combinations unlock <HelpTip term="Bonus Resources" /> with powerful effects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset)}
              >
                {preset.label}
              </Button>
            ))}
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear
            </Button>
          </div>
          <div className="mt-3 space-y-1">
            {PRESETS.map((preset) => (
              <p key={preset.label} className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{preset.label}:</span>{' '}
                {preset.description}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Player slots */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Player Slots</CardTitle>
          <CardDescription>
            Each player contributes 2 base resources.{' '}
            {isLoaded ? 'Player 1 is pre-filled from your nation data.' : 'Load nation data to pre-fill Player 1.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((pair, playerIdx) => (
              <PlayerSlot
                key={playerIdx}
                label={playerIdx === 0 ? 'Player 1 (You)' : `Player ${playerIdx + 1}`}
                res1={pair[0]}
                res2={pair[1]}
                onRes1Change={(v) => updateSlot(playerIdx, 0, v)}
                onRes2Change={(v) => updateSlot(playerIdx, 1, v)}
                allSelected={allSelected}
                isOwn={playerIdx === 0}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Resources */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Active Resources</CardTitle>
            <CardDescription>{allSelected.length} / 12 slots filled</CardDescription>
          </CardHeader>
          <CardContent>
            {allSelected.length === 0 ? (
              <p className="text-sm text-muted-foreground">No resources selected yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allSelected.map((r, i) => (
                  <span
                    key={`${r}-${i}`}
                    className="px-2 py-1 text-xs rounded bg-secondary text-secondary-foreground"
                  >
                    {r}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Total Benefits */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
              <span className="text-muted-foreground">Happiness Bonus</span>
              <span className={result.totalHappinessBonus > 0 ? 'text-green-400 font-medium' : ''}>
                +{result.totalHappinessBonus}
              </span>

              <span className="text-muted-foreground">Infra Cost Discount</span>
              <span className={result.totalInfraCostDiscount > 0 ? 'text-green-400 font-medium' : ''}>
                {result.totalInfraCostDiscount > 0
                  ? `-${(result.totalInfraCostDiscount * 100).toFixed(0)}%`
                  : '0%'}
              </span>

              <span className="text-muted-foreground">Infra Upkeep Discount</span>
              <span className={result.totalInfraUpkeepDiscount > 0 ? 'text-green-400 font-medium' : ''}>
                {result.totalInfraUpkeepDiscount > 0
                  ? `-${(result.totalInfraUpkeepDiscount * 100).toFixed(0)}%`
                  : '0%'}
              </span>

              <span className="text-muted-foreground">Population Bonus</span>
              <span className={result.totalPopulationBonus > 0 ? 'text-green-400 font-medium' : ''}>
                {result.totalPopulationBonus > 0
                  ? `+${(result.totalPopulationBonus * 100).toFixed(0)}%`
                  : '0%'}
              </span>

              <span className="text-muted-foreground">Citizen Income Bonus</span>
              <span className={result.totalCitizenIncomeBonus > 0 ? 'text-green-400 font-medium' : ''}>
                {result.totalCitizenIncomeBonus > 0
                  ? `+$${result.totalCitizenIncomeBonus.toFixed(2)}/citizen`
                  : '$0'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bonus Resources Unlocked */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Bonus Resources Unlocked</CardTitle>
          <CardDescription>
            {result.bonusResources.length} bonus resource{result.bonusResources.length !== 1 ? 's' : ''} active
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result.bonusResources.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bonus resources unlocked yet.</p>
          ) : (
            <div className="space-y-3">
              {result.bonusResources.map((bonus) => (
                <div key={bonus.name} className="flex flex-wrap gap-x-6 gap-y-1 items-start">
                  <span className="text-sm font-medium min-w-40">{bonus.name}</span>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                    {bonus.happinessBonus > 0 && (
                      <span className="text-green-400">+{bonus.happinessBonus} happiness</span>
                    )}
                    {bonus.infraCostDiscount > 0 && (
                      <span className="text-green-400">-{(bonus.infraCostDiscount * 100).toFixed(0)}% infra cost</span>
                    )}
                    {bonus.infraUpkeepDiscount > 0 && (
                      <span className="text-green-400">-{(bonus.infraUpkeepDiscount * 100).toFixed(0)}% upkeep</span>
                    )}
                    {bonus.populationBonus > 0 && (
                      <span className="text-green-400">+{(bonus.populationBonus * 100).toFixed(0)}% pop</span>
                    )}
                    {bonus.citizenIncomeBonus > 0 && (
                      <span className="text-green-400">+${bonus.citizenIncomeBonus}/citizen</span>
                    )}
                    {bonus.otherEffects && (
                      <span>{bonus.otherEffects}</span>
                    )}
                    {bonus.techRequired !== undefined && (
                      <span className="text-yellow-500">(requires {bonus.techRequired} tech)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Near Misses */}
      {result.missingForBonuses.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Near Misses</CardTitle>
            <CardDescription>Bonuses you are 1 resource away from unlocking.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.missingForBonuses.map(({ bonus, missing }) => (
                <div key={bonus} className="flex gap-4 text-sm">
                  <span className="font-medium min-w-40">{bonus}</span>
                  <span className="text-muted-foreground">
                    Missing:{' '}
                    <span className="text-yellow-400">{missing.join(', ')}</span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Player slot sub-component ────────────────────────────────────────────────

interface PlayerSlotProps {
  label: string;
  res1: string;
  res2: string;
  onRes1Change: (v: string) => void;
  onRes2Change: (v: string) => void;
  allSelected: string[];
  isOwn: boolean;
}

function PlayerSlot({ label, res1, res2, onRes1Change, onRes2Change, allSelected, isOwn }: PlayerSlotProps) {
  return (
    <div
      className={`rounded-lg border p-3 space-y-2 ${
        isOwn ? 'border-[#B92432]/60 bg-[#B92432]/5' : 'border-border'
      }`}
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <ResourceSelect
        value={res1}
        onChange={onRes1Change}
        placeholder="Resource 1"
        allSelected={allSelected}
        ownValue={res1}
      />
      <ResourceSelect
        value={res2}
        onChange={onRes2Change}
        placeholder="Resource 2"
        allSelected={allSelected}
        ownValue={res2}
      />
    </div>
  );
}

// ─── Resource select sub-component ────────────────────────────────────────────

interface ResourceSelectProps {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  allSelected: string[];
  ownValue: string;
}

function ResourceSelect({ value, onChange, placeholder, allSelected, ownValue }: ResourceSelectProps) {
  return (
    <Select value={value || '__none__'} onValueChange={(v) => onChange(!v || v === '__none__' ? '' : v)}>
      <SelectTrigger className="w-full h-8 text-xs">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__none__">
          <span className="text-muted-foreground italic">— none —</span>
        </SelectItem>
        <Separator className="my-1" />
        {RESOURCE_OPTIONS.filter(Boolean).map((res) => {
          const isDuplicate = res !== ownValue && allSelected.includes(res);
          return (
            <SelectItem key={res} value={res} disabled={isDuplicate}>
              <span className={isDuplicate ? 'text-muted-foreground/50' : ''}>
                {res}
                {isDuplicate ? ' (taken)' : ''}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
