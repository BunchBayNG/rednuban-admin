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
import { Filter, Search, ChevronLeft, ChevronRight, CalendarIcon, Edit } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import View from "@/components/svg Icons/View";
import Loader from "@/components/svg Icons/loader";

interface Staff {
  sN: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  logoUrl?: string;
}

interface MerchantStaffsTableProps {
  merchantAdminId: string;
}

export function MerchantStaffsTable({ merchantAdminId }: MerchantStaffsTableProps) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    status: "",
    sortBy: "default",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchStaff = async () => {
      setIsLoading(true);
      setError(null);
      console.log("Fetching staff for merchantAdminId:", merchantAdminId);

      try {
        const response = await fetch(`/api/get-staff?merchantAdminId=${merchantAdminId}`, {
          headers: { "Content-Type": "application/json" },
        });
        console.log("API Response Status:", response.status);
        const data = await response.json();
        console.log("API Response Body:", JSON.stringify(data, null, 2));

        if (response.ok && data.status && data.data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mappedStaff = data.data.map((item: any) => ({
            sN: item.id,
            name: `${item.firstName} ${item.lastName}`.trim(),
            email: item.email,
            role: item.userType || "Unknown",
            status: item.enabled ? "Active" : "Inactive",
            createdAt: item.createdAt || new Date().toLocaleString(), // Placeholder
            logoUrl: item.logoUrl || "/images/avatar-placeholder.jpg",
          }));
          console.log("Mapped Staff:", mappedStaff);
          setStaff(mappedStaff);
        } else {
          setError(data.message || `API error: ${response.status}`);
          console.log("API Error:", data);
        }
      } catch (err) {
        setError("Network or server error");
        console.error("Fetch Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, [merchantAdminId]);

  const filteredData = staff.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate =
      (!filter.fromDate || new Date(item.createdAt) >= filter.fromDate) &&
      (!filter.toDate || new Date(item.createdAt) <= filter.toDate);
    const matchesStatus = !filter.status || item.status === filter.status;
    return matchesSearch && matchesDate && matchesStatus;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    switch (filter.sortBy) {
      case "name-a-z":
        return a.name.localeCompare(b.name);
      case "name-z-a":
        return b.name.localeCompare(a.name);
      case "status-active-first":
        return a.status === "Active" ? -1 : b.status === "Active" ? 1 : 0;
      case "status-inactive-first":
        return a.status === "Inactive" ? -1 : b.status === "Inactive" ? 1 : 0;
      default:
        return 0;
    }
  });

  const totalItems = sortedData.length;
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

  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0][0];
  };

  const handleResetDate = () => setFilter((prev) => ({ ...prev, fromDate: undefined, toDate: undefined }));
  const handleResetStatus = () => setFilter((prev) => ({ ...prev, status: "" }));
  const handleResetSort = () => setFilter((prev) => ({ ...prev, sortBy: "default" }));
  const handleResetAll = () => setFilter({ fromDate: undefined, toDate: undefined, status: "", sortBy: "default" });

  const handleApplyFilters = () => {
    // Filtering is reactive
  };

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

  if (isLoading) {
    return (
      <div className="relative w-17 p-4 h-17 mx-auto my-5">
        <div className="absolute inset-0 border-4 border-transparent border-t-[#C80000] rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center m-3 justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 mb-4">{error}</div>
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
                      <SelectValue placeholder="A-Z" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="name-a-z">Name (A-Z)</SelectItem>
                      <SelectItem value="name-z-a">Name (Z-A)</SelectItem>
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
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active"><span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: "#4CAF50" }} /> Active</SelectItem>
                      <SelectItem value="Inactive"><span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: "#FF4444" }} /> Inactive</SelectItem>
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
              placeholder="Search Name, Email..."
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
        </div>
      </div>
      <div>
        <Table>
          <TableHeader className="bg-[#F5F5F5] dark:bg-background">
            <TableRow>
              <TableHead>S/N</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
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
                    <AvatarImage src={item.logoUrl} alt={item.name} />
                    <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
                  </Avatar>
                  <span>{item.name}</span>
                </TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell>
                  <span className="flex items-center">
                    <span
                      className="w-2 h-2 rounded-full mr-2"
                      style={{
                        backgroundColor: item.status === "Active" ? "#4CAF50" : "#FF4444",
                      }}
                    />
                    <span
                      style={{
                        color: item.status === "Active" ? "#4CAF50" : "#FF4444",
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
                      <DropdownMenuItem onClick={() => console.log("View", item.sN)}><View /> View</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.log("Edit", item.sN)}><Edit /> Edit</DropdownMenuItem>
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