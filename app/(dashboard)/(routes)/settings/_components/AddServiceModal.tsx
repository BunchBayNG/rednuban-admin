"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { BiSave } from "react-icons/bi";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { serviceName: string; description: string; feeAmount: string; feeType: string; percentageCap?: string }) => void;
}

export function AddServiceModal({ isOpen, onClose, onSave }: AddServiceModalProps) {
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [feeAmount, setFeeAmount] = useState("");
  const [feeType, setFeeType] = useState("Fiat");
  const [percentageCap, setPercentageCap] = useState("");
  const [showCapField, setShowCapField] = useState(false);

  const handleSave = () => {
    const serviceData = {
      serviceName,
      description,
      feeAmount,
      feeType,
      ...(showCapField && percentageCap ? { percentageCap } : {}),
    };
    onSave(serviceData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="backdrop-blur-xs bg-[#140000B2] dark:bg-black/50" />
      <VisuallyHidden>
        <DialogTitle>Add Service Modal</DialogTitle>
      </VisuallyHidden>
      <DialogContent className="sm:max-w-[500px] rounded-lg">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="">
            <h3 className="text-sm font-semibold">Add New Service</h3>
            <p className="text-xs font-light text-gray-400 dark:text-gray-100">
            Fill the form to add a new services & it&apos;s configurations 
            </p>
          </DialogTitle>
        </DialogHeader>
        <div className=" ">
          <div className="relative">
            <label className="text-xs text-[#A5A5A5]">Service Name</label>
            <Input
              type="text"
              placeholder="Service name"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value.slice(0, 100))} // Limit to 100 characters
              className="w-full p-1.5 mt-1 border-none text-sm  rounded-md pr-16 bg-[#F8F8F8]" // Added padding-right for counter
            />
            <span className="absolute bottom-1 right-2 text-xs text-gray-500">
              {serviceName.length}/100
            </span>
          </div>
          <div className="relative">
            <label className="text-xs text-[#A5A5A5]">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 250))} // Limit to 250 characters
              placeholder="Description"
              className="w-full p-2 mt-1 bg-[#F8F8F8] rounded-md resize-none h-24 pr-16 text-sm" // Added padding-right and height
            />
            <span className="absolute bottom-1.5 right-2 text-xs text-gray-500">
              {description.length}/250
            </span>
          </div>
          <div className="border-t mt-3">
            <p className="text-xs text-[#A5A5A5] py-3">Service Configurations</p>
          <div>
            <label className="text-xs text-[#A5A5A5]">Fee Amount</label>
            <Input
              type="text"
              placeholder="0.00"
              value={feeAmount}
              onChange={(e) => setFeeAmount(e.target.value)}
              className="w-full p-1.5 mt-1 bg-[#F8F8F8] border-none rounded-md"
            />
          </div>
          <div>
            <label className="text-xs text-[#A5A5A5]">Type</label>
            <Select
              value={feeType}
              onValueChange={(value) => {
                setFeeType(value);
                setShowCapField(value === "Percentage with Cap");
              }}
            >
              <SelectTrigger className="w-full p-2 border rounded-md">
                <SelectValue placeholder="Select fee type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fiat">Fiat</SelectItem>
                <SelectItem value="Percentage with Cap">Percentage with Cap</SelectItem>
              </SelectContent>
            </Select>
          </div>
          </div>
          {showCapField && (
            <div>
              <label className="text-xs text-[#A5A5A5]">Percentage Cap</label>
              <Input
                type="text"
                placeholder="500"
                value={percentageCap}
                onChange={(e) => setPercentageCap(e.target.value)}
                className="w-full p-1.5 mt-1 border rounded-md"
              />
            </div>
          )}
          <div className="flex justify-end gap-3 mt-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-[#C80000] hover:bg-[#A60000] text-white" onClick={handleSave}>
              <BiSave className="mr-2" /> Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}