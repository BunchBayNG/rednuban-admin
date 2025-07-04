
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { settlementData } from "@/lib/MockData";
import { SettlementTable } from "./_components/SettlementTable";
import { Card, CardContent } from "@/components/ui/card";
import { ExportModal } from "../dashboard/_components/ExportModal";

export default function SettlementPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Define field options based on table columns
  const fieldOptions = [
    { label: "S/N", value: "sN" },
    { label: "Merchant", value: "merchant" },
    { label: "Source Account", value: "sourceAccount" },
    { label: "Destination Account", value: "destinationAccount" },
    { label: "Amount", value: "amount" },
    { label: "Status", value: "status" },
    { label: "Timestamp", value: "timestamp" },
    { label: "Action", value: "action" },
  ];

  const handleExport = (data: {
    dateRangeFrom: string;
    dateRangeTo: string;
    format: string;
    fields: Record<string, boolean>;
  }) => {
    const exportData = settlementData
      .filter((item) => {
        const fromDate = new Date(data.dateRangeFrom);
        const toDate = new Date(data.dateRangeTo);
        const itemDate = new Date(item.timestamp.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1"));
        return (!data.dateRangeFrom || !isNaN(fromDate.getTime()) && itemDate >= fromDate) &&
               (!data.dateRangeTo || !isNaN(toDate.getTime()) && itemDate <= toDate);
      })
      .map((item) =>
        Object.fromEntries(
          Object.entries(item).filter(([key]) => data.fields[key])
        )
      );
    console.log("Export data:", { ...data, exportData });
    // Generate filename with current date and time
    // const today = new Date();
    // const formattedDate = today.toISOString().split("T")[0].replace(/-/g, ""); // 20250610
    // const formattedTime = today.toTimeString().split(" ")[0].replace(/:/g, ""); // 0313
    // const filename = `Settlements_${formattedDate}_${formattedTime}.csv`;
    // Trigger toast (assuming sonner is set up in layout.tsx)
    // This would be handled by ExportModal's toast logic
    setIsExportModalOpen(false);
  };

  return (
    <div className="min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-sm font-medium">Settlements</h1>
        <Button
          onClick={() => setIsExportModalOpen(true)}
          className="hover:bg-[#A60000] rounded-md"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Settlement Table */}
      <Card>
        <CardContent>
          <SettlementTable />
        </CardContent>
      </Card>

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
