'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNationData } from '@/hooks/useNationData';
import { calculateWonderProjections } from '@/lib/calculators/wonder-advisor';
import { formatCurrency, formatNumber } from '@/components/shared/CurrencyDisplay';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function WondersPage() {
  const { nation, isLoaded } = useNationData();

  const projections = useMemo(() => {
    if (!isLoaded) return null;

    const netIncome = nation.citizens * nation.income;

    return calculateWonderProjections({
      citizenCount: nation.citizens,
      citizenIncome: nation.income,
      netIncome,
      happiness: nation.happiness,
      tech: nation.tech,
      taxRate: nation.taxRate / 100,
      nationStrength: nation.nationStrength,
      banks: nation.improvements['Banks'] ?? 0,
      foreignMinistries: nation.improvements['Foreign Ministries'] ?? 0,
      guerillaCamps: nation.improvements['Guerilla Camps'] ?? 0,
      harbors: nation.improvements['Harbors'] ?? 0,
      schools: nation.improvements['Schools'] ?? 0,
      universities: nation.improvements['Universities'] ?? 0,
      ownedWonders: nation.wonders,
    });
  }, [nation, isLoaded]);

  const best = projections?.find((p) => p.isBest);
  const netIncome = nation.citizens * nation.income;

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Wonder Advisor</h1>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Load your nation data on the Home page to use the Wonder Advisor.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Wonder Advisor</h1>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Wonder Projections</CardTitle>
          <CardDescription>
            Comparative benefits of each wonder based on your current nation data. Costs are not factored into the recommendation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Wonder</TableHead>
                <TableHead className="text-right">Projected Income</TableHead>
                <TableHead className="text-right">Days to ROI</TableHead>
                <TableHead className="text-right">Suggested</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projections?.map((wonder) => (
                <TableRow key={wonder.name}>
                  <TableCell className="font-medium">{wonder.name}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(wonder.projectedIncome)}
                  </TableCell>
                  <TableCell className="text-right">
                    {wonder.owned
                      ? '-'
                      : wonder.daysToROI > 0
                        ? formatNumber(wonder.daysToROI, 0)
                        : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {wonder.owned ? (
                      <span className="italic text-muted-foreground">Owned</span>
                    ) : wonder.isBest ? (
                      <span className="font-bold text-green-400">Best</span>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {best && (
            <div className="mt-4 p-3 rounded-md bg-green-950/30 border border-green-900/50 text-sm">
              We recommend purchasing the <strong>{best.name}</strong> wonder.
              This will increase your income from {formatCurrency(netIncome)} to{' '}
              {formatCurrency(best.projectedIncome)}, an increase of{' '}
              <strong className="text-green-400">
                {formatCurrency(best.incomeGain)}
              </strong>.
            </div>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            Note: The interstate system provides infrastructure savings rather than income. High-infrastructure nations may benefit more from Social Security System.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
