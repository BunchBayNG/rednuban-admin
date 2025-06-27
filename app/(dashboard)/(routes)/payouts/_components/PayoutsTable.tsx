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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Filter, Search, ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import PayoutDetailsModal from "./PayoutDetailsModal";
import View from "@/components/svg Icons/View";
import Download from "@/components/svg Icons/Download";
import Retry from "@/components/svg Icons/Retry";
import Empty from "@/components/svg Icons/Empty";
import Loading from "@/components/Loading";

interface Payout {
  sN: number;
  id: number;
  merchantName: string;
  merchantOrgId: string;
  destinationAccount: string;
  amount: number;
  status: string;
  transactionRef: string;
  paymentReference: string;
  createdAt: string;
  updatedAt: string;
  sourceAccount: string;
}

interface PayoutResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: {
    totalElements: number;
    totalPages: number;
    size: number;
    content: Payout[];
    number: number;
    first: boolean;
    last: boolean;
  };
}

export function PayoutTable() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    sourceAccount: "",
    destinationAccount: "",
    transactionRef: "",
    paymentReference: "",
    merchantName: "",
    merchantOrgId: "",
    startDate: "",
    endDate: "",
    status: "",
    sortBy: "createdAt",
    ascending: true,
  });
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);

  const fetchPayouts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: "10",
        sortBy: filter.sortBy || "createdAt",
        ascending: filter.ascending.toString(),
        ...Object.fromEntries(
          Object.entries({
            sourceAccount: filter.sourceAccount,
            destinationAccount: filter.destinationAccount,
            transactionRef: filter.transactionRef,
            paymentReference: filter.paymentReference,
            merchantName: filter.merchantName || searchTerm,
            merchantOrgId: filter.merchantOrgId,
            startDate: filter.startDate,
            endDate: filter.endDate,
            status: filter.status,
          }).filter(([, v]) => v && v !== "")
        ),
      }).toString();
      console.log("Frontend Request URL:", `/api/reports/payouts?${params}`);
      const res = await fetch(`/api/reports/payouts?${params}`);
      const data: PayoutResponse = await res.json();
      console.log("API Response:", JSON.stringify(data, null, 2));
      if (data.status) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedPayouts = data.data.content.map((p: any, index: number) => ({
          sN: data.data.number * 10 + index + 1,
          id: p.id,
          merchantName: p.merchantName || "",
          merchantOrgId: p.merchantOrgId || "",
          destinationAccount: p.destinationAccount || "",
          amount: p.amount || 0,
          status: p.status || "",
          transactionRef: p.transactionRef || "",
          paymentReference: p.paymentReference || "",
          createdAt: p.createdAt
            ? new Date(p.createdAt).toLocaleString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
            : "",
          updatedAt: p.updatedAt || "",
          sourceAccount: p.sourceAccount || "",
        }));
        setPayouts(mappedPayouts);
        setTotalPages(data.data.totalPages);
      } else {
        setError(data.message || "Failed to fetch payouts");
      }
    } catch (error) {
      console.error("Error fetching payouts:", error);
      setError("Failed to fetch payouts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
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
  const handleResetStatus = () => setFilter((prev) => ({ ...prev, status: "" }));
  const handleResetSort = () => setFilter((prev) => ({ ...prev, sortBy: "createdAt", ascending: true }));
  const handleResetAll = () =>
    setFilter({
      sourceAccount: "",
      destinationAccount: "",
      transactionRef: "",
      paymentReference: "",
      merchantName: "",
      merchantOrgId: "",
      startDate: "",
      endDate: "",
      status: "",
      sortBy: "createdAt",
      ascending: true,
    });

  const handleApplyFilters = () => {
    // Filtering handled by API
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
                    <label className="text-sm">Source Account</label>
                    <Button
                      variant="link"
                      className="text-red-500 p-0 h-auto"
                      onClick={() => setFilter((prev) => ({ ...prev, sourceAccount: "" }))}
                    >
                      Reset
                    </Button>
                  </div>
                  <Input
                    value={filter.sourceAccount}
                    onChange={(e) => setFilter((prev) => ({ ...prev, sourceAccount: e.target.value }))}
                    placeholder="Source Account"
                    className="w-full bg-[#F8F8F8] dark:bg-gray-700 border-0 rounded"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm">Destination Account</label>
                    <Button
                      variant="link"
                      className="text-red-500 p-0 h-auto"
                      onClick={() => setFilter((prev) => ({ ...prev, destinationAccount: "" }))}
                    >
                      Reset
                    </Button>
                  </div>
                  <Input
                    value={filter.destinationAccount}
                    onChange={(e) => setFilter((prev) => ({ ...prev, destinationAccount: e.target.value }))}
                    placeholder="Destination Account"
                    className="w-full bg-[#F8F8F8] dark:bg-gray-700 border-0 rounded"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm">Transaction Ref</label>
                    <Button
                      variant="link"
                      className="text-red-500 p-0 h-auto"
                      onClick={() => setFilter((prev) => ({ ...prev, transactionRef: "" }))}
                    >
                      Reset
                    </Button>
                  </div>
                  <Input
                    value={filter.transactionRef}
                    onChange={(e) => setFilter((prev) => ({ ...prev, transactionRef: e.target.value }))}
                    placeholder="Transaction Ref"
                    className="w-full bg-[#F8F8F8] dark:bg-gray-700 border-0 rounded"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm">Payment Reference</label>
                    <Button
                      variant="link"
                      className="text-red-500 p-0 h-auto"
                      onClick={() => setFilter((prev) => ({ ...prev, paymentReference: "" }))}
                    >
                      Reset
                    </Button>
                  </div>
                  <Input
                    value={filter.paymentReference}
                    onChange={(e) => setFilter((prev) => ({ ...prev, paymentReference: e.target.value }))}
                    placeholder="Payment Reference"
                    className="w-full bg-[#F8F8F8] dark:bg-gray-700 border-0 rounded"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm">Merchant Name</label>
                    <Button
                      variant="link"
                      className="text-red-500 p-0 h-auto"
                      onClick={() => setFilter((prev) => ({ ...prev, merchantName: "" }))}
                    >
                      Reset
                    </Button>
                  </div>
                  <Input
                    value={filter.merchantName}
                    onChange={(e) => setFilter((prev) => ({ ...prev, merchantName: e.target.value }))}
                    placeholder="Merchant Name"
                    className="w-full bg-[#F8F8F8] dark:bg-gray-700 border-0 rounded"
                  />
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
                      <SelectItem value="Processing">
                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: "#FF8C00" }} />
                        Processing
                      </SelectItem>
                      <SelectItem value="Failed">
                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: "#FF4444" }} />
                        Failed
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
                    value={filter.sortBy + (filter.ascending ? "" : "Desc")}
                    onValueChange={(value) =>
                      setFilter((prev) => ({
                        ...prev,
                        sortBy: value.includes("Desc") ? value.replace("Desc", "") : value,
                        ascending: !value.includes("Desc"),
                      }))
                    }
                  >
                    <SelectTrigger className="w-full bg-[#F8F8F8] dark:bg-gray-700 border-0 rounded">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Created At (Asc)</SelectItem>
                      <SelectItem value="createdAtDesc">Created At (Desc)</SelectItem>
                      <SelectItem value="merchantName">Merchant Name (Asc)</SelectItem>
                      <SelectItem value="merchantNameDesc">Merchant Name (Desc)</SelectItem>
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
              placeholder="Search Merchant, Source Account, Transaction Ref..."
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
              <TableHead>Transaction Ref</TableHead>
              <TableHead>Payment Ref</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10}>
                <Loading />
                </TableCell>
              </TableRow>
            ) : payouts.length > 0 ? (
              payouts.map((item) => (
                <TableRow key={item.sN}>
                  <TableCell>{item.sN}</TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <Avatar>
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
                  <TableCell>{item.transactionRef}</TableCell>
                  <TableCell>{item.paymentReference}</TableCell>
                  <TableCell>{item.createdAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <BsThreeDots className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setSelectedPayout(item)}>
                          <View /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log("Download", item.sN)}>
                          <Download /> Download
                        </DropdownMenuItem>
                        {item.status === "Failed" && (
                          <DropdownMenuItem onClick={() => console.log("Retry", item.sN)}>
                            <Retry /> Retry
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10}>
                  <div className="text-center flex flex-col items-center gap-4 m-3 p-3">
                    <Empty />
                    <p className="text-muted-foreground">No payouts found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <PayoutDetailsModal
        isOpen={!!selectedPayout}
        onClose={() => setSelectedPayout(null)}
        payout={selectedPayout}
        setSelectedPayout={setSelectedPayout}
        payouts={payouts}
      />
    </div>
  );
}