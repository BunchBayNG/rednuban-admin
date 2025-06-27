"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BsThreeDots } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Vnu from "@/components/svg Icons/Vnu";
import Retry from "@/components/svg Icons/Retry";
import { Toaster, toast } from "sonner";
import Download from "@/components/svg Icons/Download";

interface Transaction {
  sN: number;
  id: number;
  transactionId: string;
  merchantName: string;
  merchantOrgId: string;
  vnuban: string;
  amount: number;
  status: string;
  sessionId: string;
  reference: string;
  webhookStatus: string;
  transactionType: string;
  destinationAccountNumber: string;
  destinationAccountName: string;
  destinationBankName: string;
  ipAddress: string;
  deviceName: string;
  processingTime: number;
  createdAt: string;
  updatedAt: string;
}

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  transactions: Transaction[];
  currentPage: number;
  totalElements: number;
  filters: {
    transactionId: string;
    merchantName: string;
    merchantOrgId: string;
    vnuban: string;
    startDate: string;
    endDate: string;
    status: string;
    sortBy: string;
    sortOrder: string;
    searchTerm: string;
  };
}

export default function TransactionDetailsModal({
  isOpen,
  onClose,
  transaction,
  setSelectedTransaction,
  transactions,
}: TransactionDetailsModalProps) {
  if (!transaction || !isOpen) return null;

  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0][0];
  };

  const handleExportDetails = async () => {
    try {
      const response = await fetch(`/api/export-transaction?transactionId=${transaction.transactionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Export failed");
      toast.success("Export successful! Check your downloads.");
      onClose();
    } catch (error) {
      toast.error("Export failed. Please try again later.");
      console.error(error);
    }
  };

  const handleRetry = () => {
    if (transaction.status === "Failed") {
      toast.success(`Retry initiated for Transaction ID ${transaction.transactionId}`);
      console.log(`Retry attempted for Transaction ID ${transaction.transactionId}`);
    }
  };

  const currentIndex = transactions.findIndex((t) => t.transactionId === transaction.transactionId);
  const prevTransaction = currentIndex > 0 ? transactions[currentIndex - 1] : null;
  const nextTransaction = currentIndex < transactions.length - 1 ? transactions[currentIndex + 1] : null;

  const handlePrev = () => {
    if (prevTransaction) {
      setSelectedTransaction(prevTransaction);
    }
  };

  const handleNext = () => {
    if (nextTransaction) {
      setSelectedTransaction(nextTransaction);
    }
  };

  return (
    <div className="fixed inset-0 z-[50] flex justify-end my-3 mr-3">
      <div
        className="fixed inset-0 bg-[#140000B2] backdrop-blur-xs dark:bg-black/50"
        onClick={onClose}
      />
      <div
        className="h-full w-[45%] bg-background shadow-lg overflow-x-auto transform transition-transform duration-300 ease-in-out rounded-xl"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-[#F8F8F8] dark:border-[#2A2A2A]">
            <div className="flex flex-col gap-0">
              <h2 className="text-sm font-semibold">Transaction Details</h2>
              <p className="text-xs text-gray-500 mb-4">Get complete oversight on platform operations</p>
            </div>
            <div>
              <Button variant="ghost" className="p-0 h-auto" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between border-b border-[#F8F8F8] dark:border-[#2A2A2A] py-3">
            <span className="text-red-500 font-medium text-sm">
              Transaction ID: <span className="text-primary text-sm font-light">{transaction.transactionId}</span>
            </span>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={handlePrev} disabled={!prevTransaction}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNext} disabled={!nextTransaction}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          {/* Summary Section */}
          <div className="space-y-4 py-3">
            <h3 className="text-xs text-gray-500">Summary Section</h3>
            <div className="flex items-center justify-between space-x-1 pb-5 border-b border-[#F8F8F8] dark:border-[#2A2A2A]">
              <div className="flex items-center gap-2">
                <Avatar className="w-13 h-13">
                  <AvatarImage src="/images/avatar-placeholder.jpg" alt="Merchant Avatar" />
                  <AvatarFallback>{getInitials(transaction.merchantName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{transaction.merchantName}</p>
                  <p className="text-xs text-gray-500">{transaction.merchantOrgId || "N/A"}</p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Button className="hover:bg-red-600 ml-auto">View Profile</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="bg-[#F5F5F5] dark:bg-card rounded-sm">
                      <BsThreeDots />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Vnu /> Log Audit Trail
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportDetails}>
                      <Download /> Export Details
                    </DropdownMenuItem>
                    {transaction.status === "Failed" && (
                      <DropdownMenuItem onClick={handleRetry}>
                        <Retry /> Retry
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex justify-between text-sm border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-1">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">vNUBAN</span>
                <span>{transaction.vnuban}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Amount</span>
                <span>₦{transaction.amount.toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Status</span>
                <span
                  style={{
                    color:
                      transaction.status === "Successful"
                        ? "#4CAF50"
                        : transaction.status === "Pending"
                        ? "#FF8C00"
                        : "#FF4444",
                  }}
                >
                  {transaction.status}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Created At</span>
                <span>{transaction.createdAt} WAT</span>
              </div>
            </div>
          </div>
          {/* Transaction Details */}
          <div className="space-y-4">
            <h3 className="text-xs text-gray-500">Transaction Details</h3>
            <div className="flex flex-col gap-4 text-sm">
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2">
                <p className="font-medium">Session ID:</p>
                <p>{transaction.sessionId || "N/A"}</p>
              </span>
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2">
                <p className="font-medium">Reference:</p>
                <span>{transaction.reference || "N/A"}</span>
              </span>
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2">
                <p className="font-medium">Webhook Status:</p>
                <span>{transaction.webhookStatus || "N/A"}</span>
              </span>
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2">
                <p className="font-medium">Transaction Type:</p>
                <span>{transaction.transactionType || "N/A"}</span>
              </span>
              <span className="flex gap-2">
                <p className="font-medium">Destination:</p>
                <span className="flex gap-4">
                  <p>{transaction.destinationAccountNumber || "N/A"}</p>
                  <p>{transaction.destinationBankName || "N/A"}</p>
                  <p>{transaction.destinationAccountName || "N/A"}</p>
                </span>
              </span>
            </div>
          </div>
          {/* Additional Metadata */}
          <div className="space-y-4 mt-6">
            <h3 className="text-xs text-gray-500">Additional Metadata</h3>
            <div className="flex flex-col gap-4 text-sm">
              <span className="flex gap-2">
                <p className="font-medium">IP Address:</p>
                <span>{transaction.ipAddress || "N/A"}</span>
              </span>
              <span className="flex gap-2">
                <p className="font-medium">Device Info:</p>
                <span>{transaction.deviceName || "N/A"}</span>
              </span>
              <span className="flex gap-2">
                <p className="font-medium">Processing Time:</p>
                <span>{transaction.processingTime || "N/A"}</span>
              </span>
            </div>
          </div>
          {/* Footer */}
          <div className="mt-auto pt-4 text-sm space-y-4">
            <h3 className="text-gray-500 text-xs">Footer</h3>
            <div>
              <span className="flex gap-2">
                <p className="font-medium">Last Updated:</p>
                <span>{transaction.updatedAt || transaction.createdAt}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}