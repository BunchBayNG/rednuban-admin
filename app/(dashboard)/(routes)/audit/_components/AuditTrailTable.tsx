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
import Empty from "@/components/svg Icons/Empty";
import Loader from "@/components/svg Icons/loader";

interface AuditLog {
  id: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  userId: string;
  userName: string;
  email: string;
  userRole: string;
  userIpAddress: string;
  merchantName: string;
  merchantOrganization: string;
  merchantOrgId: string;
  event: string;
  userType: string;
  description: string;
  deleted: boolean;
}

interface AuditResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: {
    totalElements: number;
    totalPages: number;
    size: number;
    content: AuditLog[];
    number: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
  };
}

export function AuditTrailTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    userType: "All",
    event: "All",
    merchantName: "",
    merchantOrgId: "",
    status: "All",
    sortBy: "createdAt",
    sortOrder: "DESC",
  });
  const [data, setData] = useState<AuditResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAuditLogs = async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: (currentPage - 1).toString(), // API uses 0-based page
        size: itemsPerPage.toString(),
        search: searchTerm,
        merchantOrgId: filter.merchantOrgId,
        startDate: filter.fromDate ? formatDate(filter.fromDate) : "",
        endDate: filter.toDate ? formatDate(filter.toDate) : "",
        status: filter.status !== "All" ? filter.status : "",
        sortBy: filter.sortBy,
        sortOrder: filter.sortOrder,
      });

      const url = `/api/audit-log?${params.toString()}`;
      console.log("Client-side: Fetching audit logs", { url, queryParams: Object.fromEntries(params) });

      try {
        const response = await fetch(`${url}&cacheBust=${Date.now()}`, {
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        let result: AuditResponse;
        const text = await response.text();
        try {
          result = JSON.parse(text);
        } catch (error) {
          console.error("Client-side: Invalid JSON response", { status: response.status, text: text.slice(0, 100) });
          throw new Error(`Invalid response: Not JSON (status ${response.status})`);
        }

        console.log("Client-side: Audit logs response", {
          status: response.status,
          body: JSON.stringify(result, null, 2),
        });

        if (!response.ok) {
          throw new Error(`API error: ${result.message || "Unknown"} (status ${result.statusCode})`);
        }

        if (!result.status) {
          throw new Error(result.message || `Failed to fetch audit logs (status ${response.status})`);
        }

        setData(result);
      } catch (err: any) {
        console.error("Client-side: Error fetching audit logs", {
          message: err.message || "Unknown error",
          stack: err.stack || "No stack",
        });
        setError(err.message || "Failed to fetch audit logs");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, [currentPage, searchTerm, filter]);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const filteredData = data?.data.content
    ?.filter((item) => {
      const matchesSearch =
        item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.event.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    ?.sort((a, b) => {
      switch (filter.sortBy) {
        case "userName":
          return filter.sortOrder === "ASC" ? a.userName.localeCompare(b.userName) : b.userName.localeCompare(a.userName);
        case "createdAt":
          return filter.sortOrder === "ASC" ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    }) || [];

  const totalPages = data?.data.totalPages || 1;

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleResetDate = () => setFilter((prev) => ({ ...prev, fromDate: undefined, toDate: undefined }));
  const handleResetUserType = () => setFilter((prev) => ({ ...prev, userType: "All" }));
  const handleResetEvent = () => setFilter((prev) => ({ ...prev, event: "All" }));
  const handleResetMerchantName = () => setFilter((prev) => ({ ...prev, merchantName: "" }));
  const handleResetMerchantId = () => setFilter((prev) => ({ ...prev, merchantOrgId: "" }));
  const handleResetStatus = () => setFilter((prev) => ({ ...prev, status: "All" }));
  const handleResetAll = () =>
    setFilter({
      fromDate: undefined,
      toDate: undefined,
      userType: "All",
      event: "All",
      merchantName: "",
      merchantOrgId: "",
      status: "All",
      sortBy: "createdAt",
      sortOrder: "DESC",
    });

  function DatePicker({
    id,
    date,
    onSelect,
    placeholder,
  }: {
    id: string;
    date: Date | undefined;
    onSelect: (date: Date | undefined) => void;
    placeholder: string;
  }) {
    const [open, setOpen] = useState(false);
    const [month, setMonth] = useState<Date | undefined>(date);

    const handleSelect = (selectedDate: Date | undefined) => {
      onSelect(selectedDate);
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
                {date ? date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : placeholder}
              </span>
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-30" align="start">
            <Calendar
              mode="single"
              selected={date}
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
                        date={filter.fromDate}
                        onSelect={(date) => setFilter((prev) => ({ ...prev, fromDate: date }))}
                        placeholder="YY/MM/DD"
                      />
                    </div>
                    <div className="relative flex-1">
                      <label htmlFor="to-date" className="text-xs text-gray-400 dark:text-gray-100">
                        To:
                      </label>
                      <DatePicker
                        id="to-date"
                        date={filter.toDate}
                        onSelect={(date) => setFilter((prev) => ({ ...prev, toDate: date }))}
                        placeholder="YY/MM/DD"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm">User Type</label>
                    <Button variant="link" className="text-red-500 p-0 h-auto" onClick={handleResetUserType}>
                      Reset
                    </Button>
                  </div>
                  <Select
                    value={filter.userType}
                    onValueChange={(value) => setFilter((prev) => ({ ...prev, userType: value }))}
                  >
                    <SelectTrigger className="w-full bg-[#F8F8F8] dark:bg-gray-700 border-0 rounded">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Merchant User">Merchant User</SelectItem>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Merchant Access">Merchant Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm">Event</label>
                    <Button variant="link" className="text-red-500 p-0 h-auto" onClick={handleResetEvent}>
                      Reset
                    </Button>
                  </div>
                  <Select
                    value={filter.event}
                    onValueChange={(value) => setFilter((prev) => ({ ...prev, event: value }))}
                  >
                    <SelectTrigger className="w-full bg-[#F8F8F8] dark:bg-gray-700 border-0 rounded">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="User Login">User Login</SelectItem>
                      <SelectItem value="Failed Login Attempt">Failed Login Attempt</SelectItem>
                      <SelectItem value="User Logout">User Logout</SelectItem>
                      <SelectItem value="Profile Update">Profile Update</SelectItem>
                      <SelectItem value="Role Assignment">Role Assignment</SelectItem>
                      <SelectItem value="Merchant Creation">Merchant Creation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm">Merchant Name</label>
                    <Button variant="link" className="text-red-500 p-0 h-auto" onClick={handleResetMerchantName}>
                      Reset
                    </Button>
                  </div>
                  <Input
                    value={filter.merchantName}
                    onChange={(e) => setFilter((prev) => ({ ...prev, merchantName: e.target.value }))}
                    placeholder="Enter merchant name"
                    className="bg-[#F8F8F8] dark:bg-gray-700 border-0 rounded"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm">Merchant Org ID</label>
                    <Button variant="link" className="text-red-500 p-0 h-auto" onClick={handleResetMerchantId}>
                      Reset
                    </Button>
                  </div>
                  <Input
                    value={filter.merchantOrgId}
                    onChange={(e) => setFilter((prev) => ({ ...prev, merchantOrgId: e.target.value }))}
                    placeholder="Enter merchant Org ID"
                    className="bg-[#F8F8F8] dark:bg-gray-700 border-0 rounded"
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
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="SUCCESS">SUCCESS</SelectItem>
                      <SelectItem value="FAILED">FAILED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm">Sort By</label>
                  <Select
                    value={`${filter.sortBy}-${filter.sortOrder}`}
                    onValueChange={(value) => {
                      const [sortBy, sortOrder] = value.split("-");
                      setFilter((prev) => ({ ...prev, sortBy, sortOrder }));
                    }}
                  >
                    <SelectTrigger className="w-full bg-[#F8F8F8] dark:bg-gray-700 border-0 rounded">
                      <SelectValue placeholder="Sort by createdAt (DESC)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt-ASC">Created At (ASC)</SelectItem>
                      <SelectItem value="createdAt-DESC">Created At (DESC)</SelectItem>
                      <SelectItem value="userName-ASC">User Name (ASC)</SelectItem>
                      <SelectItem value="userName-DESC">User Name (DESC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={handleResetAll}>
                    Reset All
                  </Button>
                  <Button className="bg-red-500 text-white hover:bg-red-600" onClick={() => setCurrentPage(1)}>
                    Apply Now
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative w-[300px]">
            <Input
              placeholder="Search User, Merchant, Event..."
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
                  disabled={page === "..." || page === currentPage}
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
              <TableHead>User</TableHead>
              <TableHead>User Role</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                <div className="relative w-17 p-4 h-17 mx-auto my-5">
                    <div className="absolute inset-0 border-4 border-transparent border-t-[#C80000] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center m-3 justify-center">
                      <Loader />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-red-500">
                  Error: {error}
                </TableCell>
              </TableRow>
            ) : data?.data.content.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                <div className="text-center flex flex-col items-center gap-4 m-3 p-3">
                    <Empty />
                    <p className="text-muted-foreground">No audit logs found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data?.data.content.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell>{item.userName}</TableCell>
                  <TableCell>{item.userRole}</TableCell>
                  <TableCell>{item.merchantName || "N/A"}</TableCell>
                  <TableCell>{item.event}</TableCell>
                  <TableCell>{item.description || item.event} {item.deleted ? "(Deleted)" : item.userIpAddress ? "(IP: " + item.userIpAddress + ")" : ""}</TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}