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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter, Search, ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import SettlementDetailsModal from "./SettlementDetailsModal";
import View from "@/components/svg Icons/View";
import Download from "@/components/svg Icons/Download";
import Empty from "@/components/svg Icons/Empty";
import Loader from "@/components/svg Icons/loader";

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

interface SettlementsResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: {
    totalElements: number;
    totalPages: number;
    size: number;
    content: Settlement[];
    number: number;
    first: boolean;
    last: boolean;
  };
  error?: string;
  detail?: string;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response?: any;
}

export function SettlementTable() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
    status: "",
    search: "",
    merchantOrgId: "",
    sortBy: "createdAt",
    sortOrder: "asc",
  });
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);

  const fetchSettlements = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {
        page: currentPage.toString(),
        size: "10",
        sortBy: filter.sortBy || "createdAt",
        sortOrder: filter.sortOrder || "asc",
      };
      if (filter.search) params.search = filter.search;
      else if (searchTerm) params.search = searchTerm;
      if (filter.status) params.status = filter.status;
      if (filter.startDate) params.startDate = filter.startDate;
      if (filter.endDate) params.endDate = filter.endDate;
      if (filter.merchantOrgId) params.merchantOrgId = filter.merchantOrgId;

      const queryString = new URLSearchParams(params).toString();
      console.log("Frontend GET Request URL:", `/api/reports/settlements?${queryString}`);
      const res = await fetch(`/api/reports/settlements?${queryString}`);
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
      const data: SettlementsResponse = await res.json();
      console.log("API Response:", JSON.stringify(data, null, 2));

      if (data.status) {
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedSettlements = data.data.content.map((s: any, index: number) => ({
          sN: data.data.number * 10 + index + 1,
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
        }));
        setSettlements(mappedSettlements);
        setTotalPages(data.data.totalPages);
        setTotalElements(data.data.totalElements);
      } else {
        setError(data.detail || data.error || data.message || "Failed to fetch settlements");
        console.error("API Error Details:", data);
      }
    } 
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      console.error("Error fetching settlements:", error);
      setError(error.message || "Failed to fetch settlements due to network or server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, [currentPage, filter, searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 3) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      if (currentPage > 2) pages.push(currentPage - 1, currentPage);
      else pages.push(1);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages - 1);
    }
    return pages;
  };

  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0][0];
  };

  const handleResetDate = () => setFilter((prev) => ({ ...prev, startDate: "", endDate: "" }));
  const handleResetSearch = () => setFilter((prev) => ({ ...prev, search: "" }));
  const handleResetStatus = () => setFilter((prev) => ({ ...prev, status: "" }));
  const handleResetMerchantOrgId = () => setFilter((prev) => ({ ...prev, merchantOrgId: "" }));
  const handleResetSort = () => setFilter((prev) => ({ ...prev, sortBy: "createdAt", sortOrder: "asc" }));
  const handleResetAll = () =>
    setFilter({
      startDate: "",
      endDate: "",
      status: "",
      search: "",
      merchantOrgId: "",
      sortBy: "createdAt",
      sortOrder: "asc",
    });

  const handleApplyFilters = () => {
    fetchSettlements();
  };

  function DatePicker({
    id,
    date,
    onSelect,
    placeholder,
  }: {
    id: string;
    date: string;
    onSelect: (date: string) => void;
    placeholder: string;
  }) {
    const [open, setOpen] = useState(false);
    const [month, setMonth] = useState<Date | undefined>(date ? new Date(date) : undefined);

    const handleSelect = (selectedDate: Date | undefined) => {
      onSelect(selectedDate ? selectedDate.toISOString().split("T")[0] : "");
      if (selectedDate) setMonth(selectedDate);
      setOpen(false);
    };

    return (
      <div className="flex flex-col gap-1">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant="outline"
              className="w-full justify-start text-left font-normal pl-3 pr-10 py-2 border rounded-md text-sm bg-[#F8F8F8] dark:bg-gray-700"
            >
              <span>
                {date
                  ? new Date(date).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
                  : placeholder}
              </span>
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-30" align="start">
            <Calendar
              mode="single"
              selected={date ? new Date(date) : undefined}
              onSelect={handleSelect}
              month={month}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {error && <div className="text-red-500 text-center my-4">{error}</div>}
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
                      <label htmlFor="start-date" className="text-xs text-gray-400 dark:text-gray-100">
                        From:
                      </label>
                      <DatePicker
                        id="start-date"
                        date={filter.startDate}
                        onSelect={(date) => setFilter((prev) => ({ ...prev, startDate: date }))}
                        placeholder="YY/MM/DD"
                      />
                    </div>
                    <div className="relative flex-1">
                      <label htmlFor="end-date" className="text-xs text-gray-400 dark:text-gray-100">
                        To:
                      </label>
                      <DatePicker
                        id="end-date"
                        date={filter.endDate}
                        onSelect={(date) => setFilter((prev) => ({ ...prev, endDate: date }))}
                        placeholder="YY/MM/DD"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm">Search</label>
                    <Button variant="link" className="text-red-500 p-0 h-auto" onClick={handleResetSearch}>
                      Reset
                    </Button>
                  </div>
                  <Input
                    value={filter.search}
                    onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
                    placeholder="Search Merchant, Source Account..."
                    className="w-full bg-[#F8F8F8] dark:bg-gray-700 border-0 rounded"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm">Merchant Org ID</label>
                    <Button variant="link" className="text-red-500 p-0 h-auto" onClick={handleResetMerchantOrgId}>
                      Reset
                    </Button>
                  </div>
                  <Input
                    value={filter.merchantOrgId}
                    onChange={(e) => setFilter((prev) => ({ ...prev, merchantOrgId: e.target.value }))}
                    placeholder="Enter Merchant Org ID"
                    className="w-full bg-[#F8F8F8] dark:bg-gray-700 border-0 rounded"
                  />
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
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Successful">
                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: "#4CAF50" }} />
                        Successful
                      </SelectItem>
                      <SelectItem value="Failed">
                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: "#FF4444" }} />
                        Failed
                      </SelectItem>
                      <SelectItem value="Processing">
                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: "#FF8C00" }} />
                        Processing
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm">Sort By</label>
                    <Button variant="link" className="text-red-500 p-0 h-auto" onClick={handleResetSort}>
                      Reset
                    </Button>
                  </div>
                  <Select
                    value={filter.sortBy + (filter.sortOrder === "asc" ? "" : "Desc")}
                    onValueChange={(value) =>
                      setFilter((prev) => ({
                        ...prev,
                        sortBy: value.includes("Desc") ? value.replace("Desc", "") : value,
                        sortOrder: value.includes("Desc") ? "desc" : "asc",
                      }))
                    }
                  >
                    <SelectTrigger className="w-full bg-[#F8F8F8] dark:bg-gray-700 border-0 rounded">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Created At (Asc)</SelectItem>
                      <SelectItem value="createdAtDesc">Created At (Desc)</SelectItem>
                      <SelectItem value="amount">Amount (Asc)</SelectItem>
                      <SelectItem value="amountDesc">Amount (Desc)</SelectItem>
                      <SelectItem value="status">Status (Asc)</SelectItem>
                      <SelectItem value="statusDesc">Status (Desc)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={handleResetAll}>
                    Reset All
                  </Button>
                  <Button className="bg-red-500 text-white hover:bg-red-600" onClick={handleApplyFilters}>
                    Apply Now
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative w-[300px]">
            <Input
              placeholder="Search Merchant, Source Account..."
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
            disabled={currentPage === 0}
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
                  disabled={page === "..." || page === currentPage}
                >
                  {Number(page) + 1}
                </Button>
              )}
            </span>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
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
              {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                <SelectItem key={page} value={page.toString()}>
                  {page + 1}
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
              <TableHead>Merchant</TableHead>
              <TableHead>Source Account</TableHead>
              <TableHead>Destination Account</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="relative w-17 p-4 h-17 mx-auto my-5">
                    <div className="absolute inset-0 border-4 border-transparent border-t-[#C80000] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center m-3 justify-center">
                      <Loader />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : settlements.length > 0 ? (
              settlements.map((item) => (
                <TableRow key={item.sN}>
                  <TableCell>{item.sN}</TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src="https://via.placeholder.com/100" alt={item.merchantName} />
                      <AvatarFallback>{getInitials(item.merchantName)}</AvatarFallback>
                    </Avatar>
                    <span>{item.merchantName}</span>
                  </TableCell>
                  <TableCell>{item.sourceAccount}</TableCell>
                  <TableCell>{item.destinationAccount}</TableCell>
                  <TableCell>₦{item.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className="flex items-center">
                      <span
                        className="w-2 h-2 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            item.status === "Successful"
                              ? "#4CAF50"
                              : item.status === "Processing"
                              ? "#FF8C00"
                              : "#FF4444",
                        }}
                      />
                      <span
                        style={{
                          color:
                            item.status === "Successful"
                              ? "#4CAF50"
                              : item.status === "Processing"
                              ? "#FF8C00"
                              : "#FF4444",
                        }}
                      >
                        {item.status}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell>{item.createdAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <BsThreeDots className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setSelectedSettlement(item)}>
                          <View /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log("Download", item.sN)}>
                          <Download /> Download
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="text-center flex flex-col items-center gap-4 m-3 p-3">
                    <Empty />
                    <p className="text-muted-foreground">No settlements found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <SettlementDetailsModal
        isOpen={!!selectedSettlement}
        onClose={() => setSelectedSettlement(null)}
        settlement={selectedSettlement}
        setSelectedSettlement={setSelectedSettlement}
        currentPage={currentPage}
        totalElements={totalElements}
        filters={{
          startDate: filter.startDate,
          endDate: filter.endDate,
          status: filter.status,
          search: filter.search,
          merchantOrgId: filter.merchantOrgId,
          sortBy: filter.sortBy,
          sortOrder: filter.sortOrder,
          searchTerm,
        }}
      />
    </div>
  );
}