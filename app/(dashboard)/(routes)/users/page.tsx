"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ExportModal } from "../dashboard/_components/ExportModal";
import { UserTable } from "./_components/UserTable";
import { FiUserPlus } from "react-icons/fi";
import AddUserModal from "./_components/AddUserModal";

export default function UserPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const fieldOptions = [
    { label: "S/N", value: "sN" },
    { label: "Full Name", value: "fullName" },
    { label: "Email", value: "email" },
    { label: "Role", value: "role" },
    { label: "Status", value: "status" },
    { label: "Created At", value: "createdAt" },
    { label: "Action", value: "action" },
  ];

  const handleExport = (data: {
    dateRangeFrom: string;
    dateRangeTo: string;
    format: string;
    fields: Record<string, boolean>;
  }) => {
    console.log("Export data:", data);
    setIsExportModalOpen(false);
  };

  return (
    <div className="min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-sm font-medium">Users</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="bg-[#F8F8F8] dark:bg-card"
            onClick={() => setIsAddUserModalOpen(true)}
          >
            Add User
            <FiUserPlus />
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
      <Card>
        <CardContent>
          <UserTable refetchTrigger={refetchTrigger} />
        </CardContent>
      </Card>
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        fieldOptions={fieldOptions}
      />
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSuccess={() => setRefetchTrigger((prev) => prev + 1)}
      />
    </div>
  );
}