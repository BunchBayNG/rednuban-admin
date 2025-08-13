"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ExportModal } from "../dashboard/_components/ExportModal";
import { VNUBANTable } from "./_components/VnubanTable";

export default function VNUBANsPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Define field options based on table columns
  const fieldOptions = [
    { label: "S/N", value: "sN" },
    { label: "Merchant", value: "merchantName" },
    { label: "vNUBAN", value: "vnuban" },
    { label: "Account Name", value: "accountName" },
    { label: "Status", value: "status" },
    { label: "Product Type", value: "productType" },
    { label: "Customer Reference", value: "customerReference" },
    { label: "Created At", value: "provisionDate" },
  ];

  return (
    <div className="min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-sm font-medium">vNUBANs</h1>
        <Button
          onClick={() => setIsExportModalOpen(true)}
          className="hover:bg-[#A60000] rounded-md"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* vNUBAN Table */}
      <Card>
        <CardContent>
          <VNUBANTable />
        </CardContent>
      </Card>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        endpointPrefix="vnuban"
        fieldOptions={fieldOptions}
      />
    </div>
  );
}