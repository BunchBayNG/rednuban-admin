"use client";

import { SearchInput } from "./SearchInput";

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

interface NavbarRoutesProps {
  merchants: Merchant[];
}

export const NavbarRoutes = ({ merchants }: NavbarRoutesProps) => {
  return (
    <div className="flex items-center justify-between gap-6 w-full p-4">
      <div className="hidden md:block max-w-md pl-4">
        <h1 className="font-semibold">Virtual Account Service</h1>
      </div>
      <div className="flex items-center gap-3">
        <SearchInput transactions={[]} vnubans={[]} merchants={merchants} />
      </div>
    </div>
  );
};