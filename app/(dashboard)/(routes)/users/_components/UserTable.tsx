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
import View from "@/components/svg Icons/View";
import Download from "@/components/svg Icons/Download";
import ConfirmActionModal from "./ConfirmActionModal";
import { toast } from "sonner";
import UserDetailsModal from "./UsersDetailsModal";
import Empty from "@/components/svg Icons/Empty";
import Loader from "@/components/svg Icons/loader";

export function UserTable({ refetchTrigger }: { refetchTrigger: number }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    role: "",
    sortBy: "default",
    status: "",
  });
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"Enable" | "Disable">("Disable");
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const fromDate = filter.fromDate ? filter.fromDate.toISOString().split("T")[0] : "";
      const toDate = filter.toDate ? filter.toDate.toISOString().split("T")[0] : "";
      const status = filter.status === "Enabled" ? "true" : filter.status === "Disabled" ? "false" : "";
      const res = await fetch(
        `/api/get-staff?merchantAdminId=${encodeURIComponent("MERCHANT_ADMIN_ID")}&search=${encodeURIComponent(searchTerm)}&fromDate=${fromDate}&toDate=${toDate}&role=${encodeURIComponent(filter.role)}&status=${encodeURIComponent(status)}&sortBy=${encodeURIComponent(filter.sortBy)}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}` },
        }
      );
      const data = await res.json();
      if (res.ok && data.status) {
        setUsers(data.data || []);
        setTotalItems(data.data.length || 0);
      } else {
        setError(data.message || "Failed to fetch staff");
      }
    } catch (error) {
      console.error("Fetch staff error:", error);
      setError("Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, filter, refetchTrigger]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = users.map((item, index) => ({
    sN: (currentPage - 1) * itemsPerPage + index + 1,
    userID: item.id,
    fullName: `${item.firstName || ""} ${item.lastName || ""}`.trim(),
    email: item.email || "",
    role: item.userType || "",
    status: item.enabled ? "Enabled" : "Disabled",
    createdAt: new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }), // Placeholder
    logoUrl: item.logoUrl || "/images/avatar-placeholder.jpg",
  }));

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
  const handleResetRole = () => setFilter((prev) => ({ ...prev, role: "" }));
  const handleResetSort = () => setFilter((prev) => ({ ...prev, sortBy: "default" }));
  const handleResetStatus = () => setFilter((prev) => ({ ...prev, status: "" }));
  const handleResetAll = () => setFilter({ fromDate: undefined, toDate: undefined, role: "", sortBy: "default", status: "" });

  const handleApplyFilters = () => {
    fetchUsers();
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

  const handleStatusChange = (user: any, newStatus: "Enabled" | "Disabled") => {
    setSelectedUser(user);
    setActionType(newStatus === "Enabled" ? "Enable" : "Disable");
    setIsConfirmModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (selectedUser) {
      try {
        const res = await fetch(
          `/api/disable-staff?merchantAdminId=${encodeURIComponent("MERCHANT_ADMIN_ID")}&staffId=${encodeURIComponent(selectedUser.userID)}`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}` },
          }
        );
        const data = await res.json();
        if (data.success) {
          toast.success(`User ${actionType.toLowerCase()}d successfully!`);
          fetchUsers();
        } else {
          toast.error(data.error || `Failed to ${actionType.toLowerCase()} user`);
        }
      } catch (error) {
        toast.error(`Failed to ${actionType.toLowerCase()} user`);
        console.error("Status change error:", error);
      }
    }
    setIsConfirmModalOpen(false);
    setSelectedUser(null);
  };

  const handleChangeRole = async (user: any, newRole: string) => {
    try {
      const res = await fetch("/api/assign-role", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        },
        body: JSON.stringify({
          adminId: "MERCHANT_ADMIN_ID",
          email: user.email,
          roleName: newRole,
          roleId: `ROLE_${newRole.toUpperCase().replace(/\s+/g, "_")}`,
          permissionsIds: [], // Adjust based on role
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Role updated successfully!");
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to update role");
      }
    } catch (error) {
      toast.error("Failed to update role");
      console.error("Change role error:", error);
    }
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
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
                    <label className="text-sm">Role</label>
                    <Button variant="link" className="text-red-500 p-0 h-auto" onClick={handleResetRole}>
                      Reset
                    </Button>
                  </div>
                  <Select
                    value={filter.role}
                    onValueChange={(value) => setFilter((prev) => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger className="w-full bg-[#F8F8F8] dark:bg-gray-700 border-0 rounded">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Roles</SelectItem>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Collections Team Member">Collections Team Member</SelectItem>
                      <SelectItem value="Merchant Access Authorizer">Merchant Access Authorizer</SelectItem>
                      <SelectItem value="Merchant Access Initiator">Merchant Access Initiator</SelectItem>
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
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="Enabled">Enabled</SelectItem>
                      <SelectItem value="Disabled">Disabled</SelectItem>
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
                      <SelectItem value="role-a-z">Role (A-Z)</SelectItem>
                      <SelectItem value="role-z-a">Role (Z-A)</SelectItem>
                      <SelectItem value="status-enabled-first">Status (Enabled First)</SelectItem>
                      <SelectItem value="status-disabled-first">Status (Disabled First)</SelectItem>
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
              placeholder="Search User Name, Email, Role..."
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
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7}>
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
                <TableCell colSpan={7} className="text-center text-red-500 my-4">
                  {error}
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  <div className="text-center flex flex-col items-center gap-4 m-3 p-3">
                    <Empty />
                    <p className="text-muted-foreground">No Staff found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={item.userID}>
                  <TableCell>{item.sN}</TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={item.logoUrl || "/images/avatar-placeholder.jpg"} alt={item.fullName} />
                      <AvatarFallback>{getInitials(item.fullName)}</AvatarFallback>
                    </Avatar>
                    <span>{item.fullName}</span>
                  </TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>
                    <span className="flex items-center">
                      <span
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: item.status === "Enabled" ? "#4CAF50" : "#FF4444" }}
                      />
                      <span style={{ color: item.status === "Enabled" ? "#4CAF50" : "#FF4444" }}>
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
                        <DropdownMenuItem onClick={() => handleViewUser(item)}><View /> View</DropdownMenuItem>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <DropdownMenuItem><View /> Change Role</DropdownMenuItem>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleChangeRole(item, "Super Admin")}>Super Admin</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeRole(item, "Admin")}>Admin</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeRole(item, "Collections Team Member")}>Collections Team Member</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeRole(item, "Merchant Access Authorizer")}>Merchant Access Authorizer</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeRole(item, "Merchant Access Initiator")}>
                              Merchant Access Initiator
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {item.status === "Enabled" ? (
                          <DropdownMenuItem onClick={() => handleStatusChange(item, "Disabled")}><View /> Disable</DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleStatusChange(item, "Enabled")}><View /> Enable</DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => console.log("Download", item.userID)}><Download /> Download</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <ConfirmActionModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        user={selectedUser}
        action={actionType}
        onConfirm={confirmStatusChange}
      />
      <UserDetailsModal
        isOpen={isUserDetailsOpen}
        onClose={() => setIsUserDetailsOpen(false)}
        user={selectedUser}
        setSelectedUser={setSelectedUser}
      />
    </div>
  );
}