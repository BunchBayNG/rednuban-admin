
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
import { useState } from "react";
import { apiLogsData } from "@/lib/MockData";
import View from "@/components/svg Icons/View";
import Download from "@/components/svg Icons/Download";
import { BsThreeDots } from "react-icons/bs";

export function ApiLogsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    status: "All",
    sortBy: "default",
  });
  const itemsPerPage = 10;
  const totalItems = apiLogsData.length;

  // Filter and sort data
  const filteredData = apiLogsData.filter((item) => {
    const matchesSearch = item.merchantCode.includes(searchTerm);
    const matchesDate =
      (!filter.fromDate || new Date(item.timestamp) >= filter.fromDate) &&
      (!filter.toDate || new Date(item.timestamp) <= filter.toDate);
    const matchesStatus =
      filter.status === "All" ||
      (filter.status === "200s" && item.responseStatus >= 200 && item.responseStatus < 300) ||
      (filter.status === "400s" && item.responseStatus >= 400 && item.responseStatus < 500) ||
      (filter.status === "500s" && item.responseStatus >= 500 && item.responseStatus < 600);
    return matchesSearch && matchesDate && matchesStatus;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    switch (filter.sortBy) {
      case "merchant-newest":
        return b.merchantCode.localeCompare(a.merchantCode);
      case "merchant-oldest":
        return a.merchantCode.localeCompare(b.merchantCode);
      case "request-newest":
        return new Date(b.requestTimestamp).getTime() - new Date(a.requestTimestamp).getTime();
      case "request-oldest":
        return new Date(a.requestTimestamp).getTime() - new Date(b.requestTimestamp).getTime();
      case "status-low-high":
        return a.responseStatus - b.responseStatus;
      case "status-high-low":
        return b.responseStatus - a.responseStatus;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);
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

  const handleResetDate = () => setFilter((prev) => ({ ...prev, fromDate: undefined, toDate: undefined }));
  const handleResetStatus = () => setFilter((prev) => ({ ...prev, status: "All" }));
  const handleResetSort = () => setFilter((prev) => ({ ...prev, sortBy: "default" }));
  const handleResetAll = () => setFilter({ fromDate: undefined, toDate: undefined, status: "All", sortBy: "default" });

  function DatePicker({ id, date, onSelect, placeholder }: { id: string; date: Date | undefined; onSelect: (date: Date | undefined) => void; placeholder: string }) {
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
              <span>{date ? date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : placeholder}</span>
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
                      <SelectValue placeholder="Default" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="merchant-newest">Merchant code (Newest First)</SelectItem>
                      <SelectItem value="merchant-oldest">Merchant code (Oldest First)</SelectItem>
                      <SelectItem value="request-newest">Request Timestamp (Newest First)</SelectItem>
                      <SelectItem value="request-oldest">Request Timestamp (Oldest First)</SelectItem>
                      <SelectItem value="status-low-high">Response Status (Low to High)</SelectItem>
                      <SelectItem value="status-high-low">Response Status (High to Low)</SelectItem>
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
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="200s">200s</SelectItem>
                      <SelectItem value="400s">400s</SelectItem>
                      <SelectItem value="500s">500s</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={handleResetAll}>
                    Reset All
                  </Button>
                  <Button className="bg-red-500 text-white hover:bg-red-600" onClick={() => {}}>
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
              <TableHead>Merchant Code</TableHead>
              <TableHead>Request Timestamp</TableHead>
              <TableHead>Response Timestamp</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Response Status</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.sN}>
                <TableCell>{item.sN}</TableCell>
                <TableCell>{item.merchantCode}</TableCell>
                <TableCell>{item.requestTimestamp}</TableCell>
                <TableCell>{item.responseTimestamp}</TableCell>
                <TableCell>{item.service}</TableCell>
                <TableCell>
                  <span className="flex items-center">
                    <span
                      className="w-2 h-2 rounded-full mr-2"
                      style={{
                        backgroundColor:
                          item.responseStatus >= 200 && item.responseStatus < 300 ? "#4CAF50" : // 200s (green)
                          item.responseStatus >= 400 && item.responseStatus < 500 ? "#FF8C00" : // 400s (orange)
                          item.responseStatus >= 500 && item.responseStatus < 600 ? "#FF4444" : "#000000", // 500s (red)
                      }}
                    />
                    <span
                      style={{
                        color:
                          item.responseStatus >= 200 && item.responseStatus < 300 ? "#4CAF50" : // 200s (green)
                          item.responseStatus >= 400 && item.responseStatus < 500 ? "#FF8C00" : // 400s (orange)
                          item.responseStatus >= 500 && item.responseStatus < 600 ? "#FF4444" : "#000000", // 500s (red)
                      }}
                    >
                      {item.responseStatus}
                    </span>
                  </span>
                </TableCell>
                <TableCell>{item.timestamp}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                       <BsThreeDots className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => console.log("View", item.sN)}><View /> View</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.log("Download", item.sN)}><Download /> Download</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}