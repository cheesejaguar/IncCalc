'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNationData } from '@/hooks/useNationData';
import { calculateInfraCost } from '@/lib/calculators/infrastructure';
import { calculatePopulation, infraNeededForCitizens } from '@/lib/calculators/population';
import { calculateUpkeep } from '@/lib/calculators/upkeep';
import { NumberInput } from '@/components/shared/NumberInput';
import { ResourceCheckboxGrid } from '@/components/shared/ResourceCheckboxGrid';
import { formatCurrency, formatNumber, DeltaValue } from '@/components/shared/CurrencyDisplay';
import { INFRA_MODIFIERS, POPULATION_MODIFIERS } from '@/lib/data/resources';

const INFRA_RESOURCE_OPTIONS = Object.entries(INFRA_MODIFIERS).map(([key, mod]) => ({
  key,
  label: `${mod.name} (-${(mod.value * 100).toFixed(0)}%)`,
}));

const POP_RESOURCE_OPTIONS = Object.entries(POPULATION_MODIFIERS).map(([key, mod]) => ({
  key,
  label: `${mod.name} (+${(mod.value * 100).toFixed(1)}%)`,
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

  // Calculate results
  const infraResult = useMemo(
    () =>
      calculateInfraCost({
        currentInfra: infraHave,
        purchaseAmount: Math.min(infraWanted, 5000),
        factories,
        activeResources: infraResources,
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
      }),
    [infraHave, infraWanted, tech, ns, laborCamps, infraResources]
  );

  // ROI calculation
  const dailyIncomeGain = popResult.citizensGained * income;
  const roi =
    dailyIncomeGain - upkeepResult.billIncrease > 0
      ? infraResult.totalCost / (dailyIncomeGain - upkeepResult.billIncrease)
      : -1;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Economy Calculator</h1>

      <Tabs defaultValue="infra">
        <TabsList>
          <TabsTrigger value="infra">Infrastructure</TabsTrigger>
          <TabsTrigger value="population">Population</TabsTrigger>
        </TabsList>

        <TabsContent value="infra" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Infrastructure Purchase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <NumberInput id="infra-have" label="Current Infra" value={infraHave} onChange={setInfraHave} min={0} />
                <NumberInput id="infra-wanted" label="Amount to Buy" value={infraWanted} onChange={(v) => setInfraWanted(Math.min(v, 5000))} min={0} max={5000} />
                <NumberInput id="factories" label="Factories" value={factories} onChange={setFactories} min={0} max={5} />
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
        </TabsContent>

        <TabsContent value="population" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Population Growth</CardTitle>
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
      </Tabs>
    </div>
  );
}
