"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CiUser } from "react-icons/ci";
import { TbReceipt } from "react-icons/tb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Reset from "./svg Icons/Reset";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Transaction {
  sN: number;
  id: number;
  transactionId: string;
  merchantName: string;
  merchantOrgId: string;
  vnuban: string;
  amount: number;
  status: string;
  sessionId: string;
  reference: string;
  webhookStatus: string;
  transactionType: string;
  destinationAccountNumber: string;
  destinationAccountName: string;
  destinationBankName: string;
  ipAddress: string;
  deviceName: string;
  processingTime: number;
  createdAt: string;
  updatedAt: string;
}

interface VNUBAN {
  sN: number;
  id: number;
  merchantName: string;
  merchantOrgId: string;
  vnuban: string;
  accountName: string;
  vnubanType: string;
  status: string;
  productType: string | null;
  customerReference: string;
  provisionDate: string;
  updatedAt: string;
}

interface Merchant {
  sN: string;
  merchantName: string;
  code: string;
  accountName: string;
  accountNumber: string;
  primaryContact: string;
  status: string;
  noOfUsers: number;
  createdAt: string;
}

interface SearchModalProps {
  searchQuery: string;
  isOpen: boolean;
  onClose: () => void;
  trigger: React.ReactNode;
  transactions: Transaction[];
  vnubans: VNUBAN[];
  merchants: Merchant[] | undefined;
  setSearchQuery: (query: string) => void;
}

