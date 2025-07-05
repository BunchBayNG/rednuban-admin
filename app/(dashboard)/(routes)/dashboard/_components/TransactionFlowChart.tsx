'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartPoint {
  period: string;
  value: number;
}

const periods = [
  { label: '1D', value: 'daily', range: 1 },
  { label: '1W', value: 'weekly', range: 7 },
  { label: '1M', value: 'monthly', range: 30 },
  { label: '1Y', value: 'monthly', range: 365 },
  { label: 'Max', value: 'yearly', range: 1500 },
];

export function TransactionFlowChart() {
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState(periods[3]); // default to 1Y
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - selectedPeriod.range);

    const start = startDate.toISOString();
    const end = endDate.toISOString();

    try {
      const res = await fetch(
        `/api/analytics/transactions/successful-volume-chart?startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}&period=${selectedPeriod.value}`
      );
      const result = await res.json();

      if (res.ok && result.status && Array.isArray(result.data)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatted = result.data.map((point: any) => ({
          period: point.period,
          value: point.value,
        }));
        setChartData(formatted);
        setTotal(formatted.reduce((sum: number, item: ChartPoint) => sum + item.value, 0));
      } else {
        throw new Error(result.message || 'Unexpected API response');
      }
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message || 'Failed to fetch data');
      setChartData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedPeriod]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
          Transaction Success Volume Chart
          </CardTitle>
          <div className="flex gap-2">
            {periods.map((period) => (
              <Badge
                key={period.label}
                variant={period.label === selectedPeriod.label ? 'default' : 'outline'}
                className="text-xs cursor-pointer"
                onClick={() => setSelectedPeriod(period)}
              >
                {period.label}
              </Badge>
            ))}
          </div>
        </div>
        <div className="text-xl font-medium text-foreground">
          ₦{total.toLocaleString()}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-sm text-muted-foreground">Loading chart...</div>
        ) : error ? (
          <div className="text-center text-sm text-red-500">{error}</div>
        ) : chartData.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground">
            No data available for the selected period.
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="20%">
                <XAxis
                  dataKey="period"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Transactions']}
                  labelFormatter={(label) => `Period: ${label}`}
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                  }}
                />
                <Bar dataKey="value" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
