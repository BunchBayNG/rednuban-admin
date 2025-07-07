"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, ExternalLink, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

const formatDate = (date: Date) => date.toISOString().split("T")[0];
const MIN_DATE = new Date("2020-01-01");
// Use current date for MAX_DATE
const MAX_DATE = new Date();

interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: "positive" | "negative";
  period: string;
}

interface MetricCardProps {
  metric: DashboardMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const [period, setPeriod] = useState(metric.period);
  const [value, setValue] = useState<string | number>(metric.value);
  const [change, setChange] = useState<number>(metric.change);
  const [changeType, setChangeType] = useState<"positive" | "negative">(metric.changeType);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Always use current date for MAX_DATE calculation
  const getDateRange = (selectedPeriod: string) => {
    let endDate = new Date();
    let startDate = new Date(endDate);

    switch (selectedPeriod) {
      case "Last 7 days":
        startDate.setDate(endDate.getDate() - 6); // includes today!
        break;
      case "Last 30 days":
        startDate.setDate(endDate.getDate() - 29);
        break;
      case "Last 90 days":
        startDate.setDate(endDate.getDate() - 89);
        break;
      case "This month":
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      case "Last month":
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        break;
      default:
        startDate.setDate(endDate.getDate() - 29);
    }

    if (startDate < MIN_DATE) startDate = new Date(MIN_DATE);

    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  };

  // Calculates previous period directly before the current period
  const adjustPreviousPeriod = (start: string, end: string) => {
    const currentStart = new Date(start);
    const currentEnd = new Date(end);
    const duration = currentEnd.getTime() - currentStart.getTime() + 86400000; // +1 day to include end date

    let previousEnd = new Date(currentStart.getTime() - 86400000); // previous day before currentStart
    let previousStart = new Date(previousEnd.getTime() - duration + 86400000); // maintain the same duration

    if (previousStart < MIN_DATE) previousStart = new Date(MIN_DATE);
    if (previousEnd > MAX_DATE) previousEnd = new Date(MAX_DATE);

    return {
      startDate: formatDate(previousStart),
      endDate: formatDate(previousEnd),
    };
  };

  const fetchMetric = async (
    endpoint: string,
    startDate: string,
    endDate: string
  ) => {
    const query = new URLSearchParams({ startDate, endDate });
    const url = `${endpoint}?${query.toString()}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    // Accept both number and string, as some APIs might return formatted string
    if (res.ok && data.status && (typeof data.data === "number" || typeof data.data === "string")) {
      return data.data;
    } else {
      throw new Error(data.message || `Failed to fetch metric from ${endpoint}`);
    }
  };

  useEffect(() => {
    const supported = {
      "total-vnubans": "/api/analytics/vnuban/total",
      "total-merchants": "/api/analytics/merchants/total",
      "virtual-transaction-flow": "/api/analytics/transactions/successful-volume",
      "virtual-transaction-inflow": "/api/analytics/vnuban/total-static",
      "pending-notifications": "/api/analytics/vnuban/total-dynamic",
      "successful-amount": "/api/analytics/settlements/successful-volume",
      "payouts-processed": "/api/analytics/payouts/successful-volume",
      "distinctive-vnubans": "/api/analytics/merchants/total",
    };

    if (!Object.keys(supported).includes(metric.id)) {
      setValue(metric.value);
      setChange(metric.change);
      setChangeType(metric.changeType);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { startDate, endDate } = getDateRange(period);
        const { startDate: prevStart, endDate: prevEnd } = adjustPreviousPeriod(
          startDate,
          endDate
        );

        const url = supported[metric.id as keyof typeof supported];
        // Always use current response data for value
        const current = await fetchMetric(url, startDate, endDate);
        const previous = await fetchMetric(url, prevStart, prevEnd);

        // If backend returns the display string, just show it. Else, format as currency or number.
        let formattedValue: string;
        if (typeof current === "string") {
          formattedValue = current;
        } else if (["virtual-transaction-flow", "successful-amount", "payouts-processed"].includes(metric.id)) {
          formattedValue = `₦${current.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
        } else {
          formattedValue = current.toLocaleString("en-NG");
        }

        const changePercent =
          previous && Number(previous) !== 0
            ? ((Number(current) - Number(previous)) / Math.abs(Number(previous))) * 100
            : 0;

        setValue(formattedValue);
        setChange(Math.round(Math.abs(changePercent) * 10) / 10);
        setChangeType(changePercent >= 0 ? "positive" : "negative");
      } catch (err) {
        console.error("Client-side: Fetch error:", err);
        setError("Failed to load metric");
        setValue("₦0.00");
        setChange(0);
        setChangeType("positive");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [metric.id, period]);

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          {metric.title}
          <ExternalLink className="h-3 w-3 text-muted-foreground/50" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="text-xl font-medium flex items-center">
            <Loader2 className="h-5 w-5 animate-spin mr-2 text-red-500" />
          </div>
        ) : error ? (
          <div className="text-xl font-medium text-red-500">{error}</div>
        ) : (
          <div className="text-xl font-medium">
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
        )}
        <div className="flex items-center justify-between">
          <Badge
            variant={changeType === "positive" ? "default" : "destructive"}
            className={`text-xs rounded-full ${
              changeType === "positive"
                ? "bg-green-100 text-green-700 hover:bg-green-100"
                : "bg-red-100 text-red-700 hover:bg-red-100"
            }`}
          >
            {changeType === "positive" ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {changeType === "positive" ? "+" : ""}
            {change}%
          </Badge>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="text-xs text-muted-foreground border-0">
              <SelectValue placeholder={period} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Last 7 days">Last 7 days</SelectItem>
              <SelectItem value="Last 30 days">Last 30 days</SelectItem>
              <SelectItem value="Last 90 days">Last 90 days</SelectItem>
              <SelectItem value="This month">This month</SelectItem>
              <SelectItem value="Last month">Last month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}