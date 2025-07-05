"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchModal from "./SearchModal";

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

interface SearchInputProps {
  transactions: Transaction[];
  vnubans: VNUBAN[];
  merchants: Merchant[];
}

export const SearchInput = ({ transactions: initialTransactions, vnubans: initialVnubans, merchants }: SearchInputProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [vnubans, setVnubans] = useState<VNUBAN[]>(initialVnubans);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions
        const transactionResponse = await fetch("/api/reports/transactions?page=0&size=10&sortBy=createdAt&sortOrder=ASC", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${document.cookie
              .split("; ")
              .find((row) => row.startsWith("accessToken="))
              ?.split("=")[1]}`,
          },
        });
        const transactionData = await transactionResponse.json();
        console.log("SearchInput transaction API response:", JSON.stringify(transactionData, null, 2));
        if (transactionResponse.ok && transactionData.status) {
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mappedTransactions = transactionData.data.content.map((item: any) => ({
            sN: item.id || Math.random().toString(36).substr(2, 9),
            id: item.id || 0,
            transactionId: item.transactionId || "N/A",
            merchantName: item.merchantName || "N/A",
            merchantOrgId: item.merchantOrgId || "N/A",
            vnuban: String(item.accountNo || ""), // Align with VNUBANTable
            amount: item.amount || 0,
            status: item.status || "Unknown",
            sessionId: item.sessionId || "N/A",
            reference: item.reference || "N/A",
            webhookStatus: item.webhookStatus || "N/A",
            transactionType: item.transactionType || "N/A",
            destinationAccountNumber: item.destinationAccountNumber || "N/A",
            destinationAccountName: item.destinationAccountName || "N/A",
            destinationBankName: item.destinationBankName || "N/A",
            ipAddress: item.ipAddress || "N/A",
            deviceName: item.deviceName || "N/A",
            processingTime: item.processingTime || 0,
            createdAt: item.createdAt
              ? new Date(item.createdAt).toLocaleString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A",
            updatedAt: item.updatedAt
              ? new Date(item.updatedAt).toLocaleString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A",
          }));
          setTransactions(mappedTransactions);
          console.log("SearchInput mapped transactions:", mappedTransactions.map((t: Transaction) => ({
            id: t.id,
            vnuban: t.vnuban,
            merchantName: t.merchantName,
            status: t.status
          })));
        }

        // Fetch vnubans
        const vnubanResponse = await fetch("/api/reports/vnubans?page=0&size=10&sortBy=provisionDate&sortOrder=ASC", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${document.cookie
              .split("; ")
              .find((row) => row.startsWith("accessToken="))
              ?.split("=")[1]}`,
          },
        });
        const vnubanData = await vnubanResponse.json();
        console.log("SearchInput vnuban API response:", JSON.stringify(vnubanData, null, 2));
        if (vnubanResponse.ok && vnubanData.status) {
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mappedVnubans = vnubanData.data.content.map((item: any) => ({
            sN: item.id || Math.random().toString(36).substr(2, 9),
            id: item.id || 0,
            merchantName: item.merchantName || "N/A",
            merchantOrgId: item.merchantOrgId || "N/A",
            vnuban: String(item.accountNo || ""), // Fix: Map accountNo to vnuban
            accountName: String(item.accountName || "N/A"),
            vnubanType: item.mode || "N/A", // Align with VNUBANTable
            status: item.status || "Unknown",
            productType: item.productType || null,
            customerReference: String(item.initiatorRef || "N/A"), // Align with VNUBANTable
            provisionDate: item.provisionDate
              ? new Date(item.provisionDate).toLocaleString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A",
            updatedAt: item.updatedAt
              ? new Date(item.updatedAt).toLocaleString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A",
          }));
          setVnubans(mappedVnubans);
          console.log("SearchInput mapped vnubans:", mappedVnubans.map((v: VNUBAN) => ({
            id: v.id,
            vnuban: v.vnuban,
            merchantName: v.merchantName,
            status: v.status
          })));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleInputClick = () => {
    setIsModalOpen(true);
  };

  return (
    <SearchModal
      searchQuery={searchQuery}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      transactions={transactions}
      vnubans={vnubans}
      merchants={merchants}
      setSearchQuery={setSearchQuery}
      trigger={
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder="Search by Merchant, vNUBAN, or Transaction ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={handleInputClick}
            className="pl-10 pr-10 bg-[#F8F8F8] dark:bg-background border-none rounded-lg h-10 w-[400px] max-w-md focus:ring-2 focus:ring-gray-200 text-gray-500"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </form>
      }
    />
  );
};