"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Filter, Search, ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import View from "@/components/svg Icons/View";
import Download from "@/components/svg Icons/Download";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

interface Merchant {
  id?: string;
  sN: string;
  merchantName: string;
  code: string;
  accountName: string;
  accountNumber: string;
  primaryContact: string;
  contactName?: string;
  contactEmail?: string;
  status: string;
  noOfUsers: number;
  createdAt: string;
  productPrefix?: string;
}

interface MerchantTableProps {
  refreshKey: number;
}

export function MerchantTable({ refreshKey }: MerchantTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    status: "",
    sortBy: "default",
  });
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const itemsPerPage = 10;
  const router = useRouter();

  const fetchMerchants = async () => {
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: (currentPage - 1).toString(),
        size: itemsPerPage.toString(),
        sortBy: "createdAt",
        sortOrder: "ASC",
        ...(searchTerm && { search: searchTerm }),
        ...(filter.status && { status: filter.status }),
        ...(filter.fromDate && { startDate: filter.fromDate.toISOString().split("T")[0] }),
        ...(filter.toDate && { endDate: filter.toDate.toISOString().split("T")[0] }),
      });
      console.log("Frontend GET Request URL:", `/api/reports/organizations?${queryParams}`);

      const response = await fetch(`/api/reports/organizations?${queryParams}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1]}`,
        },
      });
      const data = await response.json();
      console.log("API Response:", JSON.stringify(data, null, 2));

      if (response.ok && data.status) {
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedMerchants = data.data.content.map((item: any) => ({
          sN: item.id || String(Math.random().toString(36).substr(2, 9)),
          merchantName: item.organizationName || "N/A",
          code: item.productPrefix || `MCH-${item.id?.slice(-6) || String(Math.random().toString(36).substr(2, 6))}`,
          accountName: item.settlementAccountName || "N/A",
          accountNumber: item.settlementAccountNumber || "N/A",
          primaryContact: `${item.contactFirstName || ""} ${item.contactLastName || ""}`.trim() || item.contactEmail || "N/A",
          status: item.orgStatus || "Unknown",
          noOfUsers: item.noOfUsers || 0,
          createdAt: item.createdAt
            ? new Date(item.createdAt).toLocaleString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A",
        }));
        setMerchants(mappedMerchants);
        setTotalPages(data.data.totalPages || 1);
      } else {
        setError(data.detail || data.error || "Failed to fetch merchants");
        setMerchants([]);
        toast.error("Failed to fetch merchants");
      }
    } catch (err) {
      setError("Network or server error");
      setMerchants([]);
      toast.error("Network or server error");
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, [currentPage, searchTerm, filter, refreshKey]);

  const filteredData = merchants.filter((item) => {
    const matchesSearch =
      item.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.primaryContact.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    switch (filter.sortBy) {
      case "merchant-a-z":
        return a.merchantName.localeCompare(b.merchantName);
      case "merchant-z-a":
        return b.merchantName.localeCompare(a.merchantName);
      case "status-active-first":
        return a.status === "Active" ? -1 : b.status === "Active" ? 1 : 0;
      case "status-inactive-first":
        return a.status === "Inactive" ? -1 : b.status === "Inactive" ? 1 : 0;
      default:
        return 0;
    }
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push(...[currentPage - 1, currentPage]);
      else pages.push(2);
      if (currentPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0]?.[0] || "N/A";
  };

  const handleResetDate = () => setFilter((prev) => ({ ...prev, fromDate: undefined, toDate: undefined }));
  const handleResetStatus = () => setFilter((prev) => ({ ...prev, status: "" }));
  const handleResetSort = () => setFilter((prev) => ({ ...prev, sortBy: "default" }));
  const handleResetAll = () => setFilter({ fromDate: undefined, toDate: undefined, status: "", sortBy: "default" });

  return (
    <div className="w-full relative">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="flex justify-between items-center mb-4 space-x-4">
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 bg-[#F8F8F8] dark:bg-background">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-84 bg-white dark:bg-background border rounded-lg shadow-lg p-4">
              <DropdownMenuLabel>Filter</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm">Date Range</label>
                    <Button variant="link" className="text-red-500 p-0 h-auto" onClick={handleResetDate}>
                      Reset
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <label htmlFor="from-date" className="text-xs text-gray-400 dark:text-gray-100">
                        From:
                      </label>
                      <div className="flex flex-col gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="from-date"
                              variant="outline"
                              className="w-full justify-start text-left font-normal pl-3 pr-10 py-2 border rounded-md text-sm bg-[#F8F8F8] dark:bg-gray-700"
                            >
                              <span>
                                {filter.fromDate
                                  ? filter.fromDate.toLocaleDateString("en-US", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "YY/MM/DD"}
                              </span>
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-30" align="start">
                            <Calendar
                              mode="single"
                              selected={filter.fromDate}
                              onSelect={(date) => setFilter((prev) => ({ ...prev, fromDate: date }))}
                              month={filter.fromDate}
                              className="rounded-md border"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="relative flex-1">
                      <label htmlFor="to-date" className="text-xs text-gray-400 dark:text-gray-100">
                        To:
                      </label>
                      <div className="flex flex-col gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="to-date"
                              variant="outline"
                              className="w-full justify-start text-left font-normal pl-3 pr-10 py-2 border rounded-md text-sm bg-[#F8F8F8] dark:bg-gray-700"
                            >
                              <span>
                                {filter.toDate
                                  ? filter.toDate.toLocaleDateString("en-US", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "YY/MM/DD"}
                              </span>
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-30" align="start">
                            <Calendar
                              mode="single"
                              selected={filter.toDate}
                              onSelect={(date) => setFilter((prev) => ({ ...prev, toDate: date }))}
                              month={filter.toDate}
                              className="rounded-md border"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm">Sort By</label>
                    <Button variant="link" className="text-red-500 p-0 h-auto" onClick={handleResetSort}>
                      Reset
                    </Button>
                  </div>
                  <Select
                    value={filter.sortBy}
                    onValueChange={(value) => setFilter((prev) => ({ ...prev, sortBy: value }))}
                  >
                    <SelectTrigger className="w-full bg-[#F8F8F8] dark:bg-gray-700 border-0 rounded">
                      <SelectValue placeholder="A-Z" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="merchant-a-z">Merchant (A-Z)</SelectItem>
                      <SelectItem value="merchant-z-a">Merchant (Z-A)</SelectItem>
                      <SelectItem value="status-active-first">Status (Active First)</SelectItem>
                      <SelectItem value="status-inactive-first">Status (Inactive First)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm">Status</label>
                    <Button variant="link" className="text-red-500 p-0 h-auto" onClick={handleResetStatus}>
                      Reset
                    </Button>
                  </div>
                  <Select
                    value={filter.status}
                    onValueChange={(value) => setFilter((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="w-full bg-[#F8F8F8] dark:bg-gray-700 border-0 rounded">
                      <SelectValue placeholder="Active" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">
                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: "#4CAF50" }} />
                        Active
                      </SelectItem>
                      <SelectItem value="Inactive">
                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: "#FF4444" }} />
                        Inactive
                      </SelectItem>
                      <SelectItem value="Unknown">
                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: "#808080" }} />
                        Unknown
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={handleResetAll}>
                    Reset All
                  </Button>
                  <Button className="bg-red-500 text-white hover:bg-red-600" onClick={fetchMerchants}>
                    Apply Now
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative w-[300px]">
            <Input
              placeholder="Search Merchant, Account Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-3 pr-10 bg-[#F8F8F8] dark:bg-background border-0"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {getPageNumbers().map((page, index) => (
            <span key={index}>
              {page === "..." ? (
                <span className="px-2">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(Number(page))}
                  disabled={page === currentPage}
                >
                  {page}
                </Button>
              )}
            </span>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span>Go to Page:</span>
          <Select
            value={currentPage.toString()}
            onValueChange={(value) => handlePageChange(parseInt(value))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder={currentPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <SelectItem key={page} value={page.toString()}>
                  {page}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader className="bg-[#F5F5F5] dark:bg-background">
            <TableRow>
              <TableHead>S/N</TableHead>
              <TableHead>Merchant Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Account Name</TableHead>
              <TableHead>Account Number</TableHead>
              <TableHead>Primary Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>No. of Users</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.sN}>
                <TableCell>{item.sN}</TableCell>
                <TableCell className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src="/images/avatar-placeholder.jpg" alt={item.merchantName} />
                    <AvatarFallback>{getInitials(item.merchantName)}</AvatarFallback>
                  </Avatar>
                  <span>{item.merchantName}</span>
                </TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.accountName}</TableCell>
                <TableCell>{item.accountNumber}</TableCell>
                <TableCell>{item.primaryContact}</TableCell>
                <TableCell>
                  <span className="flex items-center">
                    <span
                      className="w-2 h-2 rounded-full mr-2"
                      style={{
                        backgroundColor:
                          item.status === "Active" ? "#4CAF50" : item.status === "Inactive" ? "#FF4444" : "#808080",
                      }}
                    />
                    <span
                      style={{
                        color:
                          item.status === "Active" ? "#4CAF50" : item.status === "Inactive" ? "#FF4444" : "#808080",
                      }}
                    >
                      {item.status}
                    </span>
                  </span>
                </TableCell>
                <TableCell>{item.noOfUsers}</TableCell>
                <TableCell>{item.createdAt}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <BsThreeDots className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => router.push(`/merchant/profile/${item.sN}`)}>
                        <View /> View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={async () => {
                          try {
                            const response = await fetch(`/api/export-merchant?id=${item.sN}`, {
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${document.cookie
                                  .split("; ")
                                  .find((row) => row.startsWith("accessToken="))
                                  ?.split("=")[1]}`,
                              },
                            });
                            if (!response.ok) throw new Error("Export failed");
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `merchant_${item.code}.csv`;
                            a.click();
                            window.URL.revokeObjectURL(url);
                            toast.success("Export successful! Check your downloads.");
                          } catch (error) {
                            console.error("Export error:", error);
                            toast.error("Export failed. Please try again later.");
                          }
                        }}
                      >
                        <Download /> Download
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Toaster />
    </div>
  );
}