"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { MerchantTable } from "./_components/MerchantTable";
import { Card, CardContent } from "@/components/ui/card";
import { ExportModal } from "../dashboard/_components/ExportModal";
import { FiUserPlus } from "react-icons/fi";
import { CreateMerchantModal } from "./_components/CreateMerchantModal";

export default function MerchantPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCreateMerchantModalOpen, setIsCreateMerchantModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Define field options based on table columns
  const fieldOptions = [
    { label: "S/N", value: "sN" },
    { label: "Merchant Name", value: "merchantName" },
    { label: "Code", value: "code" },
    { label: "Account Name", value: "accountName" },
    { label: "Account Number", value: "accountNumber" },
    { label: "Primary Contact", value: "primaryContact" },
    { label: "Status", value: "status" },
    { label: "No. of Users", value: "noOfUsers" },
    { label: "Created At", value: "createdAt" },
    { label: "Action", value: "action" },
  ];

  const handleExport = (data: {
    dateRangeFrom: string;
    dateRangeTo: string;
    format: string;
    fields: Record<string, boolean>;
  }) => {
    console.log("Export data:", { ...data });
    setIsExportModalOpen(false);
  };

  const handleRefreshTable = () => {
    setRefreshKey((prev) => prev + 1); // Trigger table refresh
  };

  return (
    <div className="min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-sm font-medium">Merchants</h1>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setIsCreateMerchantModalOpen(true)}
            className="flex items-center"
            variant="outline"
          >
            Create Merchant <FiUserPlus />
          </Button>
          <Button
            onClick={() => setIsExportModalOpen(true)}
            className="hover:bg-[#A60000] rounded-md"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Merchant Table */}
      <Card>
        <CardContent>
          <MerchantTable refreshKey={refreshKey} />
        </CardContent>
      </Card>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        fieldOptions={fieldOptions}
      />

      {/* Create Merchant Modal */}
      <CreateMerchantModal
        isOpen={isCreateMerchantModalOpen}
        onClose={() => setIsCreateMerchantModalOpen(false)}
        onSuccess={handleRefreshTable}    
          />
    </div>
  );
}