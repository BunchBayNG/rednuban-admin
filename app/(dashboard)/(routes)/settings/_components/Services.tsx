"use client";

import Default from "@/components/svg Icons/Default";
import Service from "@/components/svg Icons/Service";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { BiSave } from "react-icons/bi";
import { TbEdit } from "react-icons/tb";
import { ExportModal } from "./ServiceExport";
import { AddServiceModal } from "./AddServiceModal";
import { ResetModal } from "./ResetModal"; // Import the new modal

function Services() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false); // New state for Reset modal
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({
    "Open Account": false,
    "Virtual Transaction": false,
    "Merchant Setup": false,
  });
  const [services, setServices] = useState([
    { name: "Open Account", description: "Open a Virtual Account", feeAmount: "0.00", feeType: "Fiat", percentageCap: "" },
    { name: "Virtual Transaction", description: "Process inflow transaction via virtual account", feeAmount: "0.00", feeType: "Percentage with Cap", percentageCap: "500" },
    { name: "Merchant Setup", description: "Merchant setup fee", feeAmount: "0.00", feeType: "Fiat", percentageCap: "" },
  ]);
  const fieldOptions = [
    { label: "Service Name", value: "ServiceName" },
    { label: "Service Fee", value: "ServiceFee" },
    { label: "Service Type", value: "ServiceType" },
    { label: "Service Cap", value: "ServiceCap" },
    { label: "Description", value: "Description" },
  ];

  const handleExport = (data: { format: string; fields: Record<string, boolean> }) => {
    const exportData = services
      .map((service) =>
        Object.fromEntries(
          Object.entries({
            ServiceName: service.name,
            Description: service.description,
            ServiceFee: service.feeAmount,
            ServiceType: service.feeType,
            ServiceCap: service.percentageCap,
          }).filter(([key]) => data.fields[key])
        )
      );
    console.log("Export data:", { ...data, exportData });
    setIsExportModalOpen(false);
  };

  const handleAddService = (data: { serviceName: string; description: string; feeAmount: string; feeType: string; percentageCap?: string }) => {
    setServices((prev) => [
      ...prev,
      {
        name: data.serviceName,
        description: data.description,
        feeAmount: data.feeAmount,
        feeType: data.feeType,
        percentageCap: data.percentageCap || "",
      },
    ]);
    setEditMode((prev) => ({ ...prev, [data.serviceName]: false }));
  };

  const handleReset: () => void = () => {
    setServices((prev) =>
      prev.map((service) => ({
        ...service,
        feeAmount: "0.00",
        percentageCap: service.feeType === "Percentage with Cap" ? "0" : "", // Reset cap to 0 for Percentage with Cap, empty for Fiat
      }))
    );
    setEditMode((prev) => {
      const newEditMode = { ...prev };
      Object.keys(newEditMode).forEach((key) => (newEditMode[key] = false));
      return newEditMode;
    });
  };

  const handleEditToggle = (section: string) => {
    setEditMode((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSave = (section: string, updatedData: { description: string; feeAmount: string; feeType: string; percentageCap?: string }) => {
    setServices((prev) =>
      prev.map((service) =>
        service.name === section
          ? { ...service, ...updatedData, percentageCap: updatedData.feeType === "Percentage with Cap" ? updatedData.percentageCap || "" : "" }
          : service
      )
    );
    setEditMode((prev) => ({ ...prev, [section]: false }));
  };

  const handleCancel = (section: string) => {
    setEditMode((prev) => ({ ...prev, [section]: false }));
  };

  const renderForm = (section: string) => {
    const service = services.find((s) => s.name === section);
    if (!service) return null;

    return (
      <div className="p-4 pt-0 border-b">
        <div className="flex items-center gap-3">
          <div>
            <label className="text-xs text-[#A5A5A5]">Fee Amount</label>
            <input
              type="text"
              placeholder="0.00"
              value={service.feeAmount}
              onChange={(e) => {
                if (editMode[section]) {
                  setServices((prev) =>
                    prev.map((s) => (s.name === section ? { ...s, feeAmount: e.target.value } : s))
                  );
                }
              }}
              className="w-full p-1.5 mt-1 border rounded-md"
              disabled={!editMode[section]}
            />
          </div>
          <div>
            <label className="text-xs text-[#A5A5A5]">Fee Type</label>
            <select
              value={service.feeType}
              onChange={(e) => {
                if (editMode[section]) {
                  const newFeeType = e.target.value;
                  setServices((prev) =>
                    prev.map((s) =>
                      s.name === section
                        ? {
                            ...s,
                            feeType: newFeeType,
                            percentageCap: newFeeType === "Percentage with Cap" ? service.percentageCap || "" : "",
                          }
                        : s
                    )
                  );
                }
              }}
              className="w-full p-2 mt-1 border rounded-md"
              disabled={!editMode[section]}
            >
              <option>Fiat</option>
              <option>Percentage with Cap</option>
            </select>
          </div>
          {service.feeType === "Percentage with Cap" && (
            <div>
              <label className="text-xs text-[#A5A5A5]">Percentage Cap</label>
              <input
                type="text"
                placeholder="500"
                value={service.percentageCap}
                onChange={(e) => {
                  if (editMode[section]) {
                    setServices((prev) =>
                      prev.map((s) => (s.name === section ? { ...s, percentageCap: e.target.value } : s))
                    );
                  }
                }}
                className="w-full p-1.5 mt-1 border rounded-md"
                disabled={!editMode[section]}
              />
            </div>
          )}
        </div>
        <div className="mt-4">
          {editMode[section] ? (
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => handleCancel(section)}>
                Cancel
              </Button>
              <Button className="" onClick={() => handleSave(section, { description: service.description, feeAmount: service.feeAmount, feeType: service.feeType, percentageCap: service.percentageCap })}>
                <BiSave /> Save
              </Button>
            </div>
          ) : (
            <Button className="" onClick={() => handleEditToggle(section)}>
              <TbEdit /> Edit Service
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mt-6 mb-8 px-3">
        <div>
          <h3 className="text-sm">Services</h3>
          <p className="text-xs">The section contains default fee configuration for available services</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAddServiceModalOpen(true)}>
            Add Service <Service />
          </Button>
          <Button variant="outline" onClick={() => setIsResetModalOpen(true)}>
            Reset to Default <Default />
          </Button>
          <Button onClick={() => setIsExportModalOpen(true)}>Export <Download /></Button>
        </div>
      </div>
      <div className="space-y-4">
        {services.map((service) => (
          <>
            <Button
              key={service.name}
              variant="ghost"
              className={`w-full flex items-center justify-between mb-6 pb-[35px] pt-4 ${expandedSection === service.name ? "" : "border-b"} rounded-none`}
              onClick={() => setExpandedSection(expandedSection === service.name ? null : service.name)}
            >
              <span className="text-start pl-0">
                <h3 className="text-sm">{service.name}</h3>
                <p className="text-xs text-[#A5A5A5]">{service.description}</p>
              </span>
              {expandedSection === service.name ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </Button>
            {expandedSection === service.name && renderForm(service.name)}
          </>
        ))}
      </div>
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        fieldOptions={fieldOptions}
      />
      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        onClose={() => setIsAddServiceModalOpen(false)}
        onSave={handleAddService}
      />
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onReset={handleReset}
      />
    </>
  );
}

export default Services;