
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BsThreeDots } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import View from "@/components/svg Icons/View";
import { Toaster, toast } from "sonner";
import Download from "@/components/svg Icons/Download";
import Retry from "@/components/svg Icons/Retry";

interface Payout {
  sN: number;
  id: number;
  merchantName: string;
  merchantOrgId: string;
  destinationAccount: string;
  amount: number;
  status: string;
  transactionRef: string;
  paymentReference: string;
  createdAt: string;
  updatedAt: string;
  sourceAccount: string;
}

interface PayoutDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payout: Payout | null;
  setSelectedPayout: (payout: Payout | null) => void;
  payouts: Payout[];
}

export default function PayoutDetailsModal({ isOpen, onClose, payout, setSelectedPayout, payouts }: PayoutDetailsModalProps) {
  if (!payout || !isOpen) return null;

  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0][0];
  };

  const handleExportDetails = async () => {
    try {
      const response = await fetch(`/api/export-payout?payoutId=${payout.id}`, {
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
      console.error("Export Error:", error);
      onClose();
    }
  };

  const handleRetry = () => {
    if (payout.status === "Failed") {
      toast.success(`Retry initiated for Payout ID ${payout.id}`);
      console.log(`Retry attempted for Payout ID ${payout.id}`);
    }
  };

  const currentIndex = payouts.findIndex((item) => item.sN === payout.sN);
  const prevPayout = currentIndex > 0 ? payouts[currentIndex - 1] : null;
  const nextPayout = currentIndex < payouts.length - 1 ? payouts[currentIndex + 1] : null;

  const handlePrev = () => {
    if (prevPayout) setSelectedPayout(prevPayout);
  };

  const handleNext = () => {
    if (nextPayout) setSelectedPayout(nextPayout);
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
              <h2 className="text-sm font-semibold">Payout Details</h2>
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
              Transaction Ref: <span className="text-primary text-sm font-light">{payout.transactionRef}</span>
            </span>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={handlePrev} disabled={!prevPayout}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNext} disabled={!nextPayout}>
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
                  <AvatarFallback>{getInitials(payout.merchantName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{payout.merchantName}</p>
                  <p className="text-xs text-gray-500">{payout.merchantName.toLowerCase().replace(/\s/g, '') + "@gmail.com"}</p>
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
                    <DropdownMenuItem><View /> Log Audit Trail</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportDetails}><Download /> Export Details</DropdownMenuItem>
                    {payout.status === "Failed" && (
                      <DropdownMenuItem onClick={handleRetry}><Retry /> Retry</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex justify-between text-sm border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-1">
              <div className="flex flex-col gap-2"><span className="text-xs text-gray-500">Source Account</span><span>{payout.sourceAccount}</span></div>
              <div className="flex flex-col gap-2"><span className="text-xs text-gray-500">Amount</span><span>₦{payout.amount.toLocaleString()}</span></div>
              <div className="flex flex-col gap-2"><span className="text-xs text-gray-500">Destination Account</span><span>{payout.destinationAccount}</span></div>
              <div className="flex flex-col gap-2"><span className="text-xs text-gray-500">Status</span><span style={{ color: payout.status === "Successful" ? "#4CAF50" : payout.status === "Processing" ? "#FF8C00" : "#FF4444" }}>{payout.status}</span></div>
            </div>
          </div>
          {/* Transaction Details */}
          <div className="space-y-4">
            <h3 className="text-xs text-gray-500">Transaction Details</h3>
            <div className="flex flex-col gap-4 text-sm">
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2"><p className="font-medium">Created At:</p><span>{payout.createdAt}</span></span>
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2"><p className="font-medium">Payment Reference:</p><span>{payout.paymentReference}</span></span>
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2"><p className="font-medium">Merchant Org ID:</p><span>{payout.merchantOrgId}</span></span>
            </div>
          </div>
          {/* Footer */}
          <div className="space-y-4 pt-6">
            <h3 className="text-xs text-gray-500">Footer</h3>
            <div>
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] text-sm pb-2"><p className="font-medium">Last Updated:</p><span>{payout.updatedAt}</span></span>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}