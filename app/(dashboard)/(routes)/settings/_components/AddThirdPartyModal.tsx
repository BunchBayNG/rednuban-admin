"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogOverlay } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AddThirdPartyModal({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (party: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "ISO",
    collectionsAccountName: "",
    collectionsAccountNumber: "",
    bankName: "",
    createdAt: new Date().toLocaleString("en-US", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })
      .replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+) (AM|PM)/, "$1/$2/$3-$4:$5:$00$6"), // e.g., "02/07/25-11:02:00AM"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...formData, id: Date.now() });
    onClose();
    setFormData({
      name: "",
      category: "ISO",
      collectionsAccountName: "",
      collectionsAccountNumber: "",
      bankName: "",
      createdAt: new Date().toLocaleString("en-US", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })
        .replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+) (AM|PM)/, "$1/$2/$3-$4:$5:$00$6"),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="backdrop-blur-xs bg-[#140000B2] dark:bg-black/50" />
      <DialogContent className="max-w-[570px] rounded-lg p-6 shadow-lg">
        <DialogHeader>
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
            <div>
              <DialogTitle className="text-sm font-bold text-gray-900 dark:text-gray-100">Add New Third Party</DialogTitle>
              <DialogDescription className="text-xs text-[#A5A5A5] ">Fill the form to add a new third party</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="add-third-party-form" className="space-y-6 ">
          <div className="flex flex-col gap-2">
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#F8F8F8] border-none rounded-md"
              placeholder="Third Party Name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="w-full bg-[#F8F8F8] border-none rounded-md">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ISO">ISO</SelectItem>
                <SelectItem value="Payment Gateway">Payment Gateway</SelectItem>
                <SelectItem value="Logistics">Logistics</SelectItem>
                <SelectItem value="Banking">Banking</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Input
              id="collectionsAccountName"
              value={formData.collectionsAccountName}
              onChange={(e) => setFormData({ ...formData, collectionsAccountName: e.target.value })}
              className="w-full bg-[#F8F8F8] border-none rounded-md"
              placeholder="Collection Account Name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="collectionsAccountNumber" className="text-xs font-medium text-[#A5A5A5] dark:text-gray-300">Collection Account Number</label>
            <Input
              id="collectionsAccountNumber"
              value={formData.collectionsAccountNumber}
              onChange={(e) => setFormData({ ...formData, collectionsAccountNumber: e.target.value })}
              className="w-full bg-[#F8F8F8] border-none rounded-md"
              placeholder="1234567890"
              type="number"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Input
              id="bankName"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              className="w-full bg-[#F8F8F8] border-none rounded-md"
              placeholder="Bank Name"
            />
          </div>
        </form>
        <DialogFooter className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose} className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
            Cancel
          </Button>
          <Button type="submit" form="add-third-party-form" className="bg-red-700 text-white hover:bg-red-800 rounded-md">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}