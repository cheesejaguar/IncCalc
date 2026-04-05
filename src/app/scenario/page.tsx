'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNationData } from '@/hooks/useNationData';
import { calculateInfraCost } from '@/lib/calculators/infrastructure';
import { calculateTechCost } from '@/lib/calculators/tech';
import { calculateLandCost } from '@/lib/calculators/land';
import { calculatePopulation } from '@/lib/calculators/population';
import { calculateUpkeep } from '@/lib/calculators/upkeep';
import { calculateNationStrength } from '@/lib/calculators/nation-strength';
import { NumberInput } from '@/components/shared/NumberInput';
import { formatCurrency, formatNumber, DeltaValue } from '@/components/shared/CurrencyDisplay';

// ── helpers ─────────────────────────────────────────────────────────────────

function sign(n: number): string {
  return n >= 0 ? `+${formatNumber(n, 2)}` : formatNumber(n, 2);
}

function signCurrency(n: number): string {
  return n >= 0 ? `+${formatCurrency(n)}` : `-${formatCurrency(Math.abs(n))}`;
}

function deltaClass(n: number, lowerIsBetter = false): string {
  if (n === 0) return 'text-muted-foreground';
  const positive = lowerIsBetter ? n < 0 : n > 0;
  return positive ? 'text-green-400' : 'text-red-400';
}

// ── sub-components ──────────────────────────────────────────────────────────

function ColHeader({ label }: { label: string }) {
  return (
    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center py-1">
      {label}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-3 text-[11px] uppercase tracking-widest text-muted-foreground/60 pt-2 pb-0.5 border-t border-border/40 mt-1">
      {children}
    </div>
  );
}

function Row({
  label,
  current,
  proposed,
  delta,
  deltaLowerIsBetter = false,
  deltaPrefix = '',
}: {
  label: string;
  current: string;
  proposed: string;
  delta: number;
  deltaLowerIsBetter?: boolean;
  deltaPrefix?: string;
}) {
  const cls = deltaClass(delta, deltaLowerIsBetter);
  const deltaStr = deltaPrefix
    ? `${deltaPrefix}${delta >= 0 ? '+' : ''}${formatNumber(delta, 2)}`
    : `${delta >= 0 ? '+' : ''}${formatNumber(delta, 2)}`;

  return (
    <>
      <div className="text-xs text-muted-foreground py-1">{label}</div>
      <div className="text-xs font-mono text-center py-1">{current}</div>
      <div className={`text-xs font-mono text-center py-1 font-medium ${delta !== 0 ? 'text-blue-300' : ''}`}>{proposed}</div>
      <div className={`text-xs font-mono text-center py-1 font-medium ${cls}`}>{deltaStr}</div>
    </>
  );
}

function CurrencyRow({
  label,
  current,
  proposed,
  delta,
  deltaLowerIsBetter = false,
}: {
  label: string;
  current: number;
  proposed: number;
  delta: number;
  deltaLowerIsBetter?: boolean;
}) {
  const cls = deltaClass(delta, deltaLowerIsBetter);
  return (
    <>
      <div className="text-xs text-muted-foreground py-1">{label}</div>
      <div className="text-xs font-mono text-center py-1">{formatCurrency(current)}</div>
      <div className={`text-xs font-mono text-center py-1 font-medium ${delta !== 0 ? 'text-blue-300' : ''}`}>{formatCurrency(proposed)}</div>
      <div className={`text-xs font-mono text-center py-1 font-medium ${cls}`}>{signCurrency(delta)}</div>
    </>
  );
}

// ── purchase cost display ────────────────────────────────────────────────────

function CostRow({ label, cost }: { label: string; cost: number }) {
  if (cost === 0) return null;
  return (
    <>
      <div className="text-xs text-muted-foreground/70 py-0.5 pl-3">{label}</div>
      <div className="col-span-2 text-xs font-mono text-center py-0.5 text-yellow-400">
        {formatCurrency(cost)}
      </div>
      <div className="text-xs text-muted-foreground/60 text-center py-0.5">purchase cost</div>
    </>
  );
}

