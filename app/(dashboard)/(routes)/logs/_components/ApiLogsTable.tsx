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
import { Filter, Search, ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import View from "@/components/svg Icons/View";
import Download from "@/components/svg Icons/Download";
import { BsThreeDots } from "react-icons/bs";
import ApiLogDetailsModal from "./ApiLogsDetailsModal";
import Empty from "@/components/svg Icons/Empty";
import Loader from "@/components/svg Icons/loader";

interface ApiLog {
  sN: number;
  id: string;
  merchantPrefix: string;
  requestTimestamp: string;
  responseTimestamp: string;
  service: string;
  responseStatus: number;
  createdAt: string;
  // Additional fields for modal compatibility
  logId: string;
  merchantCode: string;
  timestamp: string;
  user: string;
  email: string;
  transactionReference: string;
  customerReference: string;
  clientIP: string;
  requestPayload: string;
  responseBody: string;
}

interface ApiLogResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: {
    totalElements: number;
    totalPages: number;
    size: number;
    content: {
      id: string;
      merchantPrefix: string;
      requestTimestamp: string;
      responseTimestamp: string;
      service: string;
      responseStatus: number;
      createdAt: string;
    }[];
    number: number;
    first: boolean;
    last: boolean;
  };
}

export function ApiLogsTable() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    merchantOrgId: "",
    startDate: "",
    endDate: "",
    status: "",
    sortBy: "createdAt",
    sortOrder: "DESC",
  });
  const [apiLogs, setApiLogs] = useState<ApiLog[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ApiLog | null>(null);

  const fetchApiLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {
        page: currentPage.toString(),
        size: "10",
        sortBy: filter.sortBy || "createdAt",
        sortOrder: filter.sortOrder || "DESC",
      };

      if (searchTerm) params.search = searchTerm;
      if (filter.merchantOrgId) params.merchantOrgId = filter.merchantOrgId;
      if (filter.startDate) params.startDate = filter.startDate;
      if (filter.endDate) params.endDate = filter.endDate;
      if (filter.status) params.status = filter.status;

      const queryString = new URLSearchParams(params).toString();
      console.log("Frontend Request URL:", `/api/api-logs?${queryString}`);
      
      const res = await fetch(`/api/reports/api-logs?${queryString}`);
      const data: ApiLogResponse = await res.json();
      console.log("API Response:", JSON.stringify(data, null, 2));

      if (data.status) {
        const mappedLogs = data.data.content.map((log, index) => ({
          sN: data.data.number * 10 + index + 1,
          id: log.id,
          merchantPrefix: log.merchantPrefix || "",
          requestTimestamp: log.requestTimestamp
            ? new Date(log.requestTimestamp).toLocaleString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          responseTimestamp: log.responseTimestamp
            ? new Date(log.responseTimestamp).toLocaleString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          service: log.service || "",
          responseStatus: log.responseStatus || 0,
          createdAt: log.createdAt
            ? new Date(log.createdAt).toLocaleString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          // Modal compatibility fields
          logId: log.id,
          merchantCode: log.merchantPrefix,
          timestamp: log.createdAt
            ? new Date(log.createdAt).toLocaleString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          user: "System User", // Default value as API doesn't provide this
          email: "system@api.com", // Default value as API doesn't provide this
          transactionReference: "", // Default value as API doesn't provide this
          customerReference: "", // Default value as API doesn't provide this
          clientIP: "", // Default value as API doesn't provide this
          requestPayload: "", // Default value as API doesn't provide this
          responseBody: "", // Default value as API doesn't provide this
        }));

        setApiLogs(mappedLogs);
        setTotalPages(data.data.totalPages);
        setTotalElements(data.data.totalElements);
      } else {
        setError(data.message || "Failed to fetch API logs");
      }
    } catch (error) {
      console.error("Error fetching API logs:", error);
      setError("Failed to fetch API logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiLogs();
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

  const handleResetDate = () => setFilter((prev) => ({ ...prev, startDate: "", endDate: "" }));
  const handleResetStatus = () => setFilter((prev) => ({ ...prev, status: "" }));
  const handleResetSort = () => setFilter((prev) => ({ ...prev, sortBy: "createdAt", sortOrder: "DESC" }));
  const handleResetAll = () => {
    setFilter({
      merchantOrgId: "",
      startDate: "",
      endDate: "",
      status: "",
      sortBy: "createdAt",
      sortOrder: "DESC",
    });
    setSearchTerm("");
  };

  const handleApplyFilters = () => {
    setCurrentPage(0); // Reset to first page when applying filters
    fetchApiLogs();
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

  const handleViewLog = (log: ApiLog) => {
    setSelectedLog(log);
    setIsDetailsModalOpen(true);
  };

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
                      <label htmlFor="from-date" className="text-xs text-gray-400 dark:text-gray-100">
                        From:
                      </label>
                      <DatePicker
                        id="from-date"
                        date={filter.startDate}
                        onSelect={(date) => setFilter((prev) => ({ ...prev, startDate: date }))}
                        placeholder="YY/MM/DD"
                      />
                    </div>
                    <div className="relative flex-1">
                      <label htmlFor="to-date" className="text-xs text-gray-400 dark:text-gray-100">
                        To:
                      </label>
                      <DatePicker
                        id="to-date"
                        date={filter.endDate}
                        onSelect={(date) => setFilter((prev) => ({ ...prev, endDate: date }))}
                        placeholder="YY/MM/DD"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm">Merchant Org ID</label>
                    <Button
                      variant="link"
                      className="text-red-500 p-0 h-auto"
                      onClick={() => setFilter((prev) => ({ ...prev, merchantOrgId: "" }))}
                    >
                      Reset
                    </Button>
                  </div>
                  <Input
                    value={filter.merchantOrgId}
                    onChange={(e) => setFilter((prev) => ({ ...prev, merchantOrgId: e.target.value }))}
                    placeholder="Merchant Org ID"
                    className="w-full bg-[#F8F8F8] dark:bg-gray-700 border-0 rounded"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm">Sort By</label>
                    <Button variant="link" className="text-red-500 p-0 h-auto" onClick={handleResetSort}>
                      Reset
                    </Button>
                  </div>
                  <Select
                    value={`${filter.sortBy}-${filter.sortOrder}`}
                    onValueChange={(value) => {
                      const [sortBy, sortOrder] = value.split("-");
                      setFilter((prev) => ({ ...prev, sortBy, sortOrder }));
                    }}
                  >
                    <SelectTrigger className="w-full bg-[#F8F8F8] dark:bg-gray-700 border-0 rounded">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt-DESC">Created At (Newest First)</SelectItem>
                      <SelectItem value="createdAt-ASC">Created At (Oldest First)</SelectItem>
                      <SelectItem value="requestTimestamp-DESC">Request Timestamp (Newest First)</SelectItem>
                      <SelectItem value="requestTimestamp-ASC">Request Timestamp (Oldest First)</SelectItem>
                      <SelectItem value="responseStatus-ASC">Response Status (Low to High)</SelectItem>
                      <SelectItem value="responseStatus-DESC">Response Status (High to Low)</SelectItem>
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
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="200">200s</SelectItem>
                      <SelectItem value="400">400s</SelectItem>
                      <SelectItem value="500">500s</SelectItem>
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
              placeholder="Search Merchant Code..."
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
              <SelectValue placeholder={(currentPage + 1).toString()} />
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
              <TableHead>Merchant Code</TableHead>
              <TableHead>Request Timestamp</TableHead>
              <TableHead>Response Timestamp</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Response Status</TableHead>
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
            ) : apiLogs.length > 0 ? (
              apiLogs.map((item) => (
                <TableRow key={item.sN}>
                  <TableCell>{item.sN}</TableCell>
                  <TableCell>{item.merchantPrefix}</TableCell>
                  <TableCell>{item.requestTimestamp}</TableCell>
                  <TableCell>{item.responseTimestamp}</TableCell>
                  <TableCell>{item.service}</TableCell>
                  <TableCell>
                    <span className="flex items-center">
                      <span
                        className="w-2 h-2 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            item.responseStatus >= 200 && item.responseStatus < 300 ? "#4CAF50" :
                            item.responseStatus >= 400 && item.responseStatus < 500 ? "#FF8C00" :
                            item.responseStatus >= 500 && item.responseStatus < 600 ? "#FF4444" : "#000000",
                        }}
                      />
                      <span
                        style={{
                          color:
                            item.responseStatus >= 200 && item.responseStatus < 300 ? "#4CAF50" :
                            item.responseStatus >= 400 && item.responseStatus < 500 ? "#FF8C00" :
                            item.responseStatus >= 500 && item.responseStatus < 600 ? "#FF4444" : "#000000",
                        }}
                      >
                        {item.responseStatus}
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
                        <DropdownMenuItem onClick={() => handleViewLog(item)}>
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
                    <p className="text-muted-foreground">No API logs found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <ApiLogDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        log={selectedLog}
        setSelectedLog={setSelectedLog}
        logs={apiLogs}
      />
    </div>
  );
}