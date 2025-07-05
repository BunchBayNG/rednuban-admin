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

interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'positive' | 'negative';
  period: string;
}

interface MetricCardProps {
  metric: DashboardMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const [period, setPeriod] = useState(metric.period);
  const [value, setValue] = useState(metric.value);
  const [change, setChange] = useState(metric.change);
  const [changeType, setChangeType] = useState(metric.changeType);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDateRange = (selectedPeriod: string) => {
    let endDate = new Date();
    let startDate = new Date();

    switch (selectedPeriod) {
      case "Last 7 days":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "Last 30 days":
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "Last 90 days":
        startDate.setDate(endDate.getDate() - 90);
        break;
      case "This month":
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      case "Last month":
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  };

  const fetchTotalVnubans = async (
    startDate: string,
    endDate: string,
    isPreviousPeriod: boolean = false
  ) => {
    try {
      let adjustedStartDate = startDate;
      let adjustedEndDate = endDate;

      if (isPreviousPeriod) {
        const currentStart = new Date(startDate);
        const currentEnd = new Date(endDate);
        const duration = currentEnd.getTime() - currentStart.getTime();

        const previousEnd = new Date(currentStart.getTime() - 86400000); // -1 day
        const previousStart = new Date(previousEnd.getTime() - duration);

        adjustedStartDate = previousStart.toISOString().split("T")[0];
        adjustedEndDate = previousEnd.toISOString().split("T")[0];

        if (previousStart < new Date("2020-01-01")) {
          throw new Error("Previous period too old");
        }
      }

      const query = new URLSearchParams({ startDate: adjustedStartDate, endDate: adjustedEndDate });
      const url = `/api/analytics/vnuban/total?${query}`;

      const response = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } });
      const data = await response.json();

      if (response.ok && data.status && typeof data.data === "number") {
        return data.data;
      } else {
        throw new Error(data.message || "Failed to fetch total vNUBAN");
      }
    } catch (err) {
      console.error("Error in fetchTotalVnubans:", err);
      throw err;
    }
  };

  const fetchTotalMerchants = async (
    startDate: string,
    endDate: string,
    isPreviousPeriod: boolean = false
  ) => {
    try {
      let adjustedStartDate = startDate;
      let adjustedEndDate = endDate;

      if (isPreviousPeriod) {
        const currentStart = new Date(startDate);
        const currentEnd = new Date(endDate);
        const duration = currentEnd.getTime() - currentStart.getTime();

        const previousEnd = new Date(currentStart.getTime() - 86400000);
        const previousStart = new Date(previousEnd.getTime() - duration);

        adjustedStartDate = previousStart.toISOString().split("T")[0];
        adjustedEndDate = previousEnd.toISOString().split("T")[0];

        if (previousStart < new Date("2020-01-01")) {
          throw new Error("Previous period too old");
        }
      }

      const query = new URLSearchParams({ startDate: adjustedStartDate, endDate: adjustedEndDate });
      const url = `/api/analytics/merchants/total?${query}`;

      const response = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } });
      const data = await response.json();

      if (response.ok && data.status && typeof data.data === "number") {
        return data.data;
      } else {
        throw new Error(data.message || "Failed to fetch total merchants");
      }
    } catch (err) {
      console.error("Error in fetchTotalMerchants:", err);
      throw err;
    }
  };

  useEffect(() => {
    const supportedMetrics = ["total-vnubans", "total-merchants"];

    if (!supportedMetrics.includes(metric.id)) {
      setValue(metric.value);
      setChange(metric.change);
      setChangeType(metric.changeType);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { startDate, endDate } = getDateRange(period);

        let currentTotal = 0;
        let previousTotal = 0;

        if (metric.id === "total-vnubans") {
          currentTotal = await fetchTotalVnubans(startDate, endDate);
          previousTotal = await fetchTotalVnubans(startDate, endDate, true);
        } else if (metric.id === "total-merchants") {
          currentTotal = await fetchTotalMerchants(startDate, endDate);
          previousTotal = await fetchTotalMerchants(startDate, endDate, true);
        }

        const formattedValue = currentTotal.toLocaleString();
        const changePercent = previousTotal ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;
        const roundedChange = Math.round(Math.abs(changePercent) * 10) / 10;
        const newChangeType = changePercent >= 0 ? "positive" : "negative";

        setValue(formattedValue);
        setChange(roundedChange);
        setChangeType(newChangeType);
      } catch (err) {
        setError("Failed to load metric");
        setValue("0");
        setChange(0);
        setChangeType("positive");
        console.log(err);
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
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
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
