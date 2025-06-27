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
import { Toaster, toast } from "sonner";
import { useState } from "react";
import Retry from "@/components/svg Icons/Retry";
import Download from "@/components/svg Icons/Download";

interface Settlement {
  sN: number;
  id: number;
  merchantName: string;
  merchantOrgId: string;
  sourceAccount: string;
  destinationAccount: string;
  amount: number;
  status: string;
  transactionRef: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
}

interface SettlementDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settlement: Settlement | null;
  setSelectedSettlement: (settlement: Settlement | null) => void;
  currentPage: number;
  totalElements: number;
  filters: {
    startDate: string;
    endDate: string;
    status: string;
    search: string;
    merchantOrgId: string;
    sortBy: string;
    sortOrder: string;
    searchTerm: string;
  };
}

export default function SettlementDetailsModal({
  isOpen,
  onClose,
  settlement,
  setSelectedSettlement,
  totalElements,
  filters,
}: SettlementDetailsModalProps) {
  const [loading, setLoading] = useState(false);

  if (!settlement || !isOpen) return null;

  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0][0];
  };

  const fetchSettlement = async (index: number) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: Math.floor(index / 10).toString(),
        size: "10",
        sortBy: filters.sortBy || "createdAt",
        sortOrder: filters.sortOrder || "asc",
      };
      if (filters.search) params.search = filters.search;
      else if (filters.searchTerm) params.search = filters.searchTerm;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.status) params.status = filters.status;
      if (filters.merchantOrgId) params.merchantOrgId = filters.merchantOrgId;

      const queryString = new URLSearchParams(params).toString();
      const res = await fetch(`/api/reports/settlements?${queryString}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("API route not found. Please check server configuration.");
        } else if (res.status === 401) {
          throw new Error("Unauthorized. Please check your access token.");
        } else if (res.status === 400) {
          throw new Error("Bad request. Please check query parameters.");
        }
        throw new Error(`HTTP error: ${res.status}`);
      }
      const data = await res.json();
      if (data.status) {
        const settlementIndex = index % 10;
        const s = data.data.content[settlementIndex];
        if (s) {
          return {
            sN: index + 1,
            id: s.id || 0,
            merchantName: s.merchantName || "",
            merchantOrgId: s.merchantOrgId || "",
            sourceAccount: s.sourceAccount || "",
            destinationAccount: s.destinationAccount || "",
            amount: s.amount || 0,
            status: s.status || "",
            transactionRef: s.transactionRef || "",
            reference: s.reference || "",
            createdAt: s.createdAt
              ? new Date(s.createdAt).toLocaleString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
            updatedAt: s.updatedAt || "",
          };
        }
      }
      throw new Error("Settlement not found");
    } catch (error) {
      console.error("Error fetching settlement:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load settlement data";
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleExportDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/export-settlement?settlementId=${settlement.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1]}`,
        },
      });
      if (!res.ok) {
        if (res.status === 404) throw new Error("Export endpoint not found.");
        throw new Error("Export failed.");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `settlement_${settlement.transactionRef}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Export successful! Check your downloads.");
      onClose();
    } catch (error) {
      console.error("Export error:", error);
      const errorMessage = error instanceof Error ? error.message : "Export failed. Please try again later.";
      toast.error(errorMessage);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/settlement/retry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1]}`,
        },
        body: JSON.stringify({ id: settlement.id }),
      });
      if (!res.ok) {
        if (res.status === 404) throw new Error("Retry endpoint not found.");
        throw new Error("Retry failed.");
      }
      toast.success(`Retry initiated for Settlement ID ${settlement.id}`);
      setSelectedSettlement({ ...settlement, status: "Processing" });
    } catch (error) {
      console.error("Retry error:", error);
      const errorMessage = error instanceof Error ? error.message : "Retry failed. Please try again later.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const currentIndex = settlement.sN - 1; // Adjust for 1-based sN
  const prevSettlement = currentIndex > 0;
  const nextSettlement = currentIndex < totalElements - 1;

  const handlePrev = async () => {
    if (prevSettlement) {
      const prev = await fetchSettlement(currentIndex - 1);
      if (prev) setSelectedSettlement(prev);
    }
  };

  const handleNext = async () => {
    if (nextSettlement) {
      const next = await fetchSettlement(currentIndex + 1);
      if (next) setSelectedSettlement(next);
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
              <h2 className="text-sm font-semibold">Settlement Details</h2>
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
              Transaction Ref: <span className="text-primary text-sm font-light">{settlement.transactionRef}</span>
            </span>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={handlePrev} disabled={!prevSettlement || loading}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNext} disabled={!nextSettlement || loading}>
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
                  <AvatarImage src="https://via.placeholder.com/100" alt={settlement.merchantName} />
                  <AvatarFallback>{getInitials(settlement.merchantName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{settlement.merchantName}</p>
                  <p className="text-xs text-gray-500">{settlement.merchantOrgId || "N/A"}</p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Button className="bg-red-500 text-white hover:bg-red-600 ml-auto">View Profile</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="bg-[#F5F5F5] dark:bg-card rounded-sm">
                      <BsThreeDots />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleExportDetails}>
                      <Download /> Export Details
                    </DropdownMenuItem>
                    {settlement.status === "Failed" && (
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
                <span className="text-xs text-gray-500">Source Account</span>
                <span>{settlement.sourceAccount}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Amount</span>
                <span>₦{settlement.amount.toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Destination Account</span>
                <span>{settlement.destinationAccount}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Status</span>
                <span
                  style={{
                    color:
                      settlement.status === "Successful"
                        ? "#4CAF50"
                        : settlement.status === "Processing"
                        ? "#FF8C00"
                        : "#FF4444",
                  }}
                >
                  {settlement.status}
                </span>
              </div>
            </div>
          </div>
          {/* Settlement Details */}
          <div className="space-y-4">
            <h3 className="text-xs text-gray-500">Settlement Details</h3>
            <div className="flex flex-col gap-4 text-sm">
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2">
                <p className="font-medium">Created At:</p>
                <span>{settlement.createdAt}</span>
              </span>
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2">
                <p className="font-medium">Reference:</p>
                <span>{settlement.reference}</span>
              </span>
            </div>
          </div>
          {/* Footer */}
          <div className="mt-auto pt-4 text-sm space-y-4">
            <h3 className="text-gray-500 text-xs">Footer</h3>
            <div>
              <span className="flex gap-2">
                <p className="text-medium">Last Updated:</p>
                <span>
                  {settlement.updatedAt
                    ? new Date(settlement.updatedAt).toLocaleString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : settlement.createdAt}{" "}
                  WAT
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}