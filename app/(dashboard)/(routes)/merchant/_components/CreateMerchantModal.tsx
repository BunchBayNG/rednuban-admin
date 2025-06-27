"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function CreateMerchantModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    merchantName: "",
    merchantBVN: "",
    contactName: "",
    contactEmail: "",
    accountName: "",
    accountNumber: "",
    status: "Active",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.merchantName) newErrors.merchantName = "Merchant Name is required";
    if (!formData.merchantBVN) newErrors.merchantBVN = "Merchant BVN is required";
    if (!formData.contactName) newErrors.contactName = "Contact Name is required";
    if (!formData.contactEmail) newErrors.contactEmail = "Contact Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) newErrors.contactEmail = "Invalid email format";
    if (!formData.accountName) newErrors.accountName = "Account Name is required";
    if (!formData.accountNumber) newErrors.accountNumber = "Account Number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setIsLoading(true);
    try {
      const [contactFirstName, ...contactLastName] = formData.contactName.split(" ");
      const payload = {
        organizationName: formData.merchantName,
        contactFirstName: contactFirstName || "",
        contactLastName: contactLastName.join(" ") || "",
        contactEmail: formData.contactEmail,
        phoneNumber: "",
        registeredBVN: formData.merchantBVN,
        businessLogoUrl: "/images/avatar-placeholder.jpg",
        productPrefix: `MCH-${formData.merchantName.slice(0, 3).toUpperCase()}`,
        settlementAccountName: formData.accountName,
        settlementAccountNumber: formData.accountNumber,
        orgStatus: formData.status,
      };
      console.log("Submitting PUT Request to /api/onboard-org:", JSON.stringify(payload, null, 2));

      const response = await fetch("/api/onboard-org", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Sends accessToken and userId cookies
        body: JSON.stringify(payload),
      });

      console.log("API Response Status (PUT):", response.status);
      const data = await response.json();
      console.log("API Response Body (PUT):", JSON.stringify(data, null, 2));

      if (response.ok && data.status) {
        toast.success("Merchant created successfully.");
        onSuccess();
        setFormData({
          merchantName: "",
          merchantBVN: "",
          contactName: "",
          contactEmail: "",
          accountName: "",
          accountNumber: "",
          status: "Active",
        });
        onClose();
      } else {
        throw new Error(data.message || `API error: ${response.status}`);
      }
    } catch (err) {
      console.error("Submit Error (PUT):", err);
      toast.error(err instanceof Error ? err.message : "Failed to create merchant.", {
        action: { label: "Log In", onClick: () => (window.location.href = "/login") },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="backdrop-blur-xs bg-[#140000B2] dark:bg-black/50" />
      <DialogContent className="sm:max-w-[571px] rounded-lg shadow-lg p-6">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            <h3 className="text-lg font-semibold">Create Merchant</h3>
            <p className="text-xs font-light text-gray-400 dark:text-gray-100">Fill the form to create a new merchant</p>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          {/* Merchant Details */}
          <div>
            <h3 className="text-xs font-light text-gray-400 dark:text-gray-100 mb-3">Merchant Details</h3>
            <div className="space-y-4">
              <div>
                <Input
                  id="merchantName"
                  placeholder="Merchant Name"
                  value={formData.merchantName}
                  onChange={handleInputChange}
                  className="w-full h-10 bg-gray-100 border-0 rounded-md p-2 text-sm focus:outline-none focus:ring-1"
                />
                {errors.merchantName && <p className="text-red-500 text-xs mt-1">{errors.merchantName}</p>}
              </div>
              <div>
                <Input
                  id="merchantBVN"
                  placeholder="Merchant BVN"
                  value={formData.merchantBVN}
                  onChange={handleInputChange}
                  className="w-full h-10 bg-gray-100 border-0 rounded-md p-2 text-sm focus:outline-none focus:ring-1"
                />
                {errors.merchantBVN && <p className="text-red-500 text-xs mt-1">{errors.merchantBVN}</p>}
              </div>
            </div>
          </div>

          {/* Contact Person Details */}
          <div>
            <h3 className="text-xs font-light text-gray-400 dark:text-gray-100 mb-3">Contact Person Details</h3>
            <div className="space-y-4 flex gap-3">
              <div className="w-full">
                <Input
                  id="contactName"
                  placeholder="Name"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  className="w-full h-10 bg-gray-100 border-0 rounded-md p-2 text-sm focus:outline-none focus:ring-1"
                />
                {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>}
              </div>
              <div className="w-full">
                <Input
                  id="contactEmail"
                  placeholder="Email"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="w-full h-10 bg-gray-100 border-0 rounded-md p-2 text-sm focus:outline-none focus:ring-1"
                />
                {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
              </div>
            </div>
          </div>

          {/* Merchant Bank Details */}
          <div>
            <h3 className="text-xs font-light text-gray-400 dark:text-gray-100 mb-3">Merchant Bank Details</h3>
            <div className="space-y-4 flex gap-3">
              <div className="w-full">
                <Input
                  id="accountName"
                  placeholder="Account Name"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  className="w-full h-10 bg-gray-100 border-0 rounded-md p-2 text-sm focus:outline-none focus:ring-1"
                />
                {errors.accountName && <p className="text-red-500 text-xs mt-1">{errors.accountName}</p>}
              </div>
              <div className="w-full">
                <Input
                  id="accountNumber"
                  placeholder="Account Number"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className="w-full h-10 bg-gray-100 border-0 rounded-md p-2 text-sm focus:outline-none focus:ring-1"
                />
                {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-xs font-light text-gray-400 dark:text-gray-100 mb-3">Status</h3>
            <Select value={formData.status} onValueChange={handleSelectChange}>
              <SelectTrigger className="w-full h-10 bg-gray-100 border-0 rounded-md p-2 text-sm focus:outline-none focus:ring-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Active
                  </span>
                </SelectItem>
                <SelectItem value="Inactive">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                    Inactive
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="mt-3 border-t pt-5">
          <Button variant="outline" onClick={onClose} className="rounded-md shadow-sm" disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-red-500 text-white hover:bg-red-600 rounded-md shadow-sm"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}