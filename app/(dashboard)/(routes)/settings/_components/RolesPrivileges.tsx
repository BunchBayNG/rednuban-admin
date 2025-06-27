"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Filter, Search, ChevronLeft, ChevronRight, CalendarIcon, Download } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { BsThreeDots } from "react-icons/bs";
import { FiEye } from "react-icons/fi";
import { TbEdit } from "react-icons/tb";
import { TbTrash } from "react-icons/tb";
import { ExportModal } from "../../dashboard/_components/ExportModal";
import { LuUserPlus } from "react-icons/lu";
import { AddRoleModal } from "./AddRoleModal"; // Adjust the import path as needed

export default function RolesPrivileges() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    sortBy: "default",
  });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false); // State for export modal
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false); // State for add role modal
  const itemsPerPage = 10;
  const roles = [
    { id: 1, name: "Super Admin", description: "Can perform all activities", createdAt: "25/06/04-03:17:7PM" },
    { id: 2, name: "Merchant Access Authorizer", description: "Collections & Remittance Support - Can approve merchant and user creation", createdAt: "25/06/04-03:17:7PM" },
    { id: 3, name: "Collections Team Member", description: "Corporate Collections - Can view and export information pertaining to users, merchants and transactions", createdAt: "25/06/04-03:17:7PM" },
    { id: 4, name: "Bank Operations Support", description: "Transaction Banking Support - Can execute 1st level operational support and investigations on internal and external and...", createdAt: "25/06/04-03:17:7PM" },
    { id: 5, name: "Merchants Access Initiator", description: "Collections & Remittance Support - Can create external merchants (customers)", createdAt: "25/06/04-03:17:7PM" },
    { id: 6, name: "User Access Initiator", description: "User Access Management - Can control creation of internal users (admins)", createdAt: "25/06/04-03:17:7PM" },
    { id: 7, name: "User Access Authorizer", description: "User Access Management - Can view and export information pertaining to users, merchants and transactions", createdAt: "25/06/04-03:17:7PM" },
    { id: 8, name: "Bank Auditor", description: "IT Digital Banking Audit & Assurance - Can audit and conduct forensic operations", createdAt: "25/06/04-03:17:7PM" },
  ];


  // Filter data
  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate =
      (!filter.fromDate || new Date(role.createdAt) >= filter.fromDate) &&
      (!filter.toDate || new Date(role.createdAt) <= filter.toDate);
    return matchesSearch && matchesDate;
  });

  // Sort data
  const sortedRoles = [...filteredRoles].sort((a, b) => {
    switch (filter.sortBy) {
      case "a-z":
        return a.name.localeCompare(b.name);
      case "z-a":
        return b.name.localeCompare(a.name);
      case "newest-first":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest-first":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRoles = sortedRoles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
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
  const handleResetSort = () => setFilter((prev) => ({ ...prev, sortBy: "default" }));
  const handleResetAll = () => setFilter({ fromDate: undefined, toDate: undefined, sortBy: "default" });

  const handleApplyFilters = () => {
    // Filtering is reactive, no explicit apply needed
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

  const handleExport = (data: {
    dateRangeFrom: string;
    dateRangeTo: string;
    format: string;
    fields: Record<string, boolean>;
  }) => {
    const exportData = roles
      .filter((role) => {
        const fromDate = new Date(data.dateRangeFrom);
        const toDate = new Date(data.dateRangeTo);
        const roleDate = new Date(role.createdAt.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1"));
        return (!data.dateRangeFrom || !isNaN(fromDate.getTime()) && roleDate >= fromDate) &&
               (!data.dateRangeTo || !isNaN(toDate.getTime()) && roleDate <= toDate);
      })
      .map((role) =>
        Object.fromEntries(
          Object.entries(role).filter(([key]) => data.fields[key])
        )
      );
    console.log("Export data:", { ...data, exportData });
    setIsExportModalOpen(false);
  };

  const fieldOptions = [
    { label: "S/N", value: "id" },
    { label: "Role Name", value: "name" },
    { label: "Description", value: "description" },
    { label: "Created At", value: "createdAt" },
  ];

  interface RoleData {
    id: number;
    name: string;
    description: string;
    createdAt: string;
  }

  const handleAddRoleSubmit = (role: { name: string; description: string; permissions: string[] }) => {
    const roleData: RoleData = {
      id: roles.length + 1, // Generate a new ID
      name: role.name,
      description: role.description,
      createdAt: new Date().toLocaleString(), // Add a createdAt timestamp
    };
    console.log("New Role Submitted:", roleData);
    // Add logic to handle the new role (e.g., update roles array)
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4 space-x-4">
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 bg-[#F8F8F8] dark:bg-background">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[336px] bg-white dark:bg-background border rounded-lg shadow-lg p-4">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <DropdownMenuLabel className="text-sm">Date Range</DropdownMenuLabel>
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
                <DropdownMenuSeparator />
                <div className="flex justify-between items-center">
                  <DropdownMenuLabel className="text-sm">Sort By</DropdownMenuLabel>
                  <Button variant="link" className="text-red-500 p-0 h-auto" onClick={handleResetSort}>
                    Reset
                  </Button>
                </div>
                <Select
                  value={filter.sortBy}
                  onValueChange={(value) => setFilter((prev) => ({ ...prev, sortBy: value }))}
                >
                  <SelectTrigger className="w-full bg-[#F8F8F8] border-0 rounded">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="a-z">Role Name (A-Z)</SelectItem>
                    <SelectItem value="z-a">Role Name (Z-A)</SelectItem>
                    <SelectItem value="newest-first">Created At (Newest First)</SelectItem>
                    <SelectItem value="oldest-first">Created At (Oldest First)</SelectItem>
                  </SelectContent>
                </Select>
                <DropdownMenuSeparator />
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
              placeholder="Search Role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#F8F8F8] dark:bg-background border-0 rounded"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsAddRoleModalOpen(true)}>Add Role <LuUserPlus className="h-4 w-4 "/></Button>
          <Button onClick={() => setIsExportModalOpen(true)}>Export  <Download className="h-4 w-4 " /></Button>
        </div>
      </div>
      <Table>
        <TableHeader className="bg-[#F5F5F5] dark:bg-background">
          <TableRow>
            <TableHead>S/N</TableHead>
            <TableHead>Role Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedRoles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.id}</TableCell>
              <TableCell>{role.name}</TableCell>
              <TableCell>{role.description}</TableCell>
              <TableCell>{role.createdAt}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <BsThreeDots className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem><FiEye className="text-[]"/>View Role</DropdownMenuItem>
                    <DropdownMenuItem><TbEdit className="text-[]"/>Edit Role</DropdownMenuItem>
                    <DropdownMenuItem className="text-[#FF0606]"><TbTrash className="text-[]"/>Delete Role</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end items-center mt-4 text-xs">
        <div className="flex items-center space-x-2">
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
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        fieldOptions={fieldOptions}
      />
      <AddRoleModal
        isOpen={isAddRoleModalOpen}
        onClose={() => setIsAddRoleModalOpen(false)}
        onSubmit={handleAddRoleSubmit}
      />
    </div>
  );
}