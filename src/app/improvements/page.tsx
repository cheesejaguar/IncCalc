'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNationData } from '@/hooks/useNationData';
import { calculateImprovementAnalysis } from '@/lib/calculators/improvement-advisor';
import { calculateUpkeep } from '@/lib/calculators/upkeep';
import { getInfraUnitCost } from '@/lib/calculators/infrastructure';
import { formatCurrency, formatNumber } from '@/components/shared/CurrencyDisplay';
import { HelpTip } from '@/components/shared/HelpTip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CHART_THEME, TOOLTIP_STYLE, AXIS_TICK } from '@/lib/chart-theme';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

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

  const chartData = useMemo(() => {
    if (!analysis) return [];
    return analysis
      .filter((imp) => imp.canPurchase && imp.incomeChange !== 0)
      .sort((a, b) => b.incomeChange - a.incomeChange)
      .map((imp) => ({ name: imp.name, incomeChange: imp.incomeChange }));
  }, [analysis]);

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
            Compare improvement ROI — which purchase generates the most income per day after $5,000 daily upkeep. Gray rows cannot be purchased (max count reached or missing prerequisites).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Improvement</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">Income Change</TableHead>
                <TableHead className="text-right">
                  ROI <HelpTip term="ROI" />
                </TableHead>
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

      {chartData.length > 0 && (
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Income Impact by Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: Math.max(200, chartData.length * 28) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                  <XAxis type="number" tick={AXIS_TICK} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" tick={AXIS_TICK} width={140} />
                  <Tooltip {...TOOLTIP_STYLE} formatter={(v) => { const n = Number(v); return isNaN(n) ? ['—', 'Income Change'] : [`$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}/day`, 'Income Change']; }} />
                  <Bar dataKey="incomeChange" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.incomeChange >= 0 ? CHART_THEME.positive : CHART_THEME.negative} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
