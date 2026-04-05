'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNationData } from '@/hooks/useNationData';
import { parseNationText } from '@/lib/nation-parser';
import { formatCurrency, formatNumber } from '@/components/shared/CurrencyDisplay';

export default function HomePage() {
  const { nation, isLoaded, setNation, clearNation } = useNationData();
  const [pasteText, setPasteText] = useState('');
  const [parseError, setParseError] = useState('');

  const handleParse = () => {
    try {
      const parsed = parseNationText(pasteText);
      if (!parsed.infra && !parsed.citizens && !parsed.tech) {
        setParseError('Could not parse nation data. Make sure you copied the full "View My Nation" page.');
        return;
      }
      setNation(parsed);
      setPasteText('');
      setParseError('');
    } catch {
      setParseError('Failed to parse the pasted text. Please check the format.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-wide uppercase">
          <span className="border-b-2 border-[#B92432] pb-0.5">IncCalc</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Nation optimization calculator for Cybernations. Load your nation data to get started.
        </p>
      </div>

      {isLoaded && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Loaded Nation Data</CardTitle>
              <Button variant="outline" size="sm" onClick={clearNation}>
                Clear Data
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-2 text-sm">
              {nation.government && (
                <Stat label="Government" value={nation.government} />
              )}
              <Stat label="Infrastructure" value={formatNumber(nation.infra, 2)} />
              <Stat label="Technology" value={formatNumber(nation.tech, 2)} />
              <Stat label="Land" value={formatNumber(nation.land, 2)} />
              <Stat label="Citizens" value={formatNumber(nation.citizens)} />
              <Stat label="Income/Citizen" value={formatCurrency(nation.income)} />
              <Stat label="Tax Rate" value={`${nation.taxRate}%`} />
              <Stat label="Happiness" value={formatNumber(nation.happiness, 2)} />
              <Stat label="Nation Strength" value={formatNumber(nation.nationStrength, 2)} />
              <Stat label="Soldiers" value={formatNumber(nation.soldiers)} />
              <Stat label="Tanks" value={formatNumber(nation.tanks)} />
              <Stat label="Spies" value={formatNumber(nation.spies)} />
              <Stat label="Cash" value={formatCurrency(nation.cash)} />
              <Stat label="DEFCON" value={String(nation.defcon)} />
            </div>

            {nation.connectedResources.length > 0 && (
              <>
                <Separator className="my-3" />
                <div className="text-sm">
                  <span className="text-muted-foreground">Resources: </span>
                  {nation.connectedResources.join(', ')}
                </div>
              </>
            )}
            {nation.bonusResources.length > 0 && (
              <div className="text-sm mt-1">
                <span className="text-muted-foreground">Bonuses: </span>
                {nation.bonusResources.join(', ')}
              </div>
            )}
            {Object.keys(nation.improvements).length > 0 && (
              <div className="text-sm mt-1">
                <span className="text-muted-foreground">Improvements: </span>
                {Object.entries(nation.improvements)
                  .map(([name, count]) => `${name}: ${count}`)
                  .join(', ')}
              </div>
            )}
            {nation.wonders.length > 0 && (
              <div className="text-sm mt-1">
                <span className="text-muted-foreground">Wonders: </span>
                {nation.wonders.join(', ')}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Load Nation Data</CardTitle>
          <CardDescription>
            Copy your entire &quot;View My Nation&quot; page from Cybernations and paste it below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste your View My Nation page text here..."
            className="w-full h-48 rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
          />
          {parseError && (
            <p className="text-sm text-red-400">{parseError}</p>
          )}
          <Button onClick={handleParse} disabled={!pasteText.trim()}>
            Parse Nation Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-muted-foreground">{label}: </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
