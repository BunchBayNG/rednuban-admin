
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: {
    dateRangeFrom: string;
    dateRangeTo: string;
    format: string;
    fields: Record<string, boolean>;
  }) => void;
  fieldOptions: { label: string; value: string }[];
}

export function ExportModal({ isOpen, onClose, onExport, fieldOptions }: ExportModalProps) {
  const [dateRangeFrom, setDateRangeFrom] = useState<Date | undefined>(new Date());
  const [dateRangeTo, setDateRangeTo] = useState<Date | undefined>(new Date());
  const [format, setFormat] = useState("CSV");
  const [fields, setFields] = useState<Record<string, boolean>>(
    fieldOptions.reduce((acc, { value }) => ({ ...acc, [value]: true }), {})
  );

  const allSelected = Object.values(fields).every((selected) => selected);
  const handleSelectAll = () => {
    setFields(
      fieldOptions.reduce((acc, { value }) => ({ ...acc, [value]: !allSelected }), {})
    );
  };

  const handleExport = () => {
    onExport({
      dateRangeFrom: dateRangeFrom ? dateRangeFrom.toISOString().split("T")[0] : "",
      dateRangeTo: dateRangeTo ? dateRangeTo.toISOString().split("T")[0] : "",
      format,
      fields,
    });
    // Generate filename with current date (YYYYMMDD format)
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0].replace(/-/g, "");
    const filename = `RedPay_Dashboard_${formattedDate}.csv`;
    toast.success(`Exported ${filename} successfully`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="backdrop-blur-xs bg-[#140000B2] dark:bg-black/50" />
      <VisuallyHidden>
            <DialogTitle>Export Modal</DialogTitle>
          </VisuallyHidden>
      <DialogContent className="sm:max-w-[571px] rounded-lg ">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="">
            <h3 className="text-lg font-semibold">Export Dashboard Data</h3>
            <p className="text-xs font-light text-gray-400 dark:text-gray-100">
              Select the data you&apos;d like to export and the format
            </p>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Date Range */}
          <div>
            <p className="text-xs font-light mb-2 text-gray-500">Date Range</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <label htmlFor="from-date" className="text-xs text-gray-400 dark:text-gray-100">
                  From:
                </label>
                <DatePicker
                  id="from-date"
                  date={dateRangeFrom}
                  onSelect={setDateRangeFrom}
                  placeholder="Select date"
                />
              </div>
              <div className="relative flex-1">
                <label htmlFor="to-date" className="text-xs text-gray-400 dark:text-gray-100">
                  To:
                </label>
                <DatePicker
                  id="to-date"
                  date={dateRangeTo}
                  onSelect={setDateRangeTo}
                  placeholder="Select date"
                />
              </div>
            </div>
          </div>

          {/* Fields to Export */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-light text-gray-500">Options to Select</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="text-sm text-[#C80000]"
              >
                {allSelected ? "Clear selections" : "Select all"}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {fieldOptions.map(({ label, value }) => (
                <label key={value} className="flex items-center gap-2">
                  <Checkbox
                    checked={fields[value]}
                    onCheckedChange={(checked) =>
                      setFields((prev) => ({ ...prev, [value]: !!checked }))
                    }
                    className="h-4 w-4 border-gray-300 data-[state=checked]:bg-[#C80000] data-[state=checked]:border-[#C80000]"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Format Selection and Export Button */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2 border p-1 rounded-md ">
              {["CSV", "Excel"].map((fmt) => (
                <Button
                  key={fmt}
                  variant={format === fmt ? "outline" : "ghost"}
                  className={`flex-1 rounded-md text-sm ${
                    format === fmt
                      ? " border-gray-300 text-gray-700 dark:text-gray-200"
                      : "text-gray-500 hover:bg-transparent"
                  }`}
                  onClick={() => setFormat(fmt)}
                >
                  {fmt}
                </Button>
              ))}
            </div>
            <Button
              onClick={handleExport}
              className="w-[280px] bg-[#C80000] hover:bg-[#A60000] text-white rounded-md"
            >
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Updated DatePicker component
export function DatePicker({ id, date, onSelect, placeholder }: { id: string; date: Date | undefined; onSelect: (date: Date | undefined) => void; placeholder: string }) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date | undefined>(date);

  const handleSelect = (selectedDate: Date | undefined) => {
    onSelect(selectedDate);
    if (selectedDate) {
      setMonth(selectedDate); // Manually update month when a date is selected
    }
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className="w-full justify-start text-left font-normal pl-3 pr-10 py-2 border rounded-md text-sm"
          >
            <span>{date ? formatDate(date) : placeholder}</span>
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-30" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            month={month}
            className="rounded-md border"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Helper functions from Calendar28
function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// function isValidDate(date: Date | undefined) {
//   if (!date) return false;
//   return !isNaN(date.getTime());
// }