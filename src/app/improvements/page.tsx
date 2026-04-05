'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNationData } from '@/hooks/useNationData';
import { calculateImprovementAnalysis } from '@/lib/calculators/improvement-advisor';
import { calculateUpkeep } from '@/lib/calculators/upkeep';
import { getInfraUnitCost } from '@/lib/calculators/infrastructure';
import { formatCurrency, formatNumber } from '@/components/shared/CurrencyDisplay';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ImprovementsPage() {
  const { nation, isLoaded, allResources } = useNationData();

  const analysis = useMemo(() => {
    if (!isLoaded) return null;

    const netIncome = nation.citizens * nation.income;
    const taxRate = nation.taxRate / 100;

    // Calculate upkeep bill
    const upkeepResult = calculateUpkeep({
      currentInfra: nation.infra,
      purchaseAmount: 0,
      tech: nation.tech,
      nationStrength: nation.nationStrength,
      laborCamps: nation.improvements['Labor Camps'] ?? 0,
      activeResources: allResources,
    });

    const infraCostPerUnit = getInfraUnitCost(
      nation.infra,
      nation.improvements['Factories'] ?? 0,
      allResources
    );

    return calculateImprovementAnalysis({
      citizenCount: nation.citizens,
      citizenIncome: nation.income,
      netIncome,
      happiness: nation.happiness,
      tech: nation.tech,
      taxRate,
      infraUpkeepBill: upkeepResult.totalBillBefore,
      infraCostPerUnit,
      improvements: nation.improvements,
    });
  }, [nation, isLoaded, allResources]);

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Improvement Advisor</h1>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Load your nation data on the Home page to use the Improvement Advisor.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Improvement Advisor</h1>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Improvement Analysis</CardTitle>
          <CardDescription>
            Which improvement will generate the most cash or largest infra purchase capability.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Improvement</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">Income Change</TableHead>
                <TableHead className="text-right">ROI</TableHead>
                <TableHead className="text-right">Infra/Day</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysis?.map((imp) => (
                <TableRow key={imp.name}>
                  <TableCell className="font-medium">{imp.name}</TableCell>
                  <TableCell className="text-right">{imp.currentCount}</TableCell>
                  <TableCell className="text-right">
                    {imp.canPurchase && imp.incomeChange !== 0 ? (
                      <span
                        className={
                          imp.incomeChange > 0 ? 'text-green-400' : 'text-red-400'
                        }
                      >
                        {formatCurrency(imp.incomeChange)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {formatCurrency(0)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{imp.roi}</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(imp.infraPerDay, 2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 text-xs text-muted-foreground space-y-1">
            <p>1. Income changes reflect NET change (including $5,000/day upkeep for the improvement).</p>
            <p>2. ROI shows &quot;N/A&quot; where you cannot purchase more of that improvement.</p>
            <p>3. Infra/day is approximate: gross income / current infra cost.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
