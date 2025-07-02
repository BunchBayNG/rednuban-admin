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
import { toast } from "sonner";
import Download from "@/components/svg Icons/Download";
import {  TbEdit, TbTrash } from "react-icons/tb";

interface ThirdParty {
  id: number;
  name: string;
  category: string;
  collectionsAccountName: string;
  collectionsAccountNumber: string;
  bankName: string;
  createdAt: string;
}

interface ThirdPartyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  thirdParty: ThirdParty | null;
  setSelectedThirdParty: (thirdParty: ThirdParty | null) => void;
  thirdParties: ThirdParty[];
}

export default function ThirdPartyDetailsModal({
  isOpen,
  onClose,
  thirdParty,
  setSelectedThirdParty,
  thirdParties,
}: ThirdPartyDetailsModalProps) {
  if (!thirdParty || !isOpen) return null;

  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0][0];
  };

  const handleExportDetails = async () => {
    try {
      const response = await fetch(`/api/export-third-party?id=${thirdParty.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Export failed");
      toast.success("Export successful! Check your downloads.");
      onClose();
    } catch (error) {
      toast.error("Export failed. Please try again later.");
      console.error(error);
    }
  };

  // const handleEdit = () => {
  //   toast.success(`Edit initiated for ${thirdParty.name}`);
  //   console.log(`Edit attempted for Third Party ID ${thirdParty.id}`);
  // };

  const handleDelete = () => {
    toast.error(`Delete initiated for ${thirdParty.name}`);
    console.log(`Delete attempted for Third Party ID ${thirdParty.id}`);
  };

  const currentIndex = thirdParties.findIndex((t) => t.id === thirdParty.id);
  const prevThirdParty = currentIndex > 0 ? thirdParties[currentIndex - 1] : null;
  const nextThirdParty = currentIndex < thirdParties.length - 1 ? thirdParties[currentIndex + 1] : null;

  const handlePrev = () => {
    if (prevThirdParty) {
      setSelectedThirdParty(prevThirdParty);
    }
  };

  const handleNext = () => {
    if (nextThirdParty) {
      setSelectedThirdParty(nextThirdParty);
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
              <h2 className="text-sm font-semibold">Third Party Details</h2>
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
              Third Party Name: <span className="text-primary text-sm font-light">{thirdParty.name}</span>
            </span>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={handlePrev} disabled={!prevThirdParty}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNext} disabled={!nextThirdParty}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          {/* Summary Section */}
          <div className="space-y-4 py-3">
            <h3 className="text-xs text-gray-500">Summary </h3>
            <div className="flex items-center justify-between space-x-1 pb-5 border-b border-[#F8F8F8] dark:border-[#2A2A2A]">
              <div className="flex items-center gap-2">
                <Avatar className="w-13 h-13">
                  <AvatarImage src="/images/avatar-placeholder.jpg" alt="Third Party Avatar" />
                  <AvatarFallback>{getInitials(thirdParty.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{thirdParty.name}</p>
                  <p className="text-xs text-gray-500">{thirdParty.category}</p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Button className="hover:bg-red-600 ml-auto" ><TbEdit/> Edit Third Party</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="bg-[#F5F5F5] dark:bg-card rounded-sm">
                      <BsThreeDots />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleDelete} className="text-[#FF0606]">
                      <TbTrash className="h-4 w-4 text-[#FF0606]" /> Delete Third Party
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportDetails}>
                      <Download /> Export Details
                    </DropdownMenuItem>
                    
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {/* <div className="flex justify-between text-sm border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-1">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Category</span>
                <span>{thirdParty.category}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Collection Account Name</span>
                <span>{thirdParty.collectionsAccountName}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Collection Account Number</span>
                <span>{thirdParty.collectionsAccountNumber}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Bank Name</span>
                <span>{thirdParty.bankName}</span>
              </div>
            </div> */}
          </div>
          {/* Third Party Details */}
          <div className="space-y-4">
            <div className="flex flex-col gap-4 text-sm">
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2">
                <p className="font-medium">Category:</p>
                <p>{thirdParty.category}</p>
              </span>
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2">
                <p className="font-medium">Collection Account Name:</p>
                <span>{thirdParty.collectionsAccountName}</span>
              </span>
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2">
                <p className="font-medium">Collection Account Number:</p>
                <span>{thirdParty.collectionsAccountNumber}</span>
              </span>
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2">
                <p className="font-medium">Bank Name:</p>
                <span>{thirdParty.bankName}</span>
              </span>
              <span className="flex gap-2">
                <p className="font-medium">Last Modified By:</p>
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User Avatar" />
                    <AvatarFallback>FB</AvatarFallback>
                  </Avatar>
                  <span>Felix Babatunde Adebayo</span>
                </div>
              </span>
            </div>
          </div>
          {/* Footer */}
          <div className="mt-auto pt-4 text-sm space-y-4">
            <h3 className="text-gray-500 text-xs">Footer</h3>
            <div>
              <span className="flex gap-2">
                <p className="font-medium">Last Updated:</p>
                <span>{thirdParty.createdAt}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
