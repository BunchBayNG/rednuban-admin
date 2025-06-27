import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (role: { name: string; description: string; permissions: string[] }) => void;
}

export const AddRoleModal = ({ isOpen, onClose, onSubmit }: AddRoleModalProps) => {
  const [newRole, setNewRole] = useState<{ name: string; description: string; permissions: string[] }>({ name: "", description: "", permissions: [] });
  const [showClearButton, setShowClearButton] = useState(false); // State to toggle between Select All and Clear Selections
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({}); // Track open/closed state for each category

  const handleSubmit = () => {
    onSubmit(newRole);
    setNewRole({ name: "", description: "", permissions: [] }); // Reset form
    setShowClearButton(false); // Reset to Select All
    setOpenCategories({}); // Reset category states
    onClose();
  };

  // Define permission categories and their sub-options
  const permissionCategories = {
    "User Management": ["View Users", "Delete Users", "Create Users", "Edit Users", "Assign Roles", "View User Activity", "Disable Users"],
    "Merchant Management": ["View Merchants", "Disable Merchants", "Create Merchants", "Edit Merchants", "Enable Merchants", "View Merchant Activity"],
    "Transaction Management": ["View Transactions", "Reject Transactions", "Initiate Transactions", "Approve Transactions", "Enable Merchants", "View Transaction Details"],
    "Payout Management": ["View Payouts", "Complete Payouts", "Request Payouts", "View Payout Details", "Process Payouts"],
    "Settlement Management": ["View Settlements", "Initiate Settlements", "Complete Settlements", "View Settlement Details"],
    "API Management": ["View API Logs", "Retry API Requests", "View API Details"],
    "Audit & Reporting": ["View Audit Trails", "Export Audit Trails", "View Reports", "Export Reports"],
    "Settings & Configuration": ["Manage Roles & Privileges", "Manage Variables Config", "Manage Services", "Manage Third Parties"],
    "System Administration": ["Access All Sections", "Approve Access Requests", "Manage System Configuration", "Conduct Audits"],
  };

  const handleSelectAll = () => {
    setNewRole({ ...newRole, permissions: Object.values(permissionCategories).flat() });
    setShowClearButton(true); // Switch to Clear Selections
  };

  const handleClearSelections = () => {
    setNewRole({ ...newRole, permissions: [] });
    setShowClearButton(false); // Switch back to Select All
  };

  const handlePermissionToggle = (permission: string) => {
    const isChecked = newRole.permissions.includes(permission);
    const updated = isChecked
      ? newRole.permissions.filter(p => p !== permission)
      : [...newRole.permissions, permission];
    setNewRole({ ...newRole, permissions: updated });
  };

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="backdrop-blur-xs bg-[#140000B2] dark:bg-black/50" />
      <DialogContent className="sm:max-w-[571px]">
        <DialogHeader>
          <DialogTitle>Add New Role</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-gray-500">Fill the form to add a new role</p>
        <div className="space-y-2">
          <div>
            <h3 className="text-xs text-gray-500 mb-2">Role Details</h3>
            <div className="space-y-2">
              <Input
                placeholder="Role Name"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                className="w-full h-12 p-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-1 "
              />
              <p className="text-xs text-gray-400">0/100</p>
              <Input
                placeholder="Description"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                className="w-full h-24 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-1  resize-none"
              />
              <p className="text-xs text-gray-400">0/250</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-xs text-gray-500">Permissions</h3>
              <div>
                {!showClearButton ? (
                  <Button variant="link" className="text-red-500 mr-2" onClick={handleSelectAll}>
                    Select All
                  </Button>
                ) : (
                  <Button variant="link" className="text-red-500" onClick={handleClearSelections}>
                    Clear Selections
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-2 mt-2">
              {Object.entries(permissionCategories).map(([category, options]) => (
                <Collapsible
                  key={category}
                  open={openCategories[category] || false}
                  onOpenChange={() => toggleCategory(category)}
                >
                  <CollapsibleTrigger asChild>
                    <h4 className="text-xs text-gray-700 mb-1 flex justify-between items-center cursor-pointer">
                      {category}
                      <span>{openCategories[category] ? <IoIosArrowDown /> : <IoIosArrowForward />}</span>
                    </h4>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 space-y-1">
                    {options.map((option) => (
                      <div key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newRole.permissions.includes(option)}
                          onChange={() => handlePermissionToggle(option)}
                          className="mr-2 h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <span className="text-xs text-gray-700">{option}</span>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-red-500 text-white hover:bg-red-600" onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};