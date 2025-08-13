"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { TransactionTable } from "./_components/TransactionTable";
import { Card, CardContent } from "@/components/ui/card";
import { ExportModal } from "../dashboard/_components/ExportModal";

export default function TransactionPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Define field options based on table columns
  const fieldOptions = [
    { label: "S/N", value: "sN" },
    { label: "Merchant", value: "merchant" },
    { label: "vNUBAN", value: "vNUBAN" },
    { label: "Amount", value: "amount" },
    { label: "Status", value: "status" },
    { label: "Transaction ID", value: "transactionID" },
    { label: "Webhook Status", value: "webhookStatus" },
    { label: "Timestamp", value: "timestamp" },
    { label: "Action", value: "action" },
  ];



  return (
    <div className="min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-sm font-medium">Transactions</h1>
        <Button
          onClick={() => setIsExportModalOpen(true)}
          className=" hover:bg-[#A60000]  rounded-md"
        >
          Export
          <Download className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Transaction Table */}
      <Card >
      <CardContent>
      <TransactionTable />
      </CardContent>
      </Card>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        endpointPrefix="transactions"
        fieldOptions={fieldOptions}
      />
    </div>
  );
}
