"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceDot,
} from "recharts";

interface ChartDataPoint {
  month: string;
  value: number;
}

export function MerchantsChart() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("1Y");
  const [retryCount, setRetryCount] = useState(0);

const getDateRange = (filter: string) => {
  const today = new Date("2025-07-05");
  let startDate: Date;
  let endDate = new Date(today); // always cap at today
  let period: string;

  switch (filter) {
    case "1D":
      period = "daily";
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 1);
      break;
    case "1W":
      period = "daily";
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "1M":
      period = "daily";
      startDate = new Date(today);
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case "1Y":
      period = retryCount === 1 ? "month" : "monthly";
      startDate = new Date("2024-06-01");
      endDate = new Date("2025-06-30");
      break;
    case "Max":
      period = "yearly";
      startDate = new Date("2020-01-01");
      break;
    default:
      period = "monthly";
      startDate = new Date("2024-06-01");
      endDate = new Date("2025-06-30");
  }

  // Ensure startDate is not before 2020-01-01
  const minStart = new Date("2020-01-01");
  if (startDate < minStart) startDate = minStart;

  // Format as YYYY-MM-DD (string)
  const format = (d: Date) => d.toISOString().split("T")[0];

  return {
    period,
    startDate: format(startDate),
    endDate: format(endDate),
  };
};


  useEffect(() => {
    async function fetchChartData() {
      setLoading(true);
      setError(null);

      const { period, startDate, endDate } = getDateRange(activeFilter);
      const url = `/api/analytics/vnuban/generated-chart?period=${encodeURIComponent(
        period
      )}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;

      console.log("📡 Fetching vNUBAN chart from:", url);

      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const contentType = res.headers.get("Content-Type");

        if (!res.ok) {
          throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
        }

        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          console.log("✅ Fetched vNUBAN chart:", data);

          if (data.status && Array.isArray(data.data)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formattedData = data.data.map((item: any) => ({
              month: item.period,
              value: item.value,
            }));

            setChartData(formattedData);
            setTotal(
              formattedData.reduce(
                (sum: number, item: ChartDataPoint) => sum + item.value,
                0
              )
            );
            setRetryCount(0);
          } else if (res.status === 404 && retryCount < 1) {
            console.log("🔁 Retrying with alternate period format: 'month'");
            setRetryCount(retryCount + 1);
          } else {
            throw new Error("Unexpected API response");
          }
        } else {
          const text = await res.text();
          console.error("❌ Non-JSON response:", text);
          throw new Error("Unexpected non-JSON response from API");
        }
      }         // eslint-disable-next-line @typescript-eslint/no-explicit-any
      catch (err: any) {
        console.error("❌ Error fetching vNUBAN chart:", err);
        setError("Failed to load vNUBAN data");
      } finally {
        setLoading(false);
      }
    }

    fetchChartData();
  }, [activeFilter, retryCount]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setRetryCount(0);
  };

  const highlightedPoint = chartData.reduce(
    (max: ChartDataPoint | null, point: ChartDataPoint) =>
      max && max.value > point.value ? max : point,
    null
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            vNUBAN Generated Chart
          </CardTitle>
          <div className="flex gap-2">
            {["1D", "1W", "1M", "1Y", "Max"].map((filter) => (
              <Badge
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                className="text-xs cursor-pointer"
                onClick={() => handleFilterChange(filter)}
              >
                {filter}
              </Badge>
            ))}
          </div>
        </div>
        <div className="text-xl font-medium">
          {loading ? "Loading..." : total.toLocaleString()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {loading ? (
            <div className="text-center text-sm text-muted-foreground">Loading chart...</div>
          ) : error ? (
            <div className="text-center text-sm text-red-500">{error}</div>
          ) : chartData.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip
                  formatter={(value: number) => [value.toLocaleString(), "Merchants"]}
                  labelFormatter={(label) => `Period: ${label}`}
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "6px",
                    color: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#dc2626" }}
                />
                {highlightedPoint && (
                  <ReferenceDot
                    x={highlightedPoint.month}
                    y={highlightedPoint.value}
                    r={4}
                    fill="#dc2626"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
