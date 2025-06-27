
"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchModal from "./SearchModal";
import { transactionData, vNUBANData, merchantData } from "@/lib/MockData";

export const SearchInput = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

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
      transactions={transactionData}
      vnubans={vNUBANData}
      merchants={merchantData}
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
