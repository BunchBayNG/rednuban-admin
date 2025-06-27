"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export function PlannedSettlements() {
  // Sample data (replace with dynamic data from API or state)
  const succeededAmount = 9268997.0; // ₦9,268,997,060.00
  const failedAmount = 1790900.0; // ₦1,790,900.00
  const totalAmount = succeededAmount + failedAmount;

  // Calculate percentages for the progress bar
  const succeededPercentage = (succeededAmount / totalAmount) * 100;
  const failedPercentage = (failedAmount / totalAmount) * 100;

  return (
    <Card className="rounded-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-1">
          Planned Settlements
          <ExternalLink className="h-3 w-3 text-gray-400" />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <div className="text-2xl font-bold">11,989</div>
          <div className="text-sm text-gray-500">
            Total future settlements planned
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-gray-500">Payout Status Count</div>

          {/* Stacked Percentage Bar */}
          <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden flex flex-row">
            {/* Succeeded Portion */}
            <div
              className="h-full bg-green-600"
              style={{ width: `${succeededPercentage}%` }}
              title={`Succeeded: ${succeededPercentage.toFixed(2)}%`}
            />
            {/* Failed Portion */}
            <div
              className="h-full bg-red-500"
              style={{ width: `${failedPercentage}%` }}
              title={`Failed: ${failedPercentage.toFixed(2)}%`}
            />
          </div>

          {/* Legend for Succeeded and Failed */}
          <div className="flex items-center justify-between space-x-8">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-sm">Succeeded</span>
              </div>
              <div className="text-sm font-bold">
                ₦{succeededAmount.toLocaleString()}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm">Failed</span>
              </div>
              <div className="text-sm font-bold">
                ₦{failedAmount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}