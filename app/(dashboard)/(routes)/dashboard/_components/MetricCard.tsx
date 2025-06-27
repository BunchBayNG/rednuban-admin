
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { DashboardMetric } from "@/lib/MockData";

interface MetricCardProps {
  metric: DashboardMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const [period, setPeriod] = useState(metric.period); // Initialize with the default period
  const isPositive = metric.changeType === "positive";

  return (
    <Card className="relative ">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          {metric.title}
          <ExternalLink className="h-3 w-3 text-muted-foreground/50" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xl font-medium">
          {metric.value.toLocaleString()}
        </div>
        
        <div className="flex items-center justify-between">
          <Badge
            variant={isPositive ? "default" : "destructive"}
            className={`text-xs rounded-full ${
              isPositive
                ? "bg-green-100 text-green-700 hover:bg-green-100"
                : "bg-red-100 text-red-700 hover:bg-red-100"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {isPositive ? "+" : ""}{metric.change}%
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