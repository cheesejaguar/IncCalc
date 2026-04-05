'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpTip } from '@/components/shared/HelpTip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNationData } from '@/hooks/useNationData';
import { calculateInfraCost, generateInfraCostCurve } from '@/lib/calculators/infrastructure';
import { calculatePopulation, infraNeededForCitizens } from '@/lib/calculators/population';
import { calculateUpkeep } from '@/lib/calculators/upkeep';
import { calculateHappiness } from '@/lib/calculators/happiness';
import { calculateCrime } from '@/lib/calculators/crime';
import { calculateLandCost, generateLandCostCurve } from '@/lib/calculators/land';
import { calculateWarchest, generateWarchestProjection } from '@/lib/calculators/warchest';
import { optimizeTaxRate } from '@/lib/calculators/tax-optimizer';
import { NumberInput } from '@/components/shared/NumberInput';
import { ResourceCheckboxGrid } from '@/components/shared/ResourceCheckboxGrid';
import { formatCurrency, formatNumber, DeltaValue } from '@/components/shared/CurrencyDisplay';
import { INFRA_MODIFIERS, POPULATION_MODIFIERS, RESOURCE_LAND_COST_DISCOUNTS } from '@/lib/data/resources';
import { CHART_THEME, TOOLTIP_STYLE, AXIS_TICK } from '@/lib/chart-theme';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Cell,
} from 'recharts';

const INFRA_RESOURCE_OPTIONS = Object.entries(INFRA_MODIFIERS).map(([key, mod]) => ({
  key,
  label: `${mod.name} (-${(mod.value * 100).toFixed(0)}%)`,
}));

const POP_RESOURCE_OPTIONS = Object.entries(POPULATION_MODIFIERS).map(([key, mod]) => ({
  key,
  label: `${mod.name} (+${(mod.value * 100).toFixed(1)}%)`,
}));

const LAND_RESOURCE_OPTIONS = Object.entries(RESOURCE_LAND_COST_DISCOUNTS).map(([key, value]) => ({
  key,
  label: `${key.charAt(0).toUpperCase() + key.slice(1)} (-${(value * 100).toFixed(0)}%)`,
}));

