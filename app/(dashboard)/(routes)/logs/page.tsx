"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { apiLogsData } from "@/lib/MockData";
import { ApiLogsTable } from "./_components/ApiLogsTable";
import { Card, CardContent } from "@/components/ui/card";
import { ExportModal } from "../dashboard/_components/ExportModal";

export default function ApiLogsPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Define field options based on table columns
  const fieldOptions = [
    { label: "S/N", value: "sN" },
    { label: "Merchant Code", value: "merchantCode" },
    { label: "Request Timestamp", value: "requestTimestamp" },
    { label: "Response Timestamp", value: "responseTimestamp" },
    { label: "Service", value: "service" },
    { label: "Response Status", value: "responseStatus" },
    { label: "Timestamp", value: "timestamp" },
    { label: "Action", value: "action" },
  ];

  const handleExport = (data: {
    dateRangeFrom: string;
    dateRangeTo: string;
    format: string;
    fields: Record<string, boolean>;
  }) => {
    const exportData = apiLogsData
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
    // const today = new Date();
    // const formattedDate = today.toISOString().split("T")[0].replace(/-/g, ""); // 20250610
    // const formattedTime = today.toTimeString().split(" ")[0].replace(/:/g, ""); // 0605
    // const filename = `ApiLogs_${formattedDate}_${formattedTime}.csv`;
    setIsExportModalOpen(false);
  };

  return (
    <div className="min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-sm font-medium">API Logs</h1>
        <Button
          onClick={() => setIsExportModalOpen(true)}
          className="hover:bg-[#A60000] rounded-md"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* API Logs Table */}
      <Card>
        <CardContent>
          <ApiLogsTable />
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