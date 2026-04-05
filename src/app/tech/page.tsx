'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNationData } from '@/hooks/useNationData';
import { calculateTechCost } from '@/lib/calculators/tech';
import { NumberInput } from '@/components/shared/NumberInput';
import { ResourceCheckboxGrid } from '@/components/shared/ResourceCheckboxGrid';
import { formatCurrency, formatNumber } from '@/components/shared/CurrencyDisplay';
import { TECH_MODIFIERS } from '@/lib/data/resources';

const TECH_RESOURCE_OPTIONS = Object.entries(TECH_MODIFIERS).map(([key, mod]) => ({
  key,
  label: `${mod.name} (-${(mod.value * 100).toFixed(0)}%)`,
}));

export default function TechPage() {
  const { nation, isLoaded, allResources } = useNationData();

  const [currentTech, setCurrentTech] = useState(isLoaded ? nation.tech : 0);
  const [purchaseAmount, setPurchaseAmount] = useState(10);
  const [universities, setUniversities] = useState(
    isLoaded ? (nation.improvements['Universities'] ?? 0) : 0
  );
  const [techResources, setTechResources] = useState<string[]>(
    isLoaded ? allResources.filter((r) => r in TECH_MODIFIERS) : []
  );

  const result = useMemo(
    () =>
      calculateTechCost({
        currentTech,
        purchaseAmount,
        universities,
        activeResources: techResources,
      }),
    [currentTech, purchaseAmount, universities, techResources]
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Technology Calculator</h1>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Technology Purchase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <NumberInput
              id="tech-have"
              label="Current Tech Level"
              value={currentTech}
              onChange={setCurrentTech}
              min={0}
            />
            <NumberInput
              id="tech-wanted"
              label="Levels to Buy"
              value={purchaseAmount}
              onChange={setPurchaseAmount}
              min={0}
            />
            <NumberInput
              id="universities"
              label="Universities"
              value={universities}
              onChange={setUniversities}
              min={0}
              max={2}
            />
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Tech Cost Reduction Resources
            </p>
            <ResourceCheckboxGrid
              availableResources={TECH_RESOURCE_OPTIONS}
              selected={techResources}
              onChange={setTechResources}
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
            Cost per level at current tech:{' '}
            <strong>{formatCurrency(result.costPerLevel)}</strong>
          </p>
          <p>
            Total cost for <strong>{formatNumber(purchaseAmount)}</strong>{' '}
            levels: <strong>{formatCurrency(result.totalCost)}</strong>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Modifier: {(result.modifier * 100).toFixed(2)}% (includes 1.5x
            multiplier in total)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
