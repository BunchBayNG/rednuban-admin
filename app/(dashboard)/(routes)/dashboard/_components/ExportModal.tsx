"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  endpointPrefix: string; // e.g., "vnuban", "users"
  fieldOptions: { label: string; value: string }[];
}

export function ExportModal({ isOpen, onClose, endpointPrefix}: ExportModalProps) {
  const [dateRangeFrom, setDateRangeFrom] = useState<Date | undefined>(new Date());
  const [dateRangeTo, setDateRangeTo] = useState<Date | undefined>(new Date());
  const [format, setFormat] = useState("CSV");

  const handleExport = async () => {
    const startDate = dateRangeFrom ? dateRangeFrom.toISOString().split("T")[0] : "";
    const endDate = dateRangeTo ? dateRangeTo.toISOString().split("T")[0] : "";

    const apiUrl = `/api/exports/${endpointPrefix}/${format.toLowerCase()}?${startDate ? `startDate=${encodeURIComponent(startDate)}` : ""}${endDate ? `&endDate=${encodeURIComponent(endDate)}` : ""}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await response.blob();
      const filename =
        response.headers.get("content-disposition")?.match(/filename="(.+)"/)?.[1] ||
        `${endpointPrefix}_${new Date().toISOString().split("T")[0]}.${format.toLowerCase()}`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(`Exported ${filename} successfully`);
      onClose();
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="backdrop-blur-xs bg-[#140000B2] dark:bg-black/50" />
      <VisuallyHidden>
        <DialogTitle>Export Modal</DialogTitle>
      </VisuallyHidden>
      <DialogContent className="sm:max-w-[571px] rounded-lg">
        <DialogHeader className="border-b pb-4">
          <h3 className="text-lg font-semibold">Export Dashboard Data</h3>
          <p className="text-xs font-light text-gray-400 dark:text-gray-100">
            Select the data you&apos;d like to export and the format
          </p>
        </DialogHeader>
        <div className="space-y-6">
          {/* Date Range */}
          <div>
            <p className="text-xs font-light mb-2 text-gray-500">Date Range</p>
            <div className="flex gap-2">
              <DatePicker id="from-date" date={dateRangeFrom} onSelect={setDateRangeFrom} placeholder="Select date" label="From:" />
              <DatePicker id="to-date" date={dateRangeTo} onSelect={setDateRangeTo} placeholder="Select date" label="To:" />
            </div>
          </div>

          {/* Format Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2 border p-1 rounded-md">
              {["CSV", "PDF", "Excel"].map((fmt) => (
                <Button
                  key={fmt}
                  variant={format === fmt ? "outline" : "ghost"}
                  className={`flex-1 rounded-md text-sm ${
                    format === fmt ? "border-gray-300 text-gray-700 dark:text-gray-200" : "text-gray-500 hover:bg-transparent"
                  }`}
                  onClick={() => setFormat(fmt)}
                >
                  {fmt}
                </Button>
              ))}
            </div>
            <Button onClick={handleExport} className="w-[280px] bg-[#C80000] hover:bg-[#A60000] text-white rounded-md">
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DatePicker({ id, date, onSelect, placeholder, label }: { id: string; date: Date | undefined; onSelect: (date: Date | undefined) => void; placeholder: string; label: string }) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date | undefined>(date);

  const handleSelect = (selectedDate: Date | undefined) => {
    onSelect(selectedDate);
    if (selectedDate) setMonth(selectedDate);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1 flex-1">
      <label htmlFor={id} className="text-xs text-gray-400 dark:text-gray-100">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button id={id} variant="outline" className="w-full justify-start text-left font-normal pl-3 pr-10 py-2 border rounded-md text-sm">
            <span>{date ? formatDate(date) : placeholder}</span>
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-30" align="start">
          <Calendar mode="single" selected={date} onSelect={handleSelect} month={month} className="rounded-md border" />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" });
}