export default function SearchModal({
  searchQuery,
  isOpen,
  onClose,
  trigger,
  transactions: initialTransactions,
  vnubans: initialVnubans,
  merchants: initialMerchants = [], // Default to empty array
  setSearchQuery,
}: SearchModalProps) {
  const router = useRouter();
  const [modalSearchQuery, setModalSearchQuery] = useState(searchQuery);
  const [dataType, setDataType] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [vnubans, setVnubans] = useState<VNUBAN[]>(initialVnubans);
  const [merchants, setMerchants] = useState<Merchant[]>(initialMerchants);

  useEffect(() => {
    if (isOpen) {
      console.log("SearchModal initialVnubans:", initialVnubans.map(v => ({
        id: v.id,
        vnuban: v.vnuban,
        merchantName: v.merchantName,
        status: v.status
      }))); // Debug: Log vnuban values
      setDataType(null);
      setModalSearchQuery(searchQuery);
      setTransactions(initialTransactions);
      setVnubans(initialVnubans);
      setMerchants(initialMerchants);
    }
  }, [isOpen, searchQuery, initialTransactions, initialVnubans, initialMerchants]);

  const filteredMerchants = merchants.filter(
    (result) =>
      result.merchantName?.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
      result.code?.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
      result.accountName?.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
      result.accountNumber?.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
      result.primaryContact?.toLowerCase().includes(modalSearchQuery.toLowerCase())
  ).slice(0, 4);

  const filteredTransactions = transactions.filter(
    (result) =>
      result.transactionId?.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
      result.merchantName?.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
      result.vnuban?.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
      result.amount?.toString().toLowerCase().includes(modalSearchQuery.toLowerCase())
  ).slice(0, 4);

  const filteredVnubans = vnubans.filter(
    (result) => {
      const matches =
        result.vnuban?.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
        result.merchantName?.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
        result.accountName?.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
        result.customerReference?.toLowerCase().includes(modalSearchQuery.toLowerCase());
      console.log("SearchModal filteredVnuban:", {
        id: result.id,
        vnuban: result.vnuban,
        merchantName: result.merchantName,
        status: result.status,
        matches: matches
      }); // Debug: Log each filtered vnuban
      return matches;
    }
  ).slice(0, 4);

  const handleClearFilters = () => {
    setDataType(null);
    setModalSearchQuery("");
    setSearchQuery("");
    setTransactions(initialTransactions);
    setVnubans(initialVnubans);
    setMerchants(initialMerchants);
  };

  const handleMerchants = () => {
    router.push(`/merchant?search=${encodeURIComponent(modalSearchQuery)}`);
    onClose();
  };

  const handleTransactions = () => {
    router.push(`/transactions?search=${encodeURIComponent(modalSearchQuery)}`);
    onClose();
  };

  const handleVnuban = () => {
    router.push(`/vnubans?search=${encodeURIComponent(modalSearchQuery)}`);
    onClose();
  };

  const dataTypes = [
    { name: "Merchants", icon: <CiUser className="w-5 h-5" /> },
    { name: "Transactions", icon: <TbReceipt className="w-5 h-5" /> },
    { name: "vNUBAN", icon: <TbReceipt className="w-5 h-5" /> },
  ];

  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0]?.[0] || "N/A";
  };

  return (
    <>
      <div>{trigger}</div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogOverlay className="backdrop-blur-xs bg-[#140000B2] dark:bg-black/50" />
        <VisuallyHidden>
          <DialogTitle>Search Modal</DialogTitle>
        </VisuallyHidden>
        <DialogContent className="sm:max-w-[575px] border-none rounded-lg p-2">
          <div className="p-1 flex items-center justify-between">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search by Merchant, vNUBAN, or Transaction ID..."
                value={modalSearchQuery}
                onChange={(e) => {
                  setModalSearchQuery(e.target.value);
                  setSearchQuery(e.target.value);
                }}
                className="pl-10 bg-[#F8F8F8] dark:bg-background border-none rounded-lg h-10 w-full focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>

          <div className="px-4 py-2 space-y-2 bg-background rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {dataTypes.map((type) => (
                  <Button
                    key={type.name}
                    variant={dataType === type.name ? "default" : "outline"}
                    className="rounded-lg px-3 py-1 text-xs flex items-center gap-2"
                    onClick={() => setDataType(type.name)}
                  >
                    {type.icon}
                    {type.name}
                  </Button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearFilters}
                className="text-[#C80000] w-fit text-xs px-3 py-1"
              >
                <Reset className="h-5 w-5" />
                Reset
              </Button>
            </div>

            <div className="space-y-6 max-h-[400px] overflow-y-auto">
              {dataType === null ? (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">Merchants</p>
                      {filteredMerchants.length > 0 && (
                        <Button variant="link" className="text-xs text-red-600" onClick={handleMerchants}>
                          View All
                        </Button>
                      )}
                    </div>
                    {filteredMerchants.length > 0 ? (
                      filteredMerchants.map((result) => (
                        <div key={result.sN} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{getInitials(result.merchantName)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{result.merchantName || "N/A"}</p>
                              <p className="text-xs text-gray-500">{result.accountNumber || "N/A"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-500">{result.primaryContact || "N/A"}</p>
                            <span
                              className={`flex items-center gap-1 text-xs px-2 py-1 font-medium rounded-full ${
                                result.status === "Active" ? "bg-[#E8F5E9] text-[#4CAF50]" : "bg-[#FFEDEE] text-[#FF4444]"
                              }`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  result.status === "Active" ? "bg-[#4CAF50]" : "bg-[#FF4444]"
                                }`}
                              />
                              {result.status || "N/A"}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No merchants found.</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">Transactions</p>
                      {filteredTransactions.length > 0 && (
                        <Button variant="link" className="text-xs text-red-600" onClick={handleTransactions}>
                          View All
                        </Button>
                      )}
                    </div>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((result) => (
                        <div key={result.sN} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{getInitials(result.merchantName)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{result.merchantName || "N/A"}</p>
                              <p className="text-xs text-gray-500">{result.transactionId || "N/A"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-right">
                            <p className="text-sm font-light">₦{(result.amount || 0).toLocaleString()}</p>
                            <span
                              className={`flex items-center gap-1 text-xs px-2 py-1 font-medium rounded-full ${
                                result.status === "SUCCESS"
                                  ? "bg-[#E8F5E9] text-[#4CAF50]"
                                  : result.status === "PENDING"
                                  ? "bg-[#FFF3E0] text-[#FF8C00]"
                                  : "bg-[#FFEDEE] text-[#FF4444]"
                              }`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  result.status === "SUCCESS"
                                    ? "bg-[#4CAF50]"
                                    : result.status === "PENDING"
                                    ? "bg-[#FF8C00]"
                                    : "bg-[#FF4444]"
                                }`}
                              />
                              {result.status || "N/A"}
                            </span>
                            <p className="text-sm font-light">{(result.transactionId || "").slice(0, 6)}...</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No transactions found.</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">vNUBAN</p>
                      {filteredVnubans.length > 0 && (
                        <Button variant="link" className="text-xs text-red-600" onClick={handleVnuban}>
                          View All
                        </Button>
                      )}
                    </div>
                    {filteredVnubans.length > 0 ? (
                      filteredVnubans.map((result) => (
                        <div key={result.sN} className="flex items-center justify-between gap-2">
                          <div className="flex gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{getInitials(result.merchantName)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{result.merchantName || "N/A"}</p>
                              <p className="text-xs text-gray-500">{result.vnuban ? result.vnuban.slice(0, 10) : "N/A"}</p>
                            </div>
                          </div>
                          <div className="text-sm flex items-center gap-2">
                            <p>{result.vnuban ? result.vnuban : "N/A"}</p>
                            <span
                              className={`flex items-center gap-1 text-xs px-2 py-1 font-medium rounded-full ${
                                result.status === "ACTIVE" ? "bg-[#E8F5E9] text-[#4CAF50]" : "bg-[#FFEDEE] text-[#FF4444]"
                              }`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  result.status === "ACTIVE" ? "bg-[#4CAF50]" : "bg-[#FF4444]"
                                }`}
                              />
                              {result.status || "N/A"}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No vNUBANs found.</p>
                    )}
                  </div>
                </>
              ) : dataType === "Merchants" ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">Merchants</p>
                    {filteredMerchants.length > 0 && (
                      <Button variant="link" className="text-xs text-red-600" onClick={handleMerchants}>
                        View All
                      </Button>
                    )}
                  </div>
                  {filteredMerchants.length > 0 ? (
                    filteredMerchants.map((result) => (
                      <div key={result.sN} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getInitials(result.merchantName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{result.merchantName || "N/A"}</p>
                            <p className="text-xs text-gray-500">{result.accountNumber || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-500">{result.primaryContact || "N/A"}</p>
                          <span
                            className={`flex items-center gap-1 text-xs px-2 py-1 font-medium rounded-full ${
                              result.status === "Active" ? "bg-[#E8F5E9] text-[#4CAF50]" : "bg-[#FFEDEE] text-[#FF4444]"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                result.status === "Active" ? "bg-[#4CAF50]" : "bg-[#FF4444]"
                              }`}
                            />
                            {result.status || "N/A"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No merchants found.</p>
                  )}
                </div>
              ) : dataType === "Transactions" ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">Transactions</p>
                    {filteredTransactions.length > 0 && (
                      <Button variant="link" className="text-xs text-red-600" onClick={handleTransactions}>
                        View All
                      </Button>
                    )}
                  </div>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((result) => (
                      <div key={result.sN} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getInitials(result.merchantName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{result.merchantName || "N/A"}</p>
                            <p className="text-xs text-gray-500">{result.transactionId || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-right">
                          <p className="text-sm font-light">₦{(result.amount || 0).toLocaleString()}</p>
                          <span
                            className={`flex items-center gap-1 text-xs px-2 py-1 font-medium rounded-full ${
                              result.status === "SUCCESS"
                                ? "bg-[#E8F5E9] text-[#4CAF50]"
                                : result.status === "PENDING"
                                ? "bg-[#FFF3E0] text-[#FF8C00]"
                                : "bg-[#FFEDEE] text-[#FF4444]"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                result.status === "SUCCESS"
                                  ? "bg-[#4CAF50]"
                                  : result.status === "PENDING"
                                  ? "bg-[#FF8C00]"
                                  : "bg-[#FF4444]"
                              }`}
                            />
                            {result.status || "N/A"}
                          </span>
                          <p className="text-sm font-light">{(result.transactionId || "").slice(0, 6)}...</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No transactions found.</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">vNUBAN</p>
                    {filteredVnubans.length > 0 && (
                      <Button variant="link" className="text-xs text-red-600" onClick={handleVnuban}>
                        View All
                      </Button>
                    )}
                  </div>
                  {filteredVnubans.length > 0 ? (
                    filteredVnubans.map((result) => (
                      <div key={result.sN} className="flex items-center justify-between gap-2">
                        <div className="flex gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getInitials(result.merchantName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{result.merchantName || "N/A"}</p>
                            <p className="text-xs text-gray-500">{result.vnuban ? result.vnuban.slice(0, 10) : "N/A"}</p>
                          </div>
                        </div>
                        <div className="text-sm flex items-center gap-2">
                          <p>{result.vnuban ? result.vnuban : "N/A"}</p>
                          <span
                            className={`flex items-center gap-1 text-xs px-2 py-1 font-medium rounded-full ${
                              result.status === "ACTIVE" ? "bg-[#E8F5E9] text-[#4CAF50]" : "bg-[#FFEDEE] text-[#FF4444]"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                result.status === "ACTIVE" ? "bg-[#4CAF50]" : "bg-[#FF4444]"
                              }`}
                            />
                            {result.status || "N/A"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No vNUBANs found.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}