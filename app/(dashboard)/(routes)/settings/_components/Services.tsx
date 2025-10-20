"use client";

import Default from "@/components/svg Icons/Default";
import Service from "@/components/svg Icons/Service";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { BiSave } from "react-icons/bi";
import { TbEdit } from "react-icons/tb";
import { AddServiceModal } from "./AddServiceModal";
import { ResetModal } from "./ResetModal"; 
import Loader from "@/components/svg Icons/loader"; // Add your loader

// API response interfaces
interface ConfigItem {
  id: number;
  serviceType: string;
  fee: number;
  feeType: string;
  cap: number | null;
}

interface ConfigResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: ConfigItem[];
}

// Frontend service structure
interface Service {
  id: number;
  name: string;
  description: string;
  feeAmount: string;
  feeType: string;
  percentageCap: string;
}

function Services() {
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false); 
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch services from API
  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/config");
      const data: ConfigResponse = await res.json();

      if (res.ok && data.status) {
        // Map API data to frontend service structure
        const mappedServices: Service[] = data.data.map((item: ConfigItem) => {
          const serviceName = item.serviceType.replace('_', ' ');
          const feeTypeDisplay = item.feeType === 'FLAT' ? 'Fiat' : 'Percentage with Cap';
          
          return {
            id: item.id,
            name: serviceName,
            description: getServiceDescription(serviceName),
            feeAmount: item.fee.toFixed(2),
            feeType: feeTypeDisplay,
            percentageCap: item.cap ? item.cap.toString() : "",
          };
        });

        setServices(mappedServices);

        // Initialize editMode for all services
        const editModeInit: { [key: string]: boolean } = {};
        mappedServices.forEach(service => {
          editModeInit[service.name] = false;
        });
        setEditMode(editModeInit);

        console.log("Services loaded from API:", mappedServices);
      } else {
        setError(data.message || `Failed to fetch services (Status: ${res.status})`);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setError("Failed to fetch services due to network or server error");
    } finally {
      setLoading(false);
    }
  };

  // Service descriptions mapping
  const getServiceDescription = (serviceName: string): string => {
    const descriptions: { [key: string]: string } = {
      "OPEN ACCOUNT": "Open a Virtual Account",
      "VIRTUAL TRANSACTION": "Process inflow transaction via virtual account",
      "MERCHANT SETUP": "Merchant setup fee",
    };
    return descriptions[serviceName] || "Service configuration";
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = (data: { serviceName: string; description: string; feeAmount: string; feeType: string; percentageCap?: string }) => {
    // TODO: POST to API /api/v1/admin/manage-config
    console.log("Add new service:", data);
    setIsAddServiceModalOpen(false);
    // Refresh from API after successful add
    fetchServices();
  };

  const handleReset: () => void = () => {
    // TODO: Reset via API call
    console.log("Reset all services to default");
    fetchServices(); // Reload from API
    setIsResetModalOpen(false);
  };

  const handleEditToggle = (section: string) => {
    setEditMode((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSave = async (section: string, updatedData: { description: string; feeAmount: string; feeType: string; percentageCap?: string }) => {
    const service = services.find(s => s.name === section);
    if (!service) return;

    // Map frontend data back to API format
    const apiData = {
      id: service.id,
      serviceType: section.replace(' ', '_').toUpperCase(),
      fee: parseFloat(updatedData.feeAmount),
      feeType: updatedData.feeType === 'Fiat' ? 'FLAT' : 'PERCENTAGE_WITH_CAP',
      cap: updatedData.feeType === 'Percentage with Cap' && updatedData.percentageCap 
        ? parseFloat(updatedData.percentageCap) 
        : null,
    };

    try {
      // TODO: PUT to API /api/v1/admin/manage-config/{id}
      console.log("Save service to API:", apiData);
      
      // Update local state immediately
      setServices((prev) =>
        prev.map((s) =>
          s.name === section
            ? { 
                ...s, 
                ...updatedData, 
                percentageCap: updatedData.feeType === "Percentage with Cap" ? updatedData.percentageCap || "" : "" 
              }
            : s
        )
      );
      
      setEditMode((prev) => ({ ...prev, [section]: false }));
      
      // Refresh from API to ensure consistency
      // fetchServices();
    } catch (error) {
      console.error("Error saving service:", error);
      setError("Failed to save service configuration");
    }
  };

  const handleCancel = (section: string) => {
    setEditMode((prev) => ({ ...prev, [section]: false }));
  };

  // Update service field while editing
  const updateServiceField = (serviceName: string, field: keyof Service, value: string) => {
    if (editMode[serviceName]) {
      setServices((prev) =>
        prev.map((s) =>
          s.name === serviceName
            ? { ...s, [field]: value }
            : s
        )
      );
    }
  };

  const renderForm = (section: string) => {
    const service = services.find((s) => s.name === section);
    if (!service) return null;

    return (
      <div className="p-4 pt-0 border-b">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-xs text-[#A5A5A5]">Fee Amount</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={service.feeAmount}
              onChange={(e) => updateServiceField(section, 'feeAmount', e.target.value)}
              className="w-full p-1.5 mt-1 border rounded-md"
              disabled={!editMode[section]}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-[#A5A5A5]">Fee Type</label>
            <select
              value={service.feeType}
              onChange={(e) => {
                if (editMode[section]) {
                  const newFeeType = e.target.value;
                  updateServiceField(section, 'feeType', newFeeType);
                  // Auto-clear cap if switching from Percentage with Cap
                  if (newFeeType !== "Percentage with Cap") {
                    updateServiceField(section, 'percentageCap', "");
                  }
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
            <div className="flex-1">
              <label className="text-xs text-[#A5A5A5]">Percentage Cap</label>
              <input
                type="number"
                placeholder="500"
                value={service.percentageCap}
                onChange={(e) => updateServiceField(section, 'percentageCap', e.target.value)}
                className="w-full p-1.5 mt-1 border rounded-md"
                disabled={!editMode[section]}
              />
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end gap-3">
          {editMode[section] ? (
            <>
              <Button variant="outline" onClick={() => handleCancel(section)}>
                Cancel
              </Button>
              <Button 
                onClick={() => handleSave(section, { 
                  description: service.description, 
                  feeAmount: service.feeAmount, 
                  feeType: service.feeType, 
                  percentageCap: service.percentageCap 
                })}
              >
                <BiSave className="mr-1" /> Save
              </Button>
            </>
          ) : (
            <Button onClick={() => handleEditToggle(section)}>
              <TbEdit className="mr-1" /> Edit Service
            </Button>
          )}
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-4 border-transparent border-t-[#C80000] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center m-3">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex justify-between items-center">
          <span>{error}</span>
          <Button 
            variant="link" 
            size="sm" 
            onClick={fetchServices} 
            className="p-0 h-auto"
          >
            Retry
          </Button>
        </div>
      )}
      
      <div className="flex items-center justify-between mt-6 mb-8 px-3">
        <div>
          <h3 className="text-sm">Services</h3>
          <p className="text-xs">The section contains default fee configuration for available services</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAddServiceModalOpen(true)}>
            Add Service <Service className="ml-1" />
          </Button>
          <Button variant="outline" onClick={() => setIsResetModalOpen(true)}>
            Reset to Default <Default className="ml-1" />
          </Button>
          <Button variant="outline" onClick={fetchServices} size="sm">
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {services.map((service) => (
          <React.Fragment key={service.id}>
            <Button
              variant="ghost"
              className={`w-full flex items-center justify-between mb-6 pb-[35px] pt-4 ${expandedSection === service.name ? "" : "border-b"} rounded-none`}
              onClick={() => setExpandedSection(expandedSection === service.name ? null : service.name)}
            >
              <span className="text-start pl-0">
                <h3 className="text-sm">{service.name}</h3>
                <p className="text-xs text-[#A5A5A5]">{service.description}</p>
                <div className="mt-1 text-xs text-gray-500">
                  Fee: {service.feeAmount} {service.feeType} {service.percentageCap && `| Cap: ${service.percentageCap}`}
                </div>
              </span>
              {expandedSection === service.name ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </Button>
            {expandedSection === service.name && renderForm(service.name)}
          </React.Fragment>
        ))}
      </div>
      
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