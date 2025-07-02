"use client";

import Default from '@/components/svg Icons/Default';
import Service from '@/components/svg Icons/Service';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import React, { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { BiSave } from "react-icons/bi";
import { TbEdit } from 'react-icons/tb';

function Services() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Mock form data and handlers (to be replaced with actual form logic)
  const renderForm = (section: string) => {
    const forms = {
      "Open Account": (
        <div className="p-4 pt-0 border-b">
          <div className=" flex items-center gap-3">
            <div>
              <label className="text-xs text-[#A5A5A5]">Fee Amount</label>
              <input
                type="text"
                placeholder="0.00"
                className="w-full p-1.5 mt-1 border rounded-md"
              />
            </div>
            <div>
              <label className="text-xs text-[#A5A5A5]">Fee Type</label>
              <select className="w-full p-2 mt-1 border rounded-md">
                <option>Fiat</option>
                <option>Percentage with Cap</option>
              </select>
            </div>
          
          </div>
          <div className='flex items-center gap-3 mt-4'>
            <Button variant={"outline"}>Cancel</Button>
          <Button className=""><BiSave/>Save</Button>
          </div>
        </div>
      ),
      "Virtual Transaction": (
        <div className="p-4 pt-0 border-b">
          <div className="flex items-center gap-3">
            <div>
            <label className="text-xs text-[#A5A5A5]">Fee Amount</label>
              <input
                type="text"
                placeholder="0.00"
                className="w-full p-1.5 mt-1 border rounded-md"
              />
            </div>
            <div>
            <label className="text-xs text-[#A5A5A5]">Fee Type</label>
              <select className="w-full p-2 mt-1 border rounded-md">
                <option>Fiat</option>
                <option>Percentage with Cap</option>
              </select>
            </div>
            <div>
            <label className="text-xs text-[#A5A5A5]">Percentage Cap</label>
              <input
                type="text"
                placeholder="500"
                className="w-full p-1.5 mt-1 border rounded-md"
              />
            </div>
          </div>
          <div className='mt-4'>
          <Button className=""><TbEdit/> Edit Service</Button>
          </div>
        </div>
      ),
      "Merchant Setup": (
        <div className="p-4 pt-0 border-b">
            <div className=" flex items-center gap-3">
            <div>
              <label className="text-xs text-[#A5A5A5]">Fee Amount</label>
              <input
                type="text"
                placeholder="0.00"
                className="w-full p-1.5 mt-1 border rounded-md"
              />
            </div>
            <div>
              <label className="text-xs text-[#A5A5A5]">Fee Type</label>
              <select className="w-full p-2 mt-1 border rounded-md">
                <option>Fiat</option>
                <option>Percentage with Cap</option>
              </select>
            </div>
          
          </div>
          <div className='mt-4'>
          <Button className=""><TbEdit/> Edit Service</Button>
          </div>
        </div>
      ),
    };
    return forms[section as keyof typeof forms] || null;
  };

  return (
    <>
    <div className="flex items-center justify-between mt-6 mb-8 px-3">
      <div>
        <h3 className="text-sm">Services</h3>
        <p className="text-xs">The section contains default fee configuration for available services</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline">Add Service <Service /></Button>
        <Button variant="outline">Reset to Default <Default /></Button>
        <Button >Export <Download /></Button>
      </div>
    </div>
    <div className="space-y-4">
      <Button
        variant="ghost"
        className={`w-full flex items-center justify-between mb-6 pb-[35px] pt-4 ${expandedSection === "Open Account" ? "" : "border-b"} rounded-none`}
        onClick={() => setExpandedSection(expandedSection === "Open Account" ? null : "Open Account")}
      >
        <span className="text-start pl-0">
          <h3 className="text-sm">Open Account</h3>
          <p className="text-xs text-[#A5A5A5]">Open a Virtual Account</p>
        </span>
        {expandedSection === "Open Account" ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </Button>
      {expandedSection === "Open Account" && renderForm("Open Account")}

      <Button
        variant="ghost"
        className={`w-full flex items-center justify-between mb-6 pb-[35px] pt-4 ${expandedSection === "Virtual Transaction" ? "" : "border-b"} rounded-none`}
        onClick={() => setExpandedSection(expandedSection === "Virtual Transaction" ? null : "Virtual Transaction")}
      >
        <span className="text-start pl-0">
          <h3 className="text-sm">Virtual Transaction</h3>
          <p className="text-xs text-[#A5A5A5]">Process inflow transaction via virtual account</p>
        </span>
        {expandedSection === "Virtual Transaction" ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </Button>
      {expandedSection === "Virtual Transaction" && renderForm("Virtual Transaction")}

      <Button
        variant="ghost"
        className={`w-full flex items-center justify-between mb-6 pb-[35px] pt-4 ${expandedSection === "Merchant Setup" ? "" : "border-b"} rounded-none`}
        onClick={() => setExpandedSection(expandedSection === "Merchant Setup" ? null : "Merchant Setup")}
      >
        <span className="text-start pl-0">
          <h3 className="text-sm">Merchant Setup</h3>
          <p className="text-xs text-[#A5A5A5]">Merchant setup fee</p>
        </span>
        {expandedSection === "Merchant Setup" ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </Button>
      {expandedSection === "Merchant Setup" && renderForm("Merchant Setup")}
    </div>
  </>
  );
}

export default Services;