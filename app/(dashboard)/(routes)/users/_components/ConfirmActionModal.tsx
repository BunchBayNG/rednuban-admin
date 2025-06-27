"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogClose, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { Toaster } from "sonner";
import Confirm from "@/components/svg Icons/Confirm";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  action: "Enable" | "Disable";
  onConfirm: () => void;
}

export default function ConfirmActionModal({ isOpen, onClose,  action, onConfirm }: ConfirmActionModalProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogOverlay className="backdrop-blur-xs bg-[#140000B2] dark:bg-black/50"/>
        <VisuallyHidden>
            <DialogTitle>Export Modal</DialogTitle>
          </VisuallyHidden>
      <DialogContent className="sm:max-w-[571px] text-center">
        <DialogHeader className="flex justify-between items-start border-b  mb-4">
          <h2 className="text-sm font-bold">Confirm Action</h2>
          <p className="text-xs text-gray-500 mb-4">Let&apos;s make sure they really want to perform this action</p>
          <DialogClose asChild>
          </DialogClose>
        </DialogHeader>
        
        <div className="flex flex-col items-center mb-6">
          <Confirm />
          <h3 className="text-lg font-semibold">{action === "Enable" ? "Enable User?" : "Disable User?"}</h3>
          <p className="text-xs text-gray-500 mt-2">
            {action === "Enable"
              ? "Are you sure you want to enable this user. You agree to grant user ability to regain access to this application?"
              : "Are you sure you want to disable this user. You agree to temporarily restrict access to this application?"}
          </p>
        </div>
        <DialogFooter className="flex justify-end gap-2 border-t pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button className="bg-red-500 text-white hover:bg-red-600" onClick={handleConfirm}>
            {action === "Enable" ? "Enabling User" : "Yes, Disable User"}
          </Button>
        </DialogFooter>
        <Toaster />
      </DialogContent>
    </Dialog>
  );
}
