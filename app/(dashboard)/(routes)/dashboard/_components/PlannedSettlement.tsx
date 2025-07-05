"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface PayoutData {
  total: number;
  success: number;
  pending: number;
  failed: number;
}

export function PlannedSettlements() {
  const [payoutData, setPayoutData] = useState<PayoutData>({
    total: 72760,
    success: 70970,
    pending: 0,
    failed: 1790,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPayoutData() {
      setLoading(true);
      setError(null);

      const accessToken = localStorage.getItem("accessToken");
      console.log("Client-side: Retrieved accessToken:", accessToken ? "Present" : "Missing");

      if (!accessToken) {
        setError("Unauthorized: Missing access token");
        setLoading(false);
        return;
      }

      const startDate = "2024-12-01";
      const endDate = "2025-01-01";

      try {
        const response = await fetch(
          `/api/analytics/payouts/count-summary?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        console.log("Client-side: Payout count summary response:", {
          status: response.status,
          body: JSON.stringify(data, null, 2),
        });

        if (response.ok && data.status) {
          const { total, success, pending, failed } = data.data;
          setPayoutData({ total, success, pending, failed });
        } else {
          throw new Error(data.message || "Failed to fetch payout data");
        }
      } catch (err) {
        console.error("Client-side: Fetch error:", {
          message: err instanceof Error ? err.message : "Unknown error",
          stack: err instanceof Error ? err.stack : "Unknown stack",
        });
        setError("Failed to load payout data");
      } finally {
        setLoading(false);
      }
    }

    fetchPayoutData();
  }, []);

  const totalNonZero = payoutData.total || payoutData.success + payoutData.pending + payoutData.failed || 1;
  const successPercentage = (payoutData.success / totalNonZero) * 100;
  const pendingPercentage = (payoutData.pending / totalNonZero) * 100;
  const failedPercentage = (payoutData.failed / totalNonZero) * 100;

  return (
    <Card className="rounded-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-1">
          Planned Settlements
          <ExternalLink className="h-3 w-3 text-gray-400" />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {loading ? (
          <div className="text-center text-sm text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-sm text-red-500">{error}</div>
        ) : (
          <>
            <div>
              <div className="text-2xl font-bold">{payoutData.total.toLocaleString()}</div>
              <div className="text-sm text-gray-500">
                Total future settlements planned
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-sm text-gray-500">Payout Status Count</div>

              {/* Stacked Percentage Bar */}
              <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden flex flex-row">
                <div
                  className="h-full bg-green-600"
                  style={{ width: `${successPercentage}%` }}
                  title={`Success: ${successPercentage.toFixed(2)}%`}
                />
                <div
                  className="h-full bg-yellow-500"
                  style={{ width: `${pendingPercentage}%` }}
                  title={`Pending: ${pendingPercentage.toFixed(2)}%`}
                />
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${failedPercentage}%` }}
                  title={`Failed: ${failedPercentage.toFixed(2)}%`}
                />
              </div>

              {/* Legend for Success, Pending, and Failed */}
              <div className="flex items-center justify-between space-x-8">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-sm">Success</span>
                  </div>
                  <div className="text-sm font-bold">
                    {payoutData.success.toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Pending</span>
                  </div>
                  <div className="text-sm font-bold">
                    {payoutData.pending.toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Failed</span>
                  </div>
                  <div className="text-sm font-bold">
                    {payoutData.failed.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}