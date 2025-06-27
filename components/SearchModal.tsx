
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CiUser } from "react-icons/ci";
import { TbReceipt } from "react-icons/tb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search} from "lucide-react";
import { useRouter } from "next/navigation";
import Reset from "./svg Icons/Reset";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Transaction {
  sN: number;
  merchant: string;
  vNUBAN: string;
  amount: number;
  status: string;
  transactionID: string;
  webhookStatus: string | number;
  timestamp: string;
  action: string;
  email: string;
  sessionID: string;
  reference: string;
  transactionType: string;
  destination: { accountNumber: string; bank: string; name: string };
  ipAddress: string;
  deviceInfo: string;
  processingTime: string;
  lastUpdated: string;
}

interface vNUBAN {
  sN: number;
  merchant: string;
  vNUBAN: string;
  accountName: string;
  status: string;
  productType: string;
  customerReference: string;
  createdAt: string;
  email: string;
  accountType: string;
  creationIP: string;
  deviceInfo: string;
  processingTime: string;
}

interface Merchant {
  email: string;
  sN: number;
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
  transactions: Transaction[];
  vnubans: vNUBAN[];
  merchants: Merchant[];
  trigger: React.ReactNode;
}

export default function SearchModal({
  searchQuery,
  isOpen,
  onClose,
  transactions,
  vnubans,
  merchants,
  trigger,
}: SearchModalProps) {
  const router = useRouter();
  const [modalSearchQuery, setModalSearchQuery] = useState(searchQuery);
  const [dataType, setDataType] = useState<string | null>(null);
  const [status, setStatus] = useState("all");

//   const statusOptions: { [key: string]: string[] } = {
//     Merchants: ["Active", "Inactive"],
//     Transactions: ["Successful", "Pending", "Failed"],
//     vNUBAN: ["Active", "Inactive"],
//   };

  useEffect(() => {
    if (isOpen) {
      setDataType(null);
      setModalSearchQuery(searchQuery);
      setStatus("all");
    }
  }, [isOpen, searchQuery]);

  useEffect(() => {
    setStatus("all");
  }, [dataType]);

  const dataTypes = [
    { name: "Merchants", icon: <CiUser className="w-5 h-5" /> },
    { name: "Transactions", icon: <TbReceipt className="w-5 h-5" /> },
    { name: "vNUBAN", icon: <TbReceipt className="w-5 h-5" /> },
  ];

  const filteredMerchants = merchants.filter(
    (result) =>
      (result.merchantName.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
       result.code.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
       result.accountNumber.toLowerCase().includes(modalSearchQuery.toLowerCase())) &&
      (status === "all" || result.status.toLowerCase() === status.toLowerCase())
  ).slice(0, 4);

  const filteredTransactions = transactions.filter(
    (result) =>
      (result.transactionID.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
       result.merchant.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
       result.vNUBAN.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
       result.amount.toString().toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
       result.status.toLowerCase().includes(modalSearchQuery.toLowerCase())) &&
      (status === "all" || result.status.toLowerCase() === status.toLowerCase())
  ).slice(0, 4);

  const filteredVnubans = vnubans.filter(
    (result) =>
      (result.vNUBAN.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
       result.merchant.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
       result.accountName.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
       result.customerReference.toLowerCase().includes(modalSearchQuery.toLowerCase())) &&
      (status === "all" || result.status.toLowerCase() === status.toLowerCase())
  ).slice(0, 4);

  const handleClearFilters = () => {
    setDataType(null);
    setStatus("all");
    setModalSearchQuery("");
  };

  const handleMerchants = () => {
    // router.push(`/merchants?search=${encodeURIComponent(modalSearchQuery)}`);
    router.push(`/merchant`);
    onClose();
  };

  const handleTransactions = () => {
    // router.push(`/transactions?search=${encodeURIComponent(modalSearchQuery)}`);
    router.push(`/transactions`);
    onClose();
  };

  const handleVnuban = () => {
    // router.push(`/vnuban?search=${encodeURIComponent(modalSearchQuery)}`);
    router.push(`/vnubans`);
    onClose();
  };

  return (
    <>
      <div>{trigger}</div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogOverlay className="backdrop-blur-xs bg-[#140000B2] dark:bg-black/50" />
        <VisuallyHidden>
            <DialogTitle>Search Modal</DialogTitle>
          </VisuallyHidden>
        <DialogContent className="sm:max-w-[575px] border-none rounded-lg p-2 ">
          <div className="p-1  flex items-center justify-between">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search by Merchant, vNUBAN, or Transaction ID..."
                value={modalSearchQuery}
                onChange={(e) => setModalSearchQuery(e.target.value)}
                className="pl-10 bg-[#F8F8F8] dark:bg-background border-none rounded-lg h-10 w-full focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>

          <div className="px-4 py-2 space-y-2 bg-background rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap gap-2">
                  {dataTypes.map((type) => (
                    <Button
                      key={type.name}
                      variant={dataType === type.name ? "default" : "outline"}
                      className={`rounded-lg px-3 py-1 text-xs flex items-center gap-2`}
                      onClick={() => setDataType(type.name)}
                    >
                      {type.name}
                    </Button>
                  ))}
                </div>
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
                              <AvatarFallback>{result.merchantName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{result.merchantName}</p>
                              <p className="text-xs text-gray-500">{result.email}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">{/* Placeholder for email if available */}</p>
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
                              <AvatarFallback>{result.merchant.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{result.merchant}</p>
                              <p className="text-xs text-gray-500">{result.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-right">
                            <p className="text-sm font-light">₦{result.amount.toLocaleString()}</p>
                            <span
                              className={`flex items-center gap-1 text-xs px-2 py-1 font-medium rounded-full ${
                                result.status === "Successful"
                                  ? " text-[#00D021]"
                                  : result.status === "Pending"
                                  ? " text-yellow-700"
                                  : " text-red-700"
                              }`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  result.status === "Successful"
                                    ? "bg-green-500"
                                    : result.status === "Pending"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                              />
                              {result.status}
                            </span>
                            <p className="text-sm font-light">{result.transactionID.slice(0, 6)}...</p>
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
                            <AvatarFallback>{result.merchant.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{result.merchant}</p>
                            <p className="text-xs text-gray-500">{result.email}</p>
                          </div>
                            </div>
                        
                          <div className="text-sm flex items-center gap-2">
                            <p>{result.vNUBAN}</p>
                            <span
                              className={`flex items-center gap-1 text-xs px-2 py-1 font-medium rounded-full ${
                                result.status === "Active"
                                  ? " text-[#00D021]"
                                  : result.status === "Inactive"
                                  ? " text-red-700"
                                  : " text-red-700"
                              }`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  result.status === "Active"
                                    ? "bg-green-500"
                                    : result.status === "Inactive"
                                    ? "bg-red-500"
                                    : "bg-red-500"
                                }`}
                              />
                              {result.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No vNUBANs found.</p>
                    )}
                   
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  {dataType === "Merchants" && (
                    <>
                      <p className="text-xs text-gray-500">Merchants</p>
                      {filteredMerchants.length > 0 ? (
                        filteredMerchants.map((result) => (
                          <div key={result.sN} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{result.merchantName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{result.merchantName}</p>
                                <p className="text-xs text-gray-500">{result.accountNumber}</p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">{/* Placeholder for email if available */}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No merchants found.</p>
                      )}
                      {filteredMerchants.length > 0 && (
                        <Button variant="link" className="w-full text-red-600" onClick={handleMerchants}>
                          View All
                        </Button>
                      )}
                    </>
                  )}

                  {dataType === "Transactions" && (
                    <>
                      <p className="text-xs text-gray-500">Transactions</p>
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((result) => (
                          <div key={result.sN} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{result.merchant.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{result.merchant}</p>
                                <p className="text-xs text-gray-500">{result.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-right">
                              <p className="text-sm font-light">₦{result.amount.toLocaleString()}</p>
                              <span
                                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                                  result.status === "Successful"
                                    ? "bg-green-100 text-green-700"
                                    : result.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    result.status === "Successful"
                                      ? "bg-green-500"
                                      : result.status === "Pending"
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                  }`}
                                />
                                {result.status}
                              </span>
                              <p className="text-sm font-light">{result.transactionID.slice(0, 6)}...</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No transactions found.</p>
                      )}
                      {filteredTransactions.length > 0 && (
                        <Button variant="link" className="w-full text-red-600" onClick={handleTransactions}>
                          View All
                        </Button>
                      )}
                    </>
                  )}

                  {dataType === "vNUBAN" && (
                    <>
                      <p className="text-xs text-gray-500">vNUBAN</p>
                      {filteredVnubans.length > 0 ? (
                        filteredVnubans.map((result) => (
                          <div key={result.sN} className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{result.merchant.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{result.merchant}</p>
                              <p className="text-xs text-gray-500">{result.vNUBAN}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No vNUBANs found.</p>
                      )}
                      {filteredVnubans.length > 0 && (
                        <Button variant="link" className="w-full text-red-600" onClick={handleVnuban}>
                          View All
                        </Button>
                      )}
                    </>
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
