"use client";

import { NavbarRoutes } from "@/components/navbar-routes";
import { MobileSidebar } from "./Mobile-sidebar";

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

interface NavbarProps {
  merchants: Merchant[];
}

export const Navbar = ({ merchants }: NavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center shadow-sm bg-card">
      <MobileSidebar />
      <NavbarRoutes merchants={merchants} />
    </div>
  );
};