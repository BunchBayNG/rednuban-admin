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
import { useState } from "react";
import { auditTrailData } from "@/lib/MockData";

export function AuditTrailTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    userRole: "All",
    action: "All",
    sortBy: "default",
  });
  const itemsPerPage = 10;
  const totalItems = auditTrailData.length;

  // Filter and sort data
  const filteredData = auditTrailData.filter((item) => {
    const matchesSearch =
      item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate =
      (!filter.fromDate || new Date(item.time) >= filter.fromDate) &&
      (!filter.toDate || new Date(item.time) <= filter.toDate);
    const matchesUserRole =
      filter.userRole === "All" ||
      item.userRole === filter.userRole;
    const matchesAction =
      filter.action === "All" ||
      item.action === filter.action;
    return matchesSearch && matchesDate && matchesUserRole && matchesAction;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    switch (filter.sortBy) {
      case "user-a-z":
        return a.user.localeCompare(b.user);
      case "user-z-a":
        return b.user.localeCompare(a.user);
      case "time-newest":
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      case "time-oldest":
        return new Date(a.time).getTime() - new Date(b.time).getTime();
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
  const handleResetUserRole = () => setFilter((prev) => ({ ...prev, userRole: "All" }));
  const handleResetAction = () => setFilter((prev) => ({ ...prev, action: "All" }));
  const handleResetSort = () => setFilter((prev) => ({ ...prev, sortBy: "default" }));
  const handleResetAll = () => setFilter({ fromDate: undefined, toDate: undefined, userRole: "All", action: "All", sortBy: "default" });

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
                      <SelectItem value="user-a-z">User (A-Z)</SelectItem>
                      <SelectItem value="user-z-a">User (Z-A)</SelectItem>
                      <SelectItem value="time-newest">Time (Newest First)</SelectItem>
                      <SelectItem value="time-oldest">Time (Oldest First)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm">User Role</label>
                    <Button variant="link" className="text-red-500 p-0 h-auto" onClick={handleResetUserRole}>
                      Reset
                    </Button>
                  </div>
                  <Select
                    value={filter.userRole}
                    onValueChange={(value) => setFilter((prev) => ({ ...prev, userRole: value }))}
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
                    <label className="text-sm">Action</label>
                    <Button variant="link" className="text-red-500 p-0 h-auto" onClick={handleResetAction}>
                      Reset
                    </Button>
                  </div>
                  <Select
                    value={filter.action}
                    onValueChange={(value) => setFilter((prev) => ({ ...prev, action: value }))}
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
              placeholder="Search User, Email, Role, Action..."
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
              <TableHead>Email</TableHead>
              <TableHead>User Role</TableHead>
              <TableHead>User IP Address</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.sN}>
                <TableCell>{item.sN}</TableCell>
                <TableCell>{item.user}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.userRole}</TableCell>
                <TableCell>{item.userIpAddress}</TableCell>
                <TableCell>{item.merchant}</TableCell>
                <TableCell>{item.action}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