// ── main page ────────────────────────────────────────────────────────────────

export default function ScenarioPage() {
  const { nation, isLoaded, allResources } = useNationData();

  // Proposed state — initialised from nation or sensible defaults
  const [propInfra, setPropInfra] = useState(() => (isLoaded ? nation.infra : 0));
  const [propTech, setPropTech] = useState(() => (isLoaded ? nation.tech : 0));
  const [propLand, setPropLand] = useState(() => (isLoaded ? nation.land : 0));

  // Derived current values
  const curInfra = isLoaded ? nation.infra : 0;
  const curTech = isLoaded ? nation.tech : 0;
  const curLand = isLoaded ? nation.land : 0;
  const curNS = isLoaded ? nation.nationStrength : 0;
  const curCitizens = isLoaded ? nation.citizens : 0;
  const curIncome = isLoaded ? nation.income : 0;

  // Deltas — clamp to 0 so we only model buying, not selling
  const infraDelta = Math.max(0, propInfra - curInfra);
  const techDelta = Math.max(0, propTech - curTech);
  const landDelta = Math.max(0, propLand - curLand);

  const factories = isLoaded ? (nation.improvements['Factories'] ?? 0) : 0;
  const universities = isLoaded ? (nation.improvements['Universities'] ?? 0) : 0;
  const laborCamps = isLoaded ? (nation.improvements['Labor Camps'] ?? 0) : 0;
  const clinics = isLoaded ? (nation.improvements['Clinics'] ?? 0) : 0;
  const walls = isLoaded ? (nation.improvements['Border Walls'] ?? 0) : 0;
  const hospitals = isLoaded ? (nation.improvements['Hospitals'] ?? 0) : 0;

  // ── purchase costs ─────────────────────────────────────────────────────────
  const infraCost = useMemo(() => {
    if (infraDelta <= 0) return 0;
    return calculateInfraCost({
      currentInfra: curInfra,
      purchaseAmount: infraDelta,
      factories,
      activeResources: allResources,
      ownedWonders: isLoaded ? nation.wonders : [],
    }).totalCost;
  }, [curInfra, infraDelta, factories, allResources, isLoaded]);

  const techCost = useMemo(() => {
    if (techDelta <= 0) return 0;
    return calculateTechCost({
      currentTech: curTech,
      purchaseAmount: techDelta,
      universities,
      activeResources: allResources,
    }).totalCost;
  }, [curTech, techDelta, universities, allResources]);

  const landCost = useMemo(() => {
    if (landDelta <= 0) return 0;
    return calculateLandCost({
      currentLand: curLand,
      purchaseAmount: landDelta,
      peakLand: isLoaded ? nation.purchasedLand : curLand,
      activeResources: allResources,
    }).totalCost;
  }, [curLand, landDelta, allResources, isLoaded]);

  const totalPurchaseCost = infraCost + techCost + landCost;

  // ── proposed population ────────────────────────────────────────────────────
  const propPopResult = useMemo(() => {
    return calculatePopulation({
      currentInfra: curInfra,
      purchaseAmount: infraDelta,
      land: propLand,
      existingCitizens: curCitizens,
      clinics,
      walls,
      hospitals,
      activeResources: allResources,
    });
  }, [curInfra, infraDelta, propLand, curCitizens, clinics, walls, hospitals, allResources]);

  const propCitizens = propPopResult.totalCitizens;
  const citizenDelta = propCitizens - curCitizens;

  // ── proposed upkeep ────────────────────────────────────────────────────────
  // We need a rough NS for the proposed state to feed into the upkeep modifier
  const propNSRough = useMemo(() => {
    if (!isLoaded) return 1;
    return calculateNationStrength({
      infra: propInfra,
      tech: propTech,
      land: propLand,
      soldiers: nation.soldiers,
      tanksDeployed: Math.floor(nation.tanks * 0.5),
      tanksDefending: Math.floor(nation.tanks * 0.5),
      cruiseMissiles: 0,
      nukes: nation.nukes,
      aircraftStrength: nation.aircraft * 3,
      navyStrength: 0,
    }).nationStrength;
  }, [isLoaded, propInfra, propTech, propLand]);

  const curUpkeepResult = useMemo(() => {
    if (!isLoaded) return null;
    return calculateUpkeep({
      currentInfra: curInfra,
      purchaseAmount: 0,
      tech: curTech,
      nationStrength: Math.max(curNS, 1),
      laborCamps,
      activeResources: allResources,
      ownedWonders: nation.wonders,
    });
  }, [isLoaded, curInfra, curTech, curNS, laborCamps, allResources]);

  const propUpkeepResult = useMemo(() => {
    return calculateUpkeep({
      currentInfra: propInfra,
      purchaseAmount: 0,
      tech: propTech,
      nationStrength: Math.max(propNSRough, 1),
      laborCamps,
      activeResources: allResources,
      ownedWonders: isLoaded ? nation.wonders : [],
    });
  }, [propInfra, propTech, propNSRough, laborCamps, allResources, isLoaded]);

  const curBill = curUpkeepResult?.totalBillBefore ?? 0;
  const propBill = propUpkeepResult.totalBillBefore;
  const billDelta = propBill - curBill;

  // ── proposed gross income ──────────────────────────────────────────────────
  // Gross income = citizens * income/citizen
  const curGrossIncome = curCitizens * curIncome;
  // Approximate: income-per-citizen stays the same; only citizen count changes
  const propGrossIncome = propCitizens * curIncome;
  const grossIncomeDelta = propGrossIncome - curGrossIncome;

  // Net daily = gross - bills
  const curNetDaily = curGrossIncome - curBill;
  const propNetDaily = propGrossIncome - propBill;
  const netDailyDelta = propNetDaily - curNetDaily;

  // ── proposed NS ────────────────────────────────────────────────────────────
  const propNS = propNSRough;
  const nsDelta = propNS - curNS;

  // ── empty state ────────────────────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Scenario Planner</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Model changes to your nation and see the impact
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Load your nation data on the Home page first.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Scenario Planner</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Model changes to your nation and see the impact
        </p>
      </div>

      {/* ── Proposed inputs ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Proposed Changes</CardTitle>
          <CardDescription>
            Model proposed changes and see the total cost, income impact, and ROI before committing. Only increases from current values are calculated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <NumberInput
              id="prop-infra"
              label="Infrastructure"
              value={propInfra}
              onChange={setPropInfra}
              min={curInfra}
              step={10}
            />
            <NumberInput
              id="prop-tech"
              label="Technology"
              value={propTech}
              onChange={setPropTech}
              min={curTech}
              step={1}
            />
            <NumberInput
              id="prop-land"
              label="Land"
              value={propLand}
              onChange={setPropLand}
              min={curLand}
              step={10}
            />
          </div>
          <p className="text-[11px] text-muted-foreground/60 mt-2">
            Enter target values. Only increases are modelled — set values higher than current to see costs and impact.
          </p>
        </CardContent>
      </Card>

      {/* ── Comparison table ────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Side-by-Side Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-x-2 border-b border-border pb-1 mb-1">
            <div />
            <ColHeader label="Current" />
            <ColHeader label="Proposed" />
            <ColHeader label="Impact" />
          </div>

          <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-x-2 items-center">

            {/* ── Infrastructure ──────────────────────────────────────── */}
            <SectionLabel>Infrastructure</SectionLabel>

            <Row
              label="Levels"
              current={formatNumber(curInfra, 2)}
              proposed={formatNumber(propInfra, 2)}
              delta={infraDelta}
            />

            {infraDelta > 0 && (
              <CostRow label="Purchase cost" cost={infraCost} />
            )}

            {/* ── Technology ──────────────────────────────────────────── */}
            <SectionLabel>Technology</SectionLabel>

            <Row
              label="Levels"
              current={formatNumber(curTech, 2)}
              proposed={formatNumber(propTech, 2)}
              delta={techDelta}
            />

            {techDelta > 0 && (
              <CostRow label="Purchase cost" cost={techCost} />
            )}

            {/* ── Land ────────────────────────────────────────────────── */}
            <SectionLabel>Land</SectionLabel>

            <Row
              label="Levels"
              current={formatNumber(curLand, 2)}
              proposed={formatNumber(propLand, 2)}
              delta={landDelta}
            />

            {landDelta > 0 && (
              <CostRow label="Purchase cost" cost={landCost} />
            )}

            {/* ── Population ──────────────────────────────────────────── */}
            <SectionLabel>Population</SectionLabel>

            <Row
              label="Citizens"
              current={formatNumber(curCitizens, 0)}
              proposed={formatNumber(propCitizens, 0)}
              delta={citizenDelta}
            />

            {/* ── Nation Strength ─────────────────────────────────────── */}
            <SectionLabel>Nation Strength</SectionLabel>

            <Row
              label="NS"
              current={formatNumber(curNS, 2)}
              proposed={formatNumber(propNS, 2)}
              delta={nsDelta}
            />

            <Row
              label="War range"
              current={`${formatNumber(curNS * 0.75, 0)} – ${formatNumber(curNS * 1.33, 0)}`}
              proposed={`${formatNumber(propNS * 0.75, 0)} – ${formatNumber(propNS * 1.33, 0)}`}
              delta={nsDelta * 0.75}
            />

            {/* ── Daily Finances ──────────────────────────────────────── */}
            <SectionLabel>Daily Finances</SectionLabel>

            <CurrencyRow
              label="Gross income"
              current={curGrossIncome}
              proposed={propGrossIncome}
              delta={grossIncomeDelta}
            />

            <CurrencyRow
              label="Bills"
              current={curBill}
              proposed={propBill}
              delta={billDelta}
              deltaLowerIsBetter
            />

            <CurrencyRow
              label="Net daily"
              current={curNetDaily}
              proposed={propNetDaily}
              delta={netDailyDelta}
            />

          </div>
        </CardContent>
      </Card>

      {/* ── Summary card ────────────────────────────────────────────────── */}
      {totalPurchaseCost > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              Total purchase cost:{' '}
              <strong className="text-yellow-400">{formatCurrency(totalPurchaseCost)}</strong>
            </p>

            {netDailyDelta !== 0 && (
              <p>
                Net daily income change:{' '}
                <strong>
                  <DeltaValue value={netDailyDelta} />
                </strong>
              </p>
            )}

            {netDailyDelta > 0 && totalPurchaseCost > 0 && (
              <p>
                ROI:{' '}
                <strong>{formatNumber(totalPurchaseCost / netDailyDelta, 0)} days</strong>
              </p>
            )}

            {netDailyDelta <= 0 && totalPurchaseCost > 0 && (
              <p className="text-red-400">
                Net income does not improve with these changes — consider improving happiness or income before purchasing.
              </p>
            )}

            {infraDelta > 0 && (
              <p className="text-muted-foreground text-xs">
                Infra: {formatNumber(curInfra, 2)} → {formatNumber(propInfra, 2)} (+{formatNumber(infraDelta, 2)} levels,{' '}
                {formatCurrency(infraCost)})
              </p>
            )}
            {techDelta > 0 && (
              <p className="text-muted-foreground text-xs">
                Tech: {formatNumber(curTech, 2)} → {formatNumber(propTech, 2)} (+{formatNumber(techDelta, 2)} levels,{' '}
                {formatCurrency(techCost)})
              </p>
            )}
            {landDelta > 0 && (
              <p className="text-muted-foreground text-xs">
                Land: {formatNumber(curLand, 2)} → {formatNumber(propLand, 2)} (+{formatNumber(landDelta, 2)} levels,{' '}
                {formatCurrency(landCost)})
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
