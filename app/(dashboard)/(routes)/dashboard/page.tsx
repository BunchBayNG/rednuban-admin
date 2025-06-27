
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {  Download } from "lucide-react";

import { dashboardMetrics, secondaryMetrics } from '@/lib/MockData';
import { MerchantsChart } from './_components/MerchatntCard';
import { MetricCard } from "./_components/MetricCard";
import { PayoutStatusChart } from "./_components/PayoutStatusChart";
import { TopMerchants } from "./_components/TopMerchants";
import { TransactionFlowChart } from "./_components/TransactionFlowChart";
import { PlannedSettlements } from "./_components/PlannedSettlement";
import { ExportModal } from "./_components/ExportModal";

export default function DashboardPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Define fields to export based on dashboardMetrics and secondaryMetrics
 // Define fields to export based on dashboardMetrics, secondaryMetrics, and additional merchant options
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
      {/* Header */}
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

      {/* Main Content */}
      <div className="max-w-7xl">
        <div className="space-y-8">
          {/* Top Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {dashboardMetrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>

          {/* Secondary Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {secondaryMetrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MerchantsChart />
            <TransactionFlowChart />
          </div>

          {/* Bottom Section - 3 separate cards */}
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
            <PlannedSettlements />
            <TopMerchants />
            <PayoutStatusChart />
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        fieldOptions={fieldOptions}
      />
    </div>
  );
}