"use client";

import { SidebarItem } from "./sidebar-item";
import Dashboard from "@/components/svg Icons/Dashboard";
import Transactions from "@/components/svg Icons/Transactions";
import Vnu from "@/components/svg Icons/Vnu";
import Merchant from "@/components/svg Icons/Merchant";
import Settlements from "@/components/svg Icons/Settlements";
import Payouts from "@/components/svg Icons/Payouts";
import Api from "@/components/svg Icons/Api";
import Users from "@/components/svg Icons/Users";
import Audit from "@/components/svg Icons/Audit";
import Settings from "@/components/svg Icons/Settings";
import Logout from "@/components/svg Icons/Logout";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SVGProps } from "react";

// Define route type
interface Route {
  icon: React.FC<SVGProps<SVGSVGElement> & { color?: string }>;
  label: string;
  href?: string;
  onClick?: () => Promise<void> | void;
}

const adminRoutes: Route[] = [
  { icon: Dashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Transactions, label: "Transactions", href: "/transactions" },
  { icon: Vnu, label: "vNUBANs", href: "/vnubans" },
  { icon: Merchant, label: "Merchant", href: "/merchant" },
  { icon: Settlements, label: "Settlements", href: "/settlements" },
  { icon: Payouts, label: "Payouts", href: "/payouts" },
  { icon: Api, label: "API Logs", href: "/logs" },
  { icon: Users, label: "Users", href: "/users" },
  { icon: Audit, label: "Audit Trails", href: "/audit" },
];

const actionRoutes: Route[] = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: Logout, label: "Logout", href: "/" },
];

export const SidebarRoutes = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      console.log("Logout response status:", res.status);
      let data = null;
      if (res.status !== 204 && res.headers.get("content-type")?.includes("application/json")) {
        data = await res.json();
        console.log("Logout response:", data);
      }

      if (res.ok && (!data || data.success)) {
        router.push("/login");
      } else {
        const errorMessage = data?.error || `Logout failed with status ${res.status}`;
        console.error("Logout failed:", errorMessage);
        alert(errorMessage); // Replace with your UI's error handling
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed due to an error");
    } finally {
      setIsLoading(false);
    }
  };

  const updatedActionRoutes = actionRoutes.map((route) =>
    route.label === "Logout" ? { ...route, onClick: handleLogout, href: undefined } : route
  );

  return (
    <div className="flex flex-col w-full">
      {adminRoutes.map((route) => (
        <SidebarItem
          key={route.href!}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
      <div className="mt-[150px] w-full">
        {updatedActionRoutes.map((route) => (
          <SidebarItem
            key={route.label}
            icon={route.icon}
            label={route.label}
            href={route.href}
            onClick={route.onClick}
            disabled={route.label === "Logout" && isLoading}
          />
        ))}
        <div className="flex items-center space-x-3 ml-6 mt-3 border-t-gray-700">
          <Avatar>
            <AvatarImage src="/images/avatar-placeholder.jpg" alt="John Doe" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">John Doe .A.</p>
            <p className="text-xs text-[#C80000] dark:text-gray-400">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};