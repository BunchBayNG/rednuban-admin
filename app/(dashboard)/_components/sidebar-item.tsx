"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
  icon: React.FC<React.SVGProps<SVGSVGElement> & { color?: string }>;
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean; // Added disabled prop
}

export const SidebarItem = ({ icon: Icon, label, href, onClick, disabled }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  
  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`) ||
    (label === "Logout" && pathname === "/");

  const handleClick = () => {
    if (disabled) return; // Prevent click if disabled
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      disabled={disabled}
      className={cn(
        "flex items-center gap-x-2 text-sm font-[500] pl-6 text-[#737373] transition-all hover:bg-slate-300/20 dark:hover:bg-slate-700/20 w-full",
        isActive &&
          "bg-gradient-to-r from-[#FFDCDE] to-transparent text-[#C80000] border-l-[#C80000] border-l-2 dark:from-[#C80000]/20 dark:to-transparent dark:text-[#C80000] dark:border-l-[#C80000]",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="flex items-center gap-x-2 py-3">
        <Icon
          color={isActive ? "#C80000" : "#737373"}
          className={cn(
            "transition-colors duration-200",
            !isActive && "dark:[color:#FFFFFF]"
          )}
        />
        {label}
      </div>
    </button>
  );
};