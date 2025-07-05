"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = {
  success: "#22c55e",
  failure: "#ef4444",
};

interface ChartData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export function PayoutStatusChart() {
  const [chartData, setChartData] = useState<ChartData[] | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDateRange = () => ({
    startDate: "2024-06-01",
    endDate: "2025-06-30",
  });

  useEffect(() => {
    async function fetchPayoutData() {
      setLoading(true);
      setError(null);
  
      const { startDate, endDate } = getDateRange();
      console.log("Client-side: Fetching payout count summary with:", {
        startDate,
        endDate,
      });
  
      try {
        const response = await fetch(
          `/api/analytics/payouts/count-summary?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        const result = await response.json();
        console.log("Client-side: Payout count summary response:", {
          status: response.status,
          body: JSON.stringify(result, null, 2),
        });
  
        if (response.ok && result.status && result.data) {
          const { success, failed, total } = result.data;
  
          const totalNonZero = total || success + failed || 1;
          const successRate = (success / totalNonZero) * 100;
          const failureRate = (failed / totalNonZero) * 100;
  
          setChartData([
            { name: "Success", value: success, percentage: successRate, color: COLORS.success },
            { name: "Failure", value: failed, percentage: failureRate, color: COLORS.failure },
          ]);
          setTotal(total);
        } else {
          throw new Error(result.message || "Unexpected API response");
        }
      } catch (err) {
        console.error("Client-side: Fetch error:", {
          error: err,
          message: err instanceof Error ? err.message : "Unknown error",
          stack: err instanceof Error ? err.stack : "Unknown stack",
        });
        setError(err instanceof Error ? err.message : "Failed to load payout data");
        setChartData(null);
        setTotal(null);
      } finally {
        setLoading(false);
      }
    }
  
    fetchPayoutData();
  }, []);
  

  return (
    <Card className="rounded-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Payout Status Rate (Success vs Failures)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-sm text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-sm text-red-500">{error}</div>
        ) : chartData && total !== null ? (
          <div className="flex items-center space-x-8">
            {/* Chart */}
            <div className="relative h-32 w-32 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    startAngle={90}
                    endAngle={450}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold">{total.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Success Rate</span>
                </div>
                <span className="text-sm">{chartData[0].percentage.toFixed(2)}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Failure Rate</span>
                </div>
                <span className="text-sm">{chartData[1].percentage.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-red-500">No data available</div>
        )}
      </CardContent>
    </Card>
  );
}