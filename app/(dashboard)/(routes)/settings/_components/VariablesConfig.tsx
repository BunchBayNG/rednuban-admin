"use client";

import { Button } from "@/components/ui/button";
import {  Search } from "lucide-react";
import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { TbEdit } from "react-icons/tb";
import { Input } from "@/components/ui/input";

function VariablesConfig() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<{
    [key: string]: { [key: string]: boolean };
  }>({
    "Bank Details Configurations": {
      "Bank Product Phone": false,
      "Bank Sender Email": false,
    },
    "Bank Support Configurations": {
      "Bank Support Email": false,
      "Bank Support Phone": false,
    },
    "Bank Settlements": {
      "Bank Settlement Account": false,
      "Bank Settlement Account Name": false,
    },
    "Bank Access": {
      "Bank Allowed Merchant Users": false,
      "Bank Allowed Transient Account (Hours)": false,
    },
    "System Password": {
      "System Password History Password Size": false,
      "System Password Minimum Length": false,
      "System Password Maximum Length": false,
      "System Password Expiration (Days)": false,
      "System Password Reset Expiration (Minutes)": false,
    },
  });
  const [searchQuery, setSearchQuery] = useState("");

  

  const handleEditToggle = (section: string, field: string) => {
    setEditMode((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field],
      },
    }));
  };

  const handleSave = (section: string, field: string, value: string) => {
    console.log(`Saving ${section} - ${field} with value: ${value}`);
    setEditMode((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: false,
      },
    }));
    // Here you would typically update a state or API with the new value
  };

  const handleCancel = (section: string, field: string) => {
    setEditMode((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: false,
      },
    }));
    // Optionally reset to original value if needed
  };

  const renderForm = (section: string) => {
    const forms = {
      "Bank Details Configurations": (
        <div className="p-4 pt-0 border-b mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm flex mr-10">Bank Product Phone</p>
              <input
                type="text"
                placeholder="08100009099"
                className="p-1.5 mt-1 border rounded-md"
                disabled={!editMode["Bank Details Configurations"]["Bank Product Phone"]}
              />
            </div>
            <div className="flex gap-3">
              {editMode["Bank Details Configurations"]["Bank Product Phone"] ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleCancel("Bank Details Configurations", "Bank Product Phone")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      handleSave(
                        "Bank Details Configurations",
                        "Bank Product Phone",
                        (document.querySelector("input[placeholder='08100009099']") as HTMLInputElement)?.value || ""
                      )
                    }
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button onClick={() => handleEditToggle("Bank Details Configurations", "Bank Product Phone")}>
                  <TbEdit /> Edit
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <p className="text-sm flex mr-12.5">Bank Sender Email</p>
              <input
                type="text"
                placeholder="redpay@example.com"
                className="p-1.5 mt-1 border rounded-md"
                disabled={!editMode["Bank Details Configurations"]["Bank Sender Email"]}
              />
            </div>
            <div className="flex gap-3">
              {editMode["Bank Details Configurations"]["Bank Sender Email"] ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleCancel("Bank Details Configurations", "Bank Sender Email")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      handleSave(
                        "Bank Details Configurations",
                        "Bank Sender Email",
                        (document.querySelector("input[placeholder='redpay@example.com']") as HTMLInputElement)?.value || ""
                      )
                    }
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button onClick={() => handleEditToggle("Bank Details Configurations", "Bank Sender Email")}>
                  <TbEdit /> Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      ),
      "Bank Support Configurations": (
        <div className="p-4 pt-0 border-b mb-4">
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <p className="text-sm flex mr-12.5">Bank Support Email</p>
              <input
                type="text"
                placeholder="redpay@example.com"
                className="p-1.5 mt-1 border rounded-md"
                disabled={!editMode["Bank Support Configurations"]["Bank Support Email"]}
              />
            </div>
            <div className="flex gap-3">
              {editMode["Bank Support Configurations"]["Bank Support Email"] ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleCancel("Bank Support Configurations", "Bank Support Email")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      handleSave(
                        "Bank Support Configurations",
                        "Bank Support Email",
                        (document.querySelectorAll("input[placeholder='redpay@example.com']")[0] as HTMLInputElement)?.value || ""
                      )
                    }
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button onClick={() => handleEditToggle("Bank Support Configurations", "Bank Support Email")}>
                  <TbEdit /> Edit
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <p className="text-sm flex mr-12.5">Bank Support Phone</p>
              <input
                type="text"
                placeholder="08100009099"
                className="p-1.5 mt-1 border rounded-md"
                disabled={!editMode["Bank Support Configurations"]["Bank Support Phone"]}
              />
            </div>
            <div className="flex gap-3">
              {editMode["Bank Support Configurations"]["Bank Support Phone"] ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleCancel("Bank Support Configurations", "Bank Support Phone")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      handleSave(
                        "Bank Support Configurations",
                        "Bank Support Phone",
                        (document.querySelectorAll("input[placeholder='08100009099']")[0] as HTMLInputElement)?.value || ""
                      )
                    }
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button onClick={() => handleEditToggle("Bank Support Configurations", "Bank Support Phone")}>
                  <TbEdit /> Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      ),
      "Bank Settlements": (
        <div className="p-4 pt-0 border-b mb-4">
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <p className="text-sm flex mr-12.5">Bank Settlement Account</p>
              <input
                type="text"
                placeholder="102806908"
                className="p-1.5 mt-1 border rounded-md"
                disabled={!editMode["Bank Settlements"]["Bank Settlement Account"]}
              />
            </div>
            <div className="flex gap-3">
              {editMode["Bank Settlements"]["Bank Settlement Account"] ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleCancel("Bank Settlements", "Bank Settlement Account")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      handleSave(
                        "Bank Settlements",
                        "Bank Settlement Account",
                        (document.querySelector("input[placeholder='102806908']") as HTMLInputElement)?.value || ""
                      )
                    }
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button onClick={() => handleEditToggle("Bank Settlements", "Bank Settlement Account")}>
                  <TbEdit /> Edit
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <p className="text-sm flex mr-12.5">Bank Settlement Account Name</p>
              <input
                type="text"
                placeholder="UBA/REDPAY VIRTUAL ACCOUNT SERVICE"
                className="p-1.5 mt-1 border rounded-md"
                disabled={!editMode["Bank Settlements"]["Bank Settlement Account Name"]}
              />
            </div>
            <div className="flex gap-3">
              {editMode["Bank Settlements"]["Bank Settlement Account Name"] ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleCancel("Bank Settlements", "Bank Settlement Account Name")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      handleSave(
                        "Bank Settlements",
                        "Bank Settlement Account Name",
                        (document.querySelector("input[placeholder='UBA/REDPAY VIRTUAL ACCOUNT SERVICE']") as HTMLInputElement)?.value || ""
                      )
                    }
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button onClick={() => handleEditToggle("Bank Settlements", "Bank Settlement Account Name")}>
                  <TbEdit /> Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      ),
      "Bank Access": (
        <div className="p-4 pt-0 border-b mb-4">
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <p className="text-sm flex mr-12.5">Bank Allowed Merchant Users</p>
              <input
                type="text"
                placeholder="10"
                className="p-1.5 mt-1 border rounded-md"
                disabled={!editMode["Bank Access"]["Bank Allowed Merchant Users"]}
              />
            </div>
            <div className="flex gap-3">
              {editMode["Bank Access"]["Bank Allowed Merchant Users"] ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleCancel("Bank Access", "Bank Allowed Merchant Users")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      handleSave(
                        "Bank Access",
                        "Bank Allowed Merchant Users",
                        (document.querySelector("input[placeholder='10']") as HTMLInputElement)?.value || ""
                      )
                    }
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button onClick={() => handleEditToggle("Bank Access", "Bank Allowed Merchant Users")}>
                  <TbEdit /> Edit
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <p className="text-sm flex mr-12.5">Bank Allowed Transient Account (Hours)</p>
              <input
                type="text"
                placeholder="2"
                className="p-1.5 mt-1 border rounded-md"
                disabled={!editMode["Bank Access"]["Bank Allowed Transient Account (Hours)"]}
              />
            </div>
            <div className="flex gap-3">
              {editMode["Bank Access"]["Bank Allowed Transient Account (Hours)"] ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleCancel("Bank Access", "Bank Allowed Transient Account (Hours)")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      handleSave(
                        "Bank Access",
                        "Bank Allowed Transient Account (Hours)",
                        (document.querySelectorAll("input[placeholder='2']")[0] as HTMLInputElement)?.value || ""
                      )
                    }
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button onClick={() => handleEditToggle("Bank Access", "Bank Allowed Transient Account (Hours)")}>
                  <TbEdit /> Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      ),
      "System Password": (
        <div className="p-4 pt-0 border-b mb-4">
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <p className="text-sm flex mr-12.5">System Password History Password Size</p>
              <input
                type="text"
                placeholder="5"
                className="p-1.5 mt-1 border rounded-md"
                disabled={!editMode["System Password"]["System Password History Password Size"]}
              />
            </div>
            <div className="flex gap-3">
              {editMode["System Password"]["System Password History Password Size"] ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleCancel("System Password", "System Password History Password Size")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      handleSave(
                        "System Password",
                        "System Password History Password Size",
                        (document.querySelector("input[placeholder='5']") as HTMLInputElement)?.value || ""
                      )
                    }
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button onClick={() => handleEditToggle("System Password", "System Password History Password Size")}>
                  <TbEdit /> Edit
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <p className="text-sm flex mr-12.5">System Password Minimum Length</p>
              <input
                type="text"
                placeholder="8"
                className="p-1.5 mt-1 border rounded-md"
                disabled={!editMode["System Password"]["System Password Minimum Length"]}
              />
            </div>
            <div className="flex gap-3">
              {editMode["System Password"]["System Password Minimum Length"] ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleCancel("System Password", "System Password Minimum Length")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      handleSave(
                        "System Password",
                        "System Password Minimum Length",
                        (document.querySelectorAll("input[placeholder='8']")[0] as HTMLInputElement)?.value || ""
                      )
                    }
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button onClick={() => handleEditToggle("System Password", "System Password Minimum Length")}>
                  <TbEdit /> Edit
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <p className="text-sm flex mr-12.5">System Password Maximum Length</p>
              <input
                type="text"
                placeholder="25"
                className="p-1.5 mt-1 border rounded-md"
                disabled={!editMode["System Password"]["System Password Maximum Length"]}
              />
            </div>
            <div className="flex gap-3">
              {editMode["System Password"]["System Password Maximum Length"] ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleCancel("System Password", "System Password Maximum Length")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      handleSave(
                        "System Password",
                        "System Password Maximum Length",
                        (document.querySelectorAll("input[placeholder='25']")[0] as HTMLInputElement)?.value || ""
                      )
                    }
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button onClick={() => handleEditToggle("System Password", "System Password Maximum Length")}>
                  <TbEdit /> Edit
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <p className="text-sm flex mr-12.5">System Password Expiration (Days)</p>
              <input
                type="text"
                placeholder="45"
                className="p-1.5 mt-1 border rounded-md"
                disabled={!editMode["System Password"]["System Password Expiration (Days)"]}
              />
            </div>
            <div className="flex gap-3">
              {editMode["System Password"]["System Password Expiration (Days)"] ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleCancel("System Password", "System Password Expiration (Days)")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      handleSave(
                        "System Password",
                        "System Password Expiration (Days)",
                        (document.querySelectorAll("input[placeholder='45']")[0] as HTMLInputElement)?.value || ""
                      )
                    }
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button onClick={() => handleEditToggle("System Password", "System Password Expiration (Days)")}>
                  <TbEdit /> Edit
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <p className="text-sm flex mr-12.5">System Password Reset Expiration (Minutes)</p>
              <input
                type="text"
                placeholder="15"
                className="p-1.5 mt-1 border rounded-md"
                disabled={!editMode["System Password"]["System Password Reset Expiration (Minutes)"]}
              />
            </div>
            <div className="flex gap-3">
              {editMode["System Password"]["System Password Reset Expiration (Minutes)"] ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleCancel("System Password", "System Password Reset Expiration (Minutes)")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      handleSave(
                        "System Password",
                        "System Password Reset Expiration (Minutes)",
                        (document.querySelectorAll("input[placeholder='15']")[0] as HTMLInputElement)?.value || ""
                      )
                    }
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button onClick={() => handleEditToggle("System Password", "System Password Reset Expiration (Minutes)")}>
                  <TbEdit /> Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      ),
    };
    return forms[section as keyof typeof forms] || null;
  };

  const sections = [
    "Bank Details Configurations",
    "Bank Support Configurations",
    "Bank Settlements",
    "Bank Access",
    "System Password",
  ];

  const filteredSections = sections.filter((section) =>
    section.toLowerCase().includes(searchQuery.toLowerCase()) ||
    Object.keys(editMode[section]).some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <>
      <div className="flex items-center justify-between mt-6 mb-8 px-3">
        <div>
          <h3 className="text-sm">Variable Configuration</h3>
          <p className="text-xs">This section contains environment variables configurations for application setup</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search Configuration ..."
              className="pr-10 bg-[#F8F8F8] dark:bg-background border-none rounded-lg h-10 w-[350px] max-w-md focus:ring-2 focus:ring-gray-200 text-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {filteredSections.map((section) => (
          <React.Fragment key={section}>
            <Button
              variant="ghost"
              className={`w-full flex items-center justify-between mb-6 pb-[35px] pt-4 ${
                expandedSection === section ? "" : "border-b"
              } rounded-none`}
              onClick={() => setExpandedSection(expandedSection === section ? null : section)}
            >
              <span className="text-start pl-0">
                <h3 className="text-sm">{section}</h3>
                <p className="text-xs text-[#A5A5A5]">
                  {section === "Bank Details Configurations" && "Setup or modify bank details configuration"}
                  {section === "Bank Support Configurations" && "Setup or modify bank support configuration"}
                  {section === "Bank Settlements" && "Setup or modify bank settlement account configuration"}
                  {section === "Bank Access" && "Setup or modify bank access allowance configuration"}
                  {section === "System Password" && "Setup or modify system password configuration"}
                </p>
              </span>
              {expandedSection === section ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </Button>
            {expandedSection === section && renderForm(section)}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}

export default VariablesConfig;