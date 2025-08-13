"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { AuditTrailTable } from "./_components/AuditTrailTable";
import { Card, CardContent } from "@/components/ui/card";
import { ExportModal } from "../dashboard/_components/ExportModal";

export default function AuditTrailPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Define field options based on table columns
  const fieldOptions = [
    { label: "S/N", value: "sN" },
    { label: "User", value: "user" },
    { label: "Email", value: "email" },
    { label: "User Role", value: "userRole" },
    { label: "User IP Address", value: "userIpAddress" },
    { label: "Merchant", value: "merchant" },
    { label: "Action", value: "action" },
    { label: "Description", value: "description" },
    { label: "Time", value: "time" },
  ];


  return (
    <div className="min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-sm font-medium">Audit Trail</h1>
        <Button
          onClick={() => setIsExportModalOpen(true)}
          className="hover:bg-[#A60000] rounded-md"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Audit Trail Table */}
      <Card>
        <CardContent>
          <AuditTrailTable />
        </CardContent>
      </Card>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        endpointPrefix="audit-logs"
        fieldOptions={fieldOptions}
      />
    </div>
  );
}
