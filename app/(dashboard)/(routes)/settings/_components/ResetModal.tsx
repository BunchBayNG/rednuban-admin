"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Question from "@/components/svg Icons/Question";

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

export function ResetModal({ isOpen, onClose, onReset }: ResetModalProps) {
  const handleResetConfirm = () => {
    onReset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="backdrop-blur-xs bg-[#140000B2] dark:bg-black/50" />
      <VisuallyHidden>
        <DialogTitle>Reset Modal</DialogTitle>
      </VisuallyHidden>
      <DialogContent className="sm:max-w-[500px] rounded-lg">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="">
            <h3 className="text-sm font-semibold">Confirm Action</h3>
            <p className="text-xs font-light text-gray-400 dark:text-gray-100">
            Let&apos;s make sure you really want to perform this action
            </p>
          </DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-6 flex-col ">
            <div className="flex flex-col items-center justify-center gap-3">
            <Question />
            <h3>Reset to Default Configurations?</h3>
          <p className="text-sm text-center text-gray-600">
          Are you sure you want to reset all service fees to default values? This action cannot be undone
           </p>
            </div>
           
          <div className="flex justify-end gap-3 border-t pt-4 mb-[-20px]">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="bg-[#C80000] hover:bg-[#A60000] text-white"
              onClick={handleResetConfirm}
            >Yes, Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}