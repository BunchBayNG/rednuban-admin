
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ExportModal } from "../dashboard/_components/ExportModal";
import { PayoutTable } from "./_components/PayoutsTable";

export default function PayoutPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Define field options based on table columns
  const fieldOptions = [
    { label: "S/N", value: "sN" },
    { label: "Merchant", value: "merchant" },
    { label: "Source Account", value: "sourceAccount" },
    { label: "Destination Account", value: "destinationAccount" },
    { label: "Amount", value: "amount" },
    { label: "Status", value: "status" },
    { label: "Transaction Ref", value: "transactionRef" },
    { label: "Payment Ref", value: "paymentRef" },
    { label: "Timestamp", value: "timestamp" },
    { label: "Action", value: "action" },
  ];

  

  return (
    <div className="min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-sm font-medium">Payouts</h1>
        <Button
          onClick={() => setIsExportModalOpen(true)}
          className="hover:bg-[#A60000] rounded-md"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Payout Table */}
      <Card>
        <CardContent>
          <PayoutTable />
        </CardContent>
      </Card>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        endpointPrefix="payouts"
        fieldOptions={fieldOptions}
      />
    </div>
  );
}