export default function EconomyPage() {
  const { nation, isLoaded, allResources } = useNationData();

  // Infra tab state
  const [infraHave, setInfraHave] = useState(isLoaded ? nation.infra : 100);
  const [infraWanted, setInfraWanted] = useState(100);
  const [factories, setFactories] = useState(isLoaded ? (nation.improvements['Factories'] ?? 0) : 0);
  const [infraResources, setInfraResources] = useState<string[]>(
    isLoaded ? allResources.filter((r) => r in INFRA_MODIFIERS) : []
  );

  // Population tab state
  const [popInfraHave, setPopInfraHave] = useState(isLoaded ? nation.infra : 100);
  const [popInfraWanted, setPopInfraWanted] = useState(100);
  const [land, setLand] = useState(isLoaded ? nation.land : 0);
  const [existingCitizens, setExistingCitizens] = useState(isLoaded ? nation.citizens : 0);
  const [clinics, setClinics] = useState(isLoaded ? (nation.improvements['Clinics'] ?? 0) : 0);
  const [walls, setWalls] = useState(isLoaded ? (nation.improvements['Border Walls'] ?? 0) : 0);
  const [hospitals, setHospitals] = useState(isLoaded ? (nation.improvements['Hospitals'] ?? 0) : 0);
  const [popResources, setPopResources] = useState<string[]>(
    isLoaded ? allResources.filter((r) => r in POPULATION_MODIFIERS) : []
  );

  // Upkeep state
  const [tech, setTech] = useState(isLoaded ? nation.tech : 0);
  const [ns, setNs] = useState(isLoaded ? nation.nationStrength : 1);
  const [laborCamps, setLaborCamps] = useState(isLoaded ? (nation.improvements['Labor Camps'] ?? 0) : 0);
  const [income, setIncome] = useState(isLoaded ? nation.income : 0);

  // Land tab state
  const [landCurrent, setLandCurrent] = useState(isLoaded ? nation.land : 0);
  const [landBuy, setLandBuy] = useState(100);
  const [peakLand, setPeakLand] = useState(isLoaded ? nation.land : 0);
  const [landResources, setLandResources] = useState<string[]>(
    isLoaded
      ? allResources.filter((r) => r in RESOURCE_LAND_COST_DISCOUNTS)
      : []
  );

  // Warchest tab state
  const [wcCash, setWcCash] = useState(isLoaded ? nation.cash : 0);
  const [wcDailyIncome, setWcDailyIncome] = useState(
    isLoaded ? nation.income * nation.citizens : 0
  );
  const [wcDailyBills, setWcDailyBills] = useState(0);
  const [wcWarUpkeep, setWcWarUpkeep] = useState(0);

  // Calculate results
  const infraResult = useMemo(
    () =>
      calculateInfraCost({
        currentInfra: infraHave,
        purchaseAmount: Math.min(infraWanted, 5000),
        factories,
        activeResources: infraResources,
        ownedWonders: isLoaded ? nation.wonders : [],
      }),
    [infraHave, infraWanted, factories, infraResources]
  );

  const popResult = useMemo(
    () =>
      calculatePopulation({
        currentInfra: popInfraHave,
        purchaseAmount: popInfraWanted,
        land,
        existingCitizens,
        clinics,
        walls,
        hospitals,
        activeResources: popResources,
      }),
    [popInfraHave, popInfraWanted, land, existingCitizens, clinics, walls, hospitals, popResources]
  );

  const upkeepResult = useMemo(
    () =>
      calculateUpkeep({
        currentInfra: infraHave,
        purchaseAmount: infraWanted,
        tech,
        nationStrength: ns,
        laborCamps,
        activeResources: infraResources,
        ownedWonders: isLoaded ? nation.wonders : [],
      }),
    [infraHave, infraWanted, tech, ns, laborCamps, infraResources]
  );

  const landResult = useMemo(
    () =>
      calculateLandCost({
        currentLand: landCurrent,
        purchaseAmount: landBuy,
        peakLand,
        activeResources: landResources,
      }),
    [landCurrent, landBuy, peakLand, landResources]
  );

  const warchestResult = useMemo(
    () =>
      calculateWarchest({
        currentCash: wcCash,
        dailyIncome: wcDailyIncome,
        dailyBills: wcDailyBills,
        warMilitaryUpkeep: wcWarUpkeep,
      }),
    [wcCash, wcDailyIncome, wcDailyBills, wcWarUpkeep]
  );

  // Chart data
  const infraChartData = useMemo(
    () =>
      infraWanted > 0
        ? generateInfraCostCurve(
            infraHave,
            Math.min(infraWanted, 5000),
            factories,
            infraResources,
            isLoaded ? nation.wonders : []
          )
        : [],
    [infraHave, infraWanted, factories, infraResources]
  );

  const landChartData = useMemo(
    () =>
      landBuy > 0
        ? generateLandCostCurve(landCurrent, landBuy, peakLand, landResources)
        : [],
    [landCurrent, landBuy, peakLand, landResources]
  );

  const warchestChartData = useMemo(
    () =>
      generateWarchestProjection(
        wcCash,
        warchestResult.dailyNetIncome,
        warchestResult.warDailyNet
      ),
    [wcCash, warchestResult.dailyNetIncome, warchestResult.warDailyNet]
  );

  const happinessResult = useMemo(
    () =>
      isLoaded
        ? calculateHappiness({
            tech: nation.tech,
            taxRate: nation.taxRate,
            defcon: nation.defcon,
            environment: nation.environment,
            connectedResources: nation.connectedResources,
            bonusResources: nation.bonusResources,
            improvements: nation.improvements,
            ownedWonders: nation.wonders,
            crimePreventionScore: 435,
          })
        : null,
    [isLoaded]
  );

  // Tax optimizer
  const taxResult = useMemo(() => {
    if (!isLoaded) return null;
    // Base happiness excluding the tax component: total - taxHappiness
    const taxHappiness = 28 - nation.taxRate;
    const baseHappiness = happinessResult
      ? happinessResult.total - taxHappiness
      : 5; // fallback
    return optimizeTaxRate({
      citizens: nation.citizens,
      grossIncome: nation.grossIncome,
      currentTaxRate: nation.taxRate,
      banks: nation.improvements['Banks'] ?? 0,
      foreignMinistries: nation.improvements['Foreign Ministries'] ?? 0,
      guerillaCamps: nation.improvements['Guerilla Camps'] ?? 0,
      harbors: nation.improvements['Harbors'] ?? 0,
      schools: nation.improvements['Schools'] ?? 0,
      universities: nation.improvements['Universities'] ?? 0,
      baseHappiness,
      connectedResources: nation.connectedResources,
      bonusResources: nation.bonusResources,
    });
  }, [isLoaded, happinessResult]);

  const happinessBreakdownData = useMemo(
    () =>
      happinessResult
        ? happinessResult.breakdown.map((item) => ({
            source: item.source,
            value: item.value,
          }))
        : [],
    [happinessResult]
  );

  // ROI calculation
  const dailyIncomeGain = popResult.citizensGained * income;
  const roi =
    dailyIncomeGain - upkeepResult.billIncrease > 0
      ? infraResult.totalCost / (dailyIncomeGain - upkeepResult.billIncrease)
      : -1;

  // Warchest color helper
  const warchestColor =
    warchestResult.recommendedWarchest <= 0
      ? 'text-muted-foreground'
      : wcCash >= warchestResult.recommendedWarchest
      ? 'text-green-400'
      : wcCash >= warchestResult.recommendedWarchest * 0.5
      ? 'text-yellow-400'
      : 'text-red-400';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Economy Calculator</h1>

      <Tabs defaultValue="infra">
        <TabsList>
          <TabsTrigger value="infra">Infrastructure</TabsTrigger>
          <TabsTrigger value="population">Population</TabsTrigger>
          <TabsTrigger value="happiness">Happiness</TabsTrigger>
          <TabsTrigger value="crime">Crime Index</TabsTrigger>
          <TabsTrigger value="land">Land</TabsTrigger>
          <TabsTrigger value="warchest">Warchest</TabsTrigger>
          <TabsTrigger value="tax">Tax Optimizer</TabsTrigger>
        </TabsList>

        <TabsContent value="infra" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Infrastructure Purchase</CardTitle>
              <CardDescription>Calculate the cost of purchasing infrastructure levels. Costs increase at tier breakpoints.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <NumberInput id="infra-have" label="Current Infra" value={infraHave} onChange={setInfraHave} min={0} />
                <NumberInput id="infra-wanted" label="Amount to Buy" value={infraWanted} onChange={(v) => setInfraWanted(Math.min(v, 5000))} min={0} max={5000} />
                <NumberInput id="factories" label={<>Factories <HelpTip term="Factories" /></>} value={factories} onChange={setFactories} min={0} max={5} />
                <NumberInput id="income" label="Income/Citizen" value={income} onChange={setIncome} min={0} step={0.01} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <NumberInput id="tech" label="Technology" value={tech} onChange={setTech} min={0} />
                <NumberInput id="ns" label="Nation Strength" value={ns} onChange={setNs} min={1} />
                <NumberInput id="labor" label="Labor Camps" value={laborCamps} onChange={setLaborCamps} min={0} max={5} />
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Infrastructure Discount Resources</p>
                <ResourceCheckboxGrid
                  availableResources={INFRA_RESOURCE_OPTIONS}
                  selected={infraResources}
                  onChange={setInfraResources}
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
                Cost to purchase <strong>{formatNumber(infraWanted)}</strong> infra levels:{' '}
                <strong>{formatCurrency(infraResult.totalCost)}</strong>
              </p>
              <p>
                Population gained: <strong>+{formatNumber(popResult.citizensGained, 1)}</strong> citizens
                (total: {formatNumber(popResult.totalCitizens, 1)})
              </p>
              <p>
                Upkeep per level: {formatCurrency(upkeepResult.costPerLevel)} {' -> '}
                {formatCurrency(upkeepResult.costPerLevelAfter)} (
                <DeltaValue value={upkeepResult.costPerLevelAfter - upkeepResult.costPerLevel} />)
              </p>
              <p>
                Total daily upkeep: {formatCurrency(upkeepResult.totalBillBefore)} {' -> '}
                {formatCurrency(upkeepResult.totalBillAfter)} (
                <DeltaValue value={upkeepResult.billIncrease} />)
              </p>
              {income > 0 && (
                <>
                  <p>
                    Daily gross income gain: <DeltaValue value={dailyIncomeGain} />
                  </p>
                  <p>
                    {roi >= 0 ? (
                      <>ROI: <strong>{formatNumber(roi, 0)} days</strong></>
                    ) : (
                      <span className="text-red-400">
                        Negative ROI - you need improvements/wonders to profit from this purchase.
                      </span>
                    )}
                  </p>
                </>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Modifier: {(infraResult.modifier * 100).toFixed(2)}%
              </p>
            </CardContent>
          </Card>

          {infraWanted > 0 && infraChartData.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Cost Per Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={infraChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                      <XAxis dataKey="level" tick={AXIS_TICK} label={{ value: 'Infrastructure Level', position: 'insideBottom', offset: -2, fill: CHART_THEME.text, fontSize: 12 }} />
                      <YAxis tick={AXIS_TICK} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip {...TOOLTIP_STYLE} formatter={(v: unknown) => { const n = typeof v === 'number' ? v : 0; return [`$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 'Cost/Level']; }} />
                      <Line type="monotone" dataKey="cost" stroke={CHART_THEME.primary} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="population" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Population Growth</CardTitle>
              <CardDescription>Estimate population growth from infrastructure purchases. Modified by Clinics, Hospitals, and resources.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <NumberInput id="pop-infra-have" label="Current Infra" value={popInfraHave} onChange={setPopInfraHave} min={0} />
                <NumberInput id="pop-infra-wanted" label="Infra to Buy" value={popInfraWanted} onChange={setPopInfraWanted} min={0} />
                <NumberInput id="pop-land" label="Land" value={land} onChange={setLand} min={0} />
                <NumberInput id="pop-citizens" label="Current Citizens" value={existingCitizens} onChange={setExistingCitizens} min={0} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <NumberInput id="clinics" label="Clinics" value={clinics} onChange={setClinics} min={0} max={5} />
                <NumberInput id="walls" label="Border Walls" value={walls} onChange={setWalls} min={0} max={5} />
                <NumberInput id="hospitals" label="Hospitals" value={hospitals} onChange={setHospitals} min={0} max={1} />
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Population Growth Resources</p>
                <ResourceCheckboxGrid
                  availableResources={POP_RESOURCE_OPTIONS}
                  selected={popResources}
                  onChange={setPopResources}
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
                Citizens gained from {formatNumber(popInfraWanted)} infra:{' '}
                <strong className="text-green-400">+{formatNumber(popResult.citizensGained, 1)}</strong>
              </p>
              <p>
                Total citizens: <strong>{formatNumber(popResult.totalCitizens, 1)}</strong>
              </p>
              <p>
                Infra needed for 1,000 more citizens:{' '}
                <strong>
                  {formatNumber(
                    infraNeededForCitizens(1000, {
                      land,
                      existingCitizens,
                      clinics,
                      walls,
                      hospitals,
                      activeResources: popResources,
                    }),
                    2
                  )}
                </strong>{' '}
                levels
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Modifier: {(popResult.modifier * 100).toFixed(2)}%
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="happiness" className="space-y-4 mt-4">
          {!isLoaded ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">No nation data loaded. Enter your nation data to see a happiness breakdown.</p>
              </CardContent>
            </Card>
          ) : happinessResult && (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Happiness Breakdown</CardTitle>
                  <CardDescription>Breakdown of all factors affecting your population&apos;s happiness. Each point of happiness adds $2 per citizen per day to base income.</CardDescription>
                </CardHeader>
                <CardContent>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left pb-2 font-medium text-muted-foreground">Source</th>
                        <th className="text-right pb-2 font-medium text-muted-foreground">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {happinessResult.breakdown.map((item, i) => (
                        <tr key={i} className="border-b border-border/50 last:border-0">
                          <td className="py-1.5 pr-4">{item.source}</td>
                          <td className={`py-1.5 text-right font-mono font-medium ${item.value > 0 ? 'text-green-400' : item.value < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
                            {item.value > 0 ? '+' : ''}{formatNumber(item.value, 2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-border">
                        <td className="pt-2 font-semibold">Total Happiness</td>
                        <td className={`pt-2 text-right font-mono font-bold text-base ${happinessResult.total >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {happinessResult.total > 0 ? '+' : ''}{formatNumber(happinessResult.total, 2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                  <p className="text-xs text-muted-foreground mt-3">
                    Note: Crime Index contribution uses a default prevention score of 435. See the Crime Index tab for your actual score.
                  </p>
                </CardContent>
              </Card>

              {happinessBreakdownData.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Happiness by Source</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={happinessBreakdownData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                          <XAxis type="number" tick={AXIS_TICK} />
                          <YAxis type="category" dataKey="source" tick={AXIS_TICK} width={160} />
                          <Tooltip {...TOOLTIP_STYLE} />
                          <Bar dataKey="value">
                            {happinessBreakdownData.map((entry, idx) => (
                              <Cell key={idx} fill={entry.value >= 0 ? CHART_THEME.positive : CHART_THEME.negative} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="crime" className="space-y-4 mt-4">
          {!isLoaded ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">No nation data loaded. Enter your nation data to see crime index information.</p>
              </CardContent>
            </Card>
          ) : (() => {
            const literacyRate = Math.min(20 + nation.tech * 0.1, 100);
            const crimeResult = calculateCrime({
              literacyRate,
              policeHQ: nation.improvements['Police Headquarters'] ?? 0,
              schools: nation.improvements['Schools'] ?? 0,
              universities: nation.improvements['Universities'] ?? 0,
              taxRate: nation.taxRate,
              infra: nation.infra,
              citizens: nation.citizens,
              jails: nation.improvements['Jails'] ?? 0,
              prisons: nation.improvements['Prisons'] ?? 0,
              rehabFacilities: nation.improvements['Rehabilitation Facilities'] ?? 0,
              government: nation.government,
              laborCamps: nation.improvements['Labor Camps'] ?? 0,
            });
            return (
              <>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Crime Index</CardTitle>
                    <CardDescription>Your crime prevention score determines the crime level, which affects upkeep costs and happiness.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      <div className="text-muted-foreground">Prevention Score</div>
                      <div className="font-mono font-medium">{formatNumber(crimeResult.preventionScore, 1)}</div>
                      <div className="text-muted-foreground">Crime Level</div>
                      <div className="font-medium">
                        <span className={
                          crimeResult.tier.index <= 1 ? 'text-green-400' :
                          crimeResult.tier.index <= 2 ? 'text-yellow-400' :
                          crimeResult.tier.index <= 4 ? 'text-orange-400' :
                          'text-red-400'
                        }>
                          {crimeResult.tier.label}
                        </span>
                        <span className="text-muted-foreground ml-2">(Index {crimeResult.tier.index})</span>
                      </div>
                      <div className="text-muted-foreground">Criminals</div>
                      <div className="font-mono">{formatNumber(crimeResult.criminals, 0)}</div>
                      <div className="text-muted-foreground">Incarcerated</div>
                      <div className="font-mono">{formatNumber(crimeResult.incarcerated, 0)}</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Effects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>
                      Happiness modifier:{' '}
                      <strong className={crimeResult.happinessEffect >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {crimeResult.happinessEffect > 0 ? '+' : ''}{formatNumber(crimeResult.happinessEffect, 1)}
                      </strong>
                    </p>
                    <p>
                      Upkeep modifier:{' '}
                      <strong className={crimeResult.upkeepModifier <= 0 ? 'text-green-400' : 'text-red-400'}>
                        {crimeResult.upkeepModifier > 0 ? '+' : ''}{(crimeResult.upkeepModifier * 100).toFixed(0)}%
                      </strong>
                    </p>
                    <p>
                      Criminal happiness penalty:{' '}
                      <strong className={crimeResult.criminalHappinessPenalty >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {crimeResult.criminalHappinessPenalty > 0 ? '+' : ''}{formatNumber(crimeResult.criminalHappinessPenalty, 2)}
                      </strong>
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Literacy rate approximated from tech: {formatNumber(literacyRate, 1)}%
                    </p>
                  </CardContent>
                </Card>
              </>
            );
          })()}
        </TabsContent>

        {/* Land Purchase Tab */}
        <TabsContent value="land" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Land Purchase</CardTitle>
              <CardDescription>Calculate land purchase costs. Land below your peak is 50% cheaper to rebuy.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <NumberInput
                  id="land-current"
                  label="Current Land"
                  value={landCurrent}
                  onChange={setLandCurrent}
                  min={0}
                />
                <NumberInput
                  id="land-buy"
                  label="Purchase Amount"
                  value={landBuy}
                  onChange={setLandBuy}
                  min={1}
                />
                <NumberInput
                  id="land-peak"
                  label={<><HelpTip term="Peak Land" variant="underline">Peak Land</HelpTip> (ever owned)</>}
                  value={peakLand}
                  onChange={setPeakLand}
                  min={0}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Land Cost Discount Resources</p>
                <ResourceCheckboxGrid
                  availableResources={LAND_RESOURCE_OPTIONS}
                  selected={landResources}
                  onChange={setLandResources}
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
                Total cost for <strong>{formatNumber(landBuy, 0)}</strong> acres:{' '}
                <strong>{formatCurrency(landResult.totalCost)}</strong>
              </p>
              <p>
                Cost per acre (at current land):{' '}
                <strong>{formatCurrency(landResult.costPerLevel)}</strong>
              </p>
              <p>
                Resource modifier:{' '}
                <strong>{((1 - landResult.modifier) * 100).toFixed(0)}% discount</strong>
                {' '}(multiplier: {landResult.modifier.toFixed(3)})
              </p>
              <p>
                Peak rebuy discount (50% off up to peak):{' '}
                <strong className={landResult.peakRebuyApplied ? 'text-green-400' : 'text-muted-foreground'}>
                  {landResult.peakRebuyApplied ? 'Applied' : 'Not applicable'}
                </strong>
              </p>
              {landResult.peakRebuyApplied && (
                <p className="text-xs text-muted-foreground">
                  Rebuy discount applies until you reach {formatNumber(peakLand, 0)} acres.
                </p>
              )}
            </CardContent>
          </Card>

          {landBuy > 0 && landChartData.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Cost Per Acre</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={landChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                      <XAxis dataKey="level" tick={AXIS_TICK} label={{ value: 'Land (acres)', position: 'insideBottom', offset: -2, fill: CHART_THEME.text, fontSize: 12 }} />
                      <YAxis tick={AXIS_TICK} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        {...TOOLTIP_STYLE}
                        formatter={(v: unknown, _name: unknown, props: { payload?: { inRebuy?: boolean } }) => {
                          const n = typeof v === 'number' ? v : 0;
                          return [`$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}${props.payload?.inRebuy ? ' (rebuy)' : ''}`, 'Cost/Acre'];
                        }}
                      />
                      <Area type="monotone" dataKey="cost" stroke={CHART_THEME.primary} fill={CHART_THEME.area1} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Warchest Tab */}
        <TabsContent value="warchest" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Warchest Calculator</CardTitle>
              <CardDescription>How long your cash reserves can sustain daily bills. Recommended minimum: 30 days of wartime bills.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <NumberInput
                  id="wc-cash"
                  label="Current Cash ($)"
                  value={wcCash}
                  onChange={setWcCash}
                  min={0}
                  step={1000}
                />
                <NumberInput
                  id="wc-income"
                  label="Daily Income ($)"
                  value={wcDailyIncome}
                  onChange={setWcDailyIncome}
                  min={0}
                  step={1000}
                />
                <NumberInput
                  id="wc-bills"
                  label="Daily Bills ($)"
                  value={wcDailyBills}
                  onChange={setWcDailyBills}
                  min={0}
                  step={1000}
                />
                <NumberInput
                  id="wc-war-upkeep"
                  label={<><HelpTip term="Upkeep" variant="underline">War Military Upkeep</HelpTip> ($)</>}
                  value={wcWarUpkeep}
                  onChange={setWcWarUpkeep}
                  min={0}
                  step={1000}
                />
              </div>
              {isLoaded && (
                <p className="text-xs text-muted-foreground">
                  Daily income pre-populated as income/citizen ({formatCurrency(nation.income)}) &times; citizens ({formatNumber(nation.citizens, 0)}).
                  Edit as needed.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Peacetime</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  <span className="text-muted-foreground">Daily net income</span>
                  <span className={`font-mono font-medium ${warchestResult.dailyNetIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {warchestResult.dailyNetIncome >= 0 ? '+' : ''}{formatCurrency(warchestResult.dailyNetIncome)}
                  </span>
                  <span className="text-muted-foreground">Days of bills (cash only)</span>
                  <span className="font-mono font-medium">
                    {isFinite(warchestResult.daysOfBillsSustainable)
                      ? formatNumber(warchestResult.daysOfBillsSustainable, 1)
                      : '∞'} days
                  </span>
                  <span className="text-muted-foreground">Days until broke</span>
                  <span className={`font-mono font-medium ${isFinite(warchestResult.daysUntilBroke) && warchestResult.daysUntilBroke < 30 ? 'text-red-400' : 'text-green-400'}`}>
                    {isFinite(warchestResult.daysUntilBroke)
                      ? `${formatNumber(warchestResult.daysUntilBroke, 1)} days`
                      : 'Never (net positive)'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Wartime</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  <span className="text-muted-foreground">War daily net</span>
                  <span className={`font-mono font-medium ${warchestResult.warDailyNet >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {warchestResult.warDailyNet >= 0 ? '+' : ''}{formatCurrency(warchestResult.warDailyNet)}
                  </span>
                  <span className="text-muted-foreground">War days sustainable</span>
                  <span className="font-mono font-medium">
                    {isFinite(warchestResult.warDaysOfBills)
                      ? formatNumber(warchestResult.warDaysOfBills, 1)
                      : '∞'} days
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                <span className="text-muted-foreground">Recommended warchest</span>
                <span className="font-mono font-medium">
                  {formatCurrency(warchestResult.recommendedWarchest)}
                </span>
                <span className="text-muted-foreground">(30 days of war bills)</span>
                <span className="text-muted-foreground text-xs">
                  {formatCurrency(wcDailyBills + wcWarUpkeep)}/day &times; 30
                </span>
                <span className="text-muted-foreground">Your cash</span>
                <span className={`font-mono font-bold text-base ${warchestColor}`}>
                  {formatCurrency(wcCash)}
                </span>
              </div>
              {warchestResult.recommendedWarchest > 0 && (
                <p className={`font-medium mt-1 ${warchestColor}`}>
                  {wcCash >= warchestResult.recommendedWarchest
                    ? `Fully funded — ${formatNumber((wcCash / warchestResult.recommendedWarchest) * 100, 0)}% of recommended warchest`
                    : wcCash >= warchestResult.recommendedWarchest * 0.5
                    ? `Partially funded — ${formatNumber((wcCash / warchestResult.recommendedWarchest) * 100, 0)}% of recommended warchest`
                    : `Under-funded — only ${formatNumber((wcCash / warchestResult.recommendedWarchest) * 100, 0)}% of recommended warchest`}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Cash Runway (60 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={warchestChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                    <XAxis dataKey="day" tick={AXIS_TICK} label={{ value: 'Days', position: 'insideBottom', offset: -2, fill: CHART_THEME.text, fontSize: 12 }} />
                    <YAxis tick={AXIS_TICK} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                    <Tooltip {...TOOLTIP_STYLE} formatter={(v: unknown, name: unknown) => { const n = typeof v === 'number' ? v : 0; return [`$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, String(name)]; }} />
                    <ReferenceLine y={0} stroke={CHART_THEME.negative} strokeDasharray="5 5" />
                    <Area type="monotone" dataKey="peacetime" stroke={CHART_THEME.primary} fill={CHART_THEME.area1} strokeWidth={2} name="Peacetime" />
                    <Area type="monotone" dataKey="wartime" stroke={CHART_THEME.secondary} fill={CHART_THEME.area2} strokeWidth={2} name="Wartime" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4 mt-4">
          {!isLoaded || !taxResult ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Load your nation data on the Home page to use the tax optimizer.
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Tax Rate Optimizer</CardTitle>
                  <CardDescription>Models the tradeoff between tax rate and happiness. Higher taxes collect more but reduce happiness, which lowers base citizen income.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Current Rate</span>
                      <p className="text-lg font-bold">{nation.taxRate}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Optimal Rate</span>
                      <p className="text-lg font-bold text-[#B92432]">{taxResult.optimalRate}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Income Difference</span>
                      <p className={`text-lg font-bold ${taxResult.optimalIncome > taxResult.currentIncome ? 'text-green-400' : taxResult.optimalIncome < taxResult.currentIncome ? 'text-red-400' : 'text-muted-foreground'}`}>
                        {taxResult.optimalIncome > taxResult.currentIncome ? '+' : ''}
                        {formatCurrency(taxResult.optimalIncome - taxResult.currentIncome)}/day
                      </p>
                    </div>
                  </div>

                  {taxResult.optimalRate === nation.taxRate ? (
                    <p className="text-sm text-green-400">Your current tax rate is already optimal.</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Changing from {nation.taxRate}% to {taxResult.optimalRate}% would
                      {taxResult.optimalIncome > taxResult.currentIncome ? ' increase' : ' change'} your daily income by{' '}
                      <span className="font-medium text-foreground">{formatCurrency(Math.abs(taxResult.optimalIncome - taxResult.currentIncome))}</span>/day.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Daily Income vs Tax Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={taxResult.curve}>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                        <XAxis
                          dataKey="taxRate"
                          tick={AXIS_TICK}
                          tickFormatter={(v) => `${v}%`}
                          label={{ value: 'Tax Rate', position: 'insideBottom', offset: -2, fill: CHART_THEME.text, fontSize: 12 }}
                        />
                        <YAxis
                          tick={AXIS_TICK}
                          tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                          {...TOOLTIP_STYLE}
                          labelFormatter={(v) => `Tax Rate: ${v}%`}
                          formatter={(v: unknown, name: unknown) => {
                            const n = typeof v === 'number' ? v : 0;
                            const labels: Record<string, string> = {
                              dailyNetIncome: 'Daily Income',
                            };
                            return [formatCurrency(n), labels[String(name)] ?? String(name)];
                          }}
                        />
                        <ReferenceLine
                          x={nation.taxRate}
                          stroke={CHART_THEME.secondary}
                          strokeDasharray="5 5"
                          label={{ value: `Current (${nation.taxRate}%)`, fill: CHART_THEME.text, fontSize: 10, position: 'top' }}
                        />
                        <ReferenceLine
                          x={taxResult.optimalRate}
                          stroke={CHART_THEME.primary}
                          strokeDasharray="3 3"
                          label={{ value: `Optimal (${taxResult.optimalRate}%)`, fill: CHART_THEME.primary, fontSize: 10, position: 'top' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="dailyNetIncome"
                          stroke={CHART_THEME.primary}
                          fill={CHART_THEME.area1}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Rate Comparison Table</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-2">Tax Rate</th>
                          <th className="text-right py-2 px-2">Happiness</th>
                          <th className="text-right py-2 px-2">Income/Citizen</th>
                          <th className="text-right py-2 px-2">Tax/Citizen</th>
                          <th className="text-right py-2 px-2">Daily Income</th>
                        </tr>
                      </thead>
                      <tbody>
                        {taxResult.curve.map((pt) => (
                          <tr
                            key={pt.taxRate}
                            className={`border-b border-border/50 ${
                              pt.taxRate === taxResult.optimalRate
                                ? 'bg-[rgba(185,36,50,0.1)] font-medium'
                                : pt.taxRate === nation.taxRate
                                ? 'bg-accent/50'
                                : ''
                            }`}
                          >
                            <td className="py-1.5 px-2">
                              {pt.taxRate}%
                              {pt.taxRate === taxResult.optimalRate && (
                                <span className="ml-1 text-[10px] text-[#B92432] uppercase font-bold">Best</span>
                              )}
                              {pt.taxRate === nation.taxRate && pt.taxRate !== taxResult.optimalRate && (
                                <span className="ml-1 text-[10px] text-muted-foreground uppercase">Current</span>
                              )}
                            </td>
                            <td className="text-right py-1.5 px-2">{formatNumber(pt.happiness, 1)}</td>
                            <td className="text-right py-1.5 px-2">{formatCurrency(pt.perCitizenIncome)}</td>
                            <td className="text-right py-1.5 px-2">{formatCurrency(pt.taxPerCitizen)}</td>
                            <td className="text-right py-1.5 px-2 font-mono">{formatCurrency(pt.dailyNetIncome)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
