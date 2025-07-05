"use client";

import { useState, useEffect } from "react";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

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

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const response = await fetch("/api/reports/organizations?page=0&size=10&sortBy=createdAt&sortOrder=ASC", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${document.cookie
              .split("; ")
              .find((row) => row.startsWith("accessToken="))
              ?.split("=")[1]}`,
          },
        });
        const data = await response.json();
        if (response.ok && data.status) {
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mappedMerchants = data.data.content.map((item: any) => ({
            sN: item.id || String(Math.random().toString(36).substr(2, 9)),
            merchantName: item.organizationName || "N/A",
            code: item.productPrefix || `MCH-${item.id?.slice(-6) || String(Math.random().toString(36).substr(2, 6))}`,
            accountName: item.settlementAccountName || "N/A",
            accountNumber: item.settlementAccountNumber || "N/A",
            primaryContact: `${item.contactFirstName || ""} ${item.contactLastName || ""}`.trim() || item.contactEmail || "N/A",
            status: item.orgStatus || "Unknown",
            noOfUsers: item.noOfUsers || 0,
            createdAt: item.createdAt
              ? new Date(item.createdAt).toLocaleString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A",
          }));
          setMerchants(mappedMerchants);
        }
      } catch (error) {
        console.error("Error fetching merchants:", error);
      }
    };
    fetchMerchants();
  }, []);

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-62.5 fixed inset-y-0 w-full z-50">
        <Navbar merchants={merchants} />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-45">
        <Sidebar />
      </div>
      <main className="md:pl-63 pt-[80px] h-full pb-[80px] md:pb-0">
        {children}
      </main>
      {/* <MobileSidebar /> */}
    </div>
  );
};

export default DashboardLayout;