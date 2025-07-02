"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BsThreeDots } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Toaster, toast } from "sonner";

interface Role {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  assignedMembers: string[];
  lastModifiedBy: string;
  permissions: string[];
}

interface RolesPrivilegesDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  setSelectedRole: (role: Role | null) => void;
  roles: Role[];
}

export default function RolesPrivilegesDetailsModal({
  isOpen,
  onClose,
  role,
  setSelectedRole,
  roles,
}: RolesPrivilegesDetailsModalProps) {
  if (!role || !isOpen) return null;

  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0][0];
  };

  const currentIndex = roles.findIndex((r) => r.id === role.id);
  const prevRole = currentIndex > 0 ? roles[currentIndex - 1] : null;
  const nextRole = currentIndex < roles.length - 1 ? roles[currentIndex + 1] : null;

  const handlePrev = () => {
    if (prevRole) {
      setSelectedRole(prevRole);
    }
  };

  const handleNext = () => {
    if (nextRole) {
      setSelectedRole(nextRole);
    }
  };

  const handleExportDetails = async () => {
    try {
      // Simulate export functionality
      toast.success(`Export successful for Role ID ${role.id}`);
      onClose();
    } catch (error) {
      toast.error("Export failed. Please try again later.");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-[50] flex justify-end my-3 mr-3">
      <div
        className="fixed inset-0 bg-[#140000B2] backdrop-blur-xs dark:bg-black/50"
        onClick={onClose}
      />
      <div
        className="h-full w-[45%] bg-background shadow-lg overflow-x-auto transform transition-transform duration-300 ease-in-out rounded-xl"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-[#F8F8F8] dark:border-[#2A2A2A]">
            <div className="flex flex-col gap-0">
              <h2 className="text-sm font-semibold">Role Details</h2>
              <p className="text-xs text-gray-500 mb-4">Get complete oversight on platform operations</p>
            </div>
            <div>
              <Button variant="ghost" className="p-0 h-auto" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between border-b border-[#F8F8F8] dark:border-[#2A2A2A] py-3">
            <span className="text-red-500 font-medium text-sm">
              Role: <span className="text-primary text-sm font-light">{role.name}</span>
            </span>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={handlePrev} disabled={!prevRole}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNext} disabled={!nextRole}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          {/* Summary Section */}
          <div className="space-y-4 py-3">
            <h3 className="text-xs text-gray-500">Summary Section</h3>
            <div className="flex items-center justify-between space-x-1 pb-5 border-b border-[#F8F8F8] dark:border-[#2A2A2A]">
              <div className="flex items-center gap-2">
                <Avatar className="w-13 h-13">
                  <AvatarImage src="/images/avatar-placeholder.jpg" alt="Role Avatar" />
                  <AvatarFallback>{getInitials(role.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{role.name}</p>
                  <p className="text-xs text-gray-500">{role.description}</p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Button className="hover:bg-red-600 ml-auto">View Profile</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="bg-[#F5F5F5] dark:bg-card rounded-sm">
                      <BsThreeDots />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleExportDetails}>
                      Export Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex justify-between text-sm border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-1">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Assigned Members</span>
                <span>{role.assignedMembers.join(", ") || "N/A"}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Last Modified By</span>
                <span>{role.lastModifiedBy || "N/A"}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Created At</span>
                <span>{role.createdAt}</span>
              </div>
            </div>
          </div>
          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="text-xs text-gray-500">Permissions</h3>
            <div className="flex flex-col gap-2 text-sm">
              {role.permissions.map((permission, index) => (
                <span key={index} className="flex gap-2">
                  <p className="font-medium">•</p>
                  <p>{permission}</p>
                </span>
              ))}
            </div>
          </div>
          {/* Footer */}
          <div className="mt-auto pt-4 text-sm space-y-4">
            <h3 className="text-gray-500 text-xs">Footer</h3>
            <div>
              <span className="flex gap-2">
                <p className="font-medium">Last Updated:</p>
                <span>{role.createdAt}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}