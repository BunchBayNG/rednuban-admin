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
import Reactivate from "@/components/svg Icons/Reactivate";
import Download from "@/components/svg Icons/Download";
import Deactivate from "@/components/svg Icons/Deactivate";
import { useState } from "react";

interface VNUBAN {
  sN: number;
  id: number;
  merchantName: string;
  merchantOrgId: string;
  vnuban: string;
  accountName: string | number;
  vnubanType: string;
  status: string;
  productType: string;
  customerReference: string;
  createdAt: string;
  updatedAt: string;
}

interface VNUBANDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vNUBAN: VNUBAN | null;
  setSelectedVNUBAN: (vNUBAN: VNUBAN | null) => void;
  currentPage: number;
  totalElements: number;
  filters: {
    startDate: string;
    endDate: string;
    status: string;
    search: string;
    sortBy: string;
    sortOrder: string;
    searchTerm: string;
  };
}

export default function VNUBANDetailsModal({
  isOpen,
  onClose,
  vNUBAN,
  setSelectedVNUBAN,
  totalElements,
  filters,
}: VNUBANDetailsModalProps) {
  const [loading, setLoading] = useState(false);

  if (!vNUBAN || !isOpen) return null;

  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0][0];
  };

  const fetchVNUBAN = async (index: number) => {
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

      const queryString = new URLSearchParams(params).toString();
      const res = await fetch(`/api/reports/vnubans?${queryString}`, {
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok && data.status) {
        const vnubanIndex = index % 10;
        const vnuban = data.data.content[vnubanIndex];
        if (vnuban) {
          return {
            sN: index + 1,
            id: vnuban.id || 0,
            merchantName: vnuban.merchantName || "",
            merchantOrgId: vnuban.merchantOrgId || "",
            vnuban: vnuban.vnuban || "",
            accountName: vnuban.accountName || "",
            vnubanType: vnuban.vnubanType || "",
            status: vnuban.status || "",
            productType: vnuban.productType || "",
            customerReference: vnuban.customerReference || "",
            createdAt: vnuban.createdAt
              ? new Date(vnuban.createdAt).toLocaleString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
            updatedAt: vnuban.updatedAt || "",
          };
        }
      }
      throw new Error("vNUBAN not found");
    } catch (error) {
      console.error("Error fetching vNUBAN:", error);
      toast.error("Failed to load vNUBAN data");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleExportDetails = async () => {
    setLoading(true);
    try {
      // Placeholder API (not in docs)
      console.warn("Using undocumented /api/export-vnuban endpoint");
      const res = await fetch(`/api/export-vnuban?id=${vNUBAN.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1]}`,
        },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vnuban_${vNUBAN.vnuban}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Export successful! Check your downloads.");
      onClose();
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export failed. Please try again later.");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: "Active" | "Inactive") => {
    setLoading(true);
    try {
      // Placeholder API (not in docs)
      console.warn("Using undocumented /api/vnuban/status endpoint");
      const res = await fetch(`/api/vnuban/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1]}`,
        },
        body: JSON.stringify({ id: vNUBAN.id, status: newStatus }),
      });
      if (!res.ok) throw new Error(`Failed to ${newStatus.toLowerCase()} vNUBAN`);
      toast.success(`vNUBAN ${newStatus.toLowerCase()}d successfully`);
      setSelectedVNUBAN({ ...vNUBAN, status: newStatus });
    } catch (error) {
      console.error(`Error ${newStatus.toLowerCase()}ing vNUBAN:`, error);
      toast.error(`Failed to ${newStatus.toLowerCase()} vNUBAN`);
    } finally {
      setLoading(false);
    }
  };

  const currentIndex = vNUBAN.sN - 1; // Adjust for 1-based sN
  const prevVNUBAN = currentIndex > 0;
  const nextVNUBAN = currentIndex < totalElements - 1;

  const handlePrev = async () => {
    if (prevVNUBAN) {
      const prev = await fetchVNUBAN(currentIndex - 1);
      if (prev) setSelectedVNUBAN(prev);
    }
  };

  const handleNext = async () => {
    if (nextVNUBAN) {
      const next = await fetchVNUBAN(currentIndex + 1);
      if (next) setSelectedVNUBAN(next);
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
              <h2 className="text-sm font-semibold">vNUBAN Details</h2>
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
              vNUBAN: <span className="text-primary text-sm font-light">{vNUBAN.vnuban}</span>
            </span>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={handlePrev} disabled={!prevVNUBAN || loading}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNext} disabled={!nextVNUBAN || loading}>
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
                  <AvatarImage src="/images/avatar-placeholder.jpg" alt={vNUBAN.merchantName} />
                  <AvatarFallback>{getInitials(vNUBAN.merchantName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{vNUBAN.merchantName}</p>
                  <p className="text-xs text-gray-500">{vNUBAN.merchantOrgId || "N/A"}</p>
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
                    {vNUBAN.status === "Active" ? (
                      <>
                        <DropdownMenuItem onClick={() => handleStatusChange("Inactive")}>
                          <Deactivate /> Deactivate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportDetails}>
                          <Download /> Export Data
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem onClick={() => handleStatusChange("Active")}>
                          <Reactivate /> Reactivate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportDetails}>
                          <Download /> Export Data
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex justify-between text-sm border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-1">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Account Name</span>
                <span>{typeof vNUBAN.accountName === "number" ? vNUBAN.accountName.toString() : vNUBAN.accountName}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Status</span>
                <span style={{ color: vNUBAN.status === "Active" ? "#4CAF50" : "#FF4444" }}>
                  {vNUBAN.status}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Created At</span>
                <span>{vNUBAN.createdAt} WAT</span>
              </div>
            </div>
          </div>
          {/* vNUBAN Details */}
          <div className="space-y-4">
            <h3 className="text-xs text-gray-500">vNUBAN Details</h3>
            <div className="flex flex-col gap-4 text-sm">
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2">
                <p className="font-medium">vNUBAN Type:</p>
                <span>{vNUBAN.vnubanType || "N/A"}</span>
              </span>
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2">
                <p className="font-medium">Customer Reference:</p>
                <span>{vNUBAN.customerReference}</span>
              </span>
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2">
                <p className="font-medium">Product Type:</p>
                <span>{vNUBAN.productType}</span>
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
                  {vNUBAN.updatedAt
                    ? new Date(vNUBAN.updatedAt).toLocaleString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : vNUBAN.createdAt}{" "}
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