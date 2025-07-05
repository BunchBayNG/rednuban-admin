"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { MerchantsChart } from "./_components/MerchatntCard";
import { MetricCard } from "./_components/MetricCard";
import { PayoutStatusChart } from "./_components/PayoutStatusChart";
import { TopMerchants } from "./_components/TopMerchants";
import { TransactionFlowChart } from "./_components/TransactionFlowChart";
import { PlannedSettlements } from "./_components/PlannedSettlement";
import { ExportModal } from "./_components/ExportModal";

interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'positive' | 'negative';
  period: string;
}

export default function DashboardPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [vnubanData, setVnubanData] = useState<{
    currentTotal: number;
    previousTotal: number;
    error?: string;
  }>({
    currentTotal: 1900789,
    previousTotal: 1550000, // Example for change calculation
    error: undefined,
  });

  useEffect(() => {
    async function fetchVnubanData() {
      // Assume accessToken is stored in localStorage or auth context
      const accessToken = localStorage.getItem("accessToken"); // Replace with your auth mechanism
      console.log("Client-side: Retrieved accessToken:", accessToken ? "Present" : "Missing");

      if (!accessToken) {
        setVnubanData((prev) => ({ ...prev, error: "Unauthorized: Missing access token" }));
        return;
      }

      // Use past dates
      const currentStart = "2024-12-01";
      const currentEnd = "2025-01-01";
      const previousStart = "2024-11-01";
      const previousEnd = "2024-11-30";

      console.log("Client-side: Date range:", { currentStart, currentEnd, previousStart, previousEnd });

      try {
        const currentRes = await fetch(
          `/api/analytics/vnuban/total?startDate=${encodeURIComponent(currentStart)}&endDate=${encodeURIComponent(currentEnd)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const currentData = await currentRes.json();
        console.log("Client-side: Current period response:", {
          status: currentRes.status,
          body: JSON.stringify(currentData, null, 2),
        });

        const previousRes = await fetch(
          `/api/analytics/vnuban/total?startDate=${encodeURIComponent(previousStart)}&endDate=${encodeURIComponent(previousEnd)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const previousData = await previousRes.json();
        console.log("Client-side: Previous period response:", {
          status: previousRes.status,
          body: JSON.stringify(previousData, null, 2),
        });

        if (currentRes.ok && currentData.status && previousRes.ok && previousData.status) {
          setVnubanData({
            currentTotal: currentData.data,
            previousTotal: previousData.data,
          });
        } else {
          setVnubanData((prev) => ({
            ...prev,
            error: currentData.message || previousData.message || "Failed to fetch vNUBAN data",
          }));
        }
      } catch (error) {
        console.error("Client-side: Fetch error:", {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : "Unknown stack",
        });
        setVnubanData((prev) => ({ ...prev, error: "Internal client error" }));
      }
    }

    fetchVnubanData();
  }, []);

  const dashboardMetrics: DashboardMetric[] = [
    {
      id: 'total-merchants',
      title: 'Total Merchants',
      value: '134,790',
      change: 22.7,
      changeType: 'positive',
      period: 'Last 30 days',
    },
    {
      id: 'total-vnubans',
      title: 'Total vNUBANs',
      value: vnubanData.error ? '1,900,789' : vnubanData.currentTotal.toLocaleString(),
      change: vnubanData.error
        ? 22.7
        : vnubanData.previousTotal
        ? Math.round(
            Math.abs(((vnubanData.currentTotal - vnubanData.previousTotal) / vnubanData.previousTotal) * 100) * 10
          ) / 10
        : 0,
      changeType: vnubanData.error
        ? 'positive'
        : vnubanData.currentTotal >= vnubanData.previousTotal
        ? 'positive'
        : 'negative',
      period: 'Last 30 days',
    },
    {
      id: 'virtual-transaction-flow',
      title: 'Count of Virtual Transaction Flow',
      value: '12,900',
      change: -12.2,
      changeType: 'negative',
      period: 'Last 30 days',
    },
    {
      id: 'virtual-transaction-inflow',
      title: 'Value of Virtual Transaction Inflow',
      value: '3,459',
      change: 22.7,
      changeType: 'positive',
      period: 'Last 30 days',
    },
  ];

  const secondaryMetrics: DashboardMetric[] = [
    {
      id: 'distinctive-vnubans',
      title: 'Distinctive Active vNUBANs',
      value: '11,989',
      change: 22.7,
      changeType: 'positive',
      period: 'Last 30 days'
    },
    {
      id: 'pending-notifications',
      title: 'Total Amount Pending Merchant Notification',
      value: '₦4,789,008.00',
      change: 22.7,
      changeType: 'positive',
      period: 'Last 30 days'
    },
    {
      id: 'successful-amount',
      title: 'Total Successful Amount Collected',
      value: '₦7,567,900,890.87',
      change: 22.7,
      changeType: 'positive',
      period: 'Last 30 days'
    },
    {
      id: 'payouts-processed',
      title: 'Total Payouts Processed',
      value: '₦10,567,900,890.87',
      change: 22.7,
      changeType: 'positive',
      period: 'Last 30 days'
    }
  ];

  const fieldOptions = [
    ...dashboardMetrics.map((metric) => ({
      label: metric.title,
      value: metric.id,
    })),
    ...secondaryMetrics.map((metric) => ({
      label: metric.title,
      value: metric.id,
    })),
    { label: "Merchants vNUBAN Summary", value: "merchantsVNUBANSummary" },
    { label: "Merchants Total Transaction Flow", value: "merchantsTotalTransactionFlow" },
  ];

  const handleExport = (data: {
    dateRangeFrom: string;
    dateRangeTo: string;
    format: string;
    fields: Record<string, boolean>;
  }) => {
    console.log("Export data:", data);
    // Placeholder: Integrate with backend to export data as CSV or Excel
  };

  return (
    <div className="min-h-screen mx-auto px-4 sm:px-6 lg:px-8">
      <div>
        <div className="max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg font-medium">Dashboard</h1>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setIsExportModalOpen(true)}
                className=""
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {dashboardMetrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {secondaryMetrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MerchantsChart />
            <TransactionFlowChart />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
            <PlannedSettlements />
            <TopMerchants />
            <PayoutStatusChart />
          </div>
        </div>
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        fieldOptions={fieldOptions}
      />
    </div>
  );
}