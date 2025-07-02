"use client";

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import React, { useState } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { TbEdit } from 'react-icons/tb';

function VariablesConfig() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const renderForm = (section: string) => {
    const forms = {
      "Bank Details Configurations": (
        <div className="p-4 pt-0 border-b mb-4">
        <div className='flex items-center justify-between'>
          <div className='flex  items-center gap-4 '>
            <p className='text-sm flex mr-10' > Bank Product Phone</p>
            <input
                type="text"
                placeholder="08100009099"
                className=" p-1.5 mt-1 border rounded-md"
              />           
          </div>
          <div className='flex gap-3'>
            <Button variant={"outline"}>Cancel</Button>
            <Button>Save</Button>
          </div>
        </div>
        <div className='flex items-center justify-between mt-2'>
          <div className='flex  items-center gap-4 '>
            <p className='text-sm flex mr-12.5' > Bank Sender Email</p>
            <input
                type="text"
                placeholder="redpay@example.com"
                className=" p-1.5 mt-1 border rounded-md"
              />           
          </div>
          <div className='flex gap-3'>
            <Button><TbEdit/> Edit</Button>
          </div>
        </div>
        </div>
      ),
      "Bank Support Configurations": (
        <div className="p-4 pt-0 border-b mb-4">
        <div className='flex items-center justify-between mt-2'>
          <div className='flex  items-center gap-4 '>
            <p className='text-sm flex mr-12.5' > Bank Support Email</p>
            <input
                type="text"
                placeholder="redpay@example.com"
                className=" p-1.5 mt-1 border rounded-md"
              />           
          </div>
          <div className='flex gap-3'>
            <Button><TbEdit/> Edit</Button>
          </div>
        </div>
        <div className='flex items-center justify-between mt-2'>
          <div className='flex  items-center gap-4 '>
            <p className='text-sm flex mr-12.5' > Bank Support Phone</p>
            <input
                type="text"
                placeholder="08100009099"
                className=" p-1.5 mt-1 border rounded-md"
              />           
          </div>
          <div className='flex gap-3'>
            <Button><TbEdit/> Edit</Button>
          </div>
        </div>
        </div>
      ),
      "Bank Settlements": (
        <div className="p-4 pt-0 border-b mb-4">
        <div className='flex items-center justify-between mt-2'>
          <div className='flex  items-center gap-4 '>
            <p className='text-sm flex mr-12.5' > Bank Settlement Account</p>
            <input
                type="text"
                placeholder="102806908"
                className=" p-1.5 mt-1 border rounded-md"
              />           
          </div>
          <div className='flex gap-3'>
            <Button><TbEdit/> Edit</Button>
          </div>
        </div>
        <div className='flex items-center justify-between mt-2'>
          <div className='flex  items-center gap-4 '>
            <p className='text-sm flex mr-12.5' > Bank Settlement Account Name</p>
            <input
                type="text"
                placeholder="UBA/REDPAY VIRTUAL ACCOUNT SERVICE"
                className=" p-1.5 mt-1 border rounded-md"
              />           
          </div>
          <div className='flex gap-3'>
            <Button><TbEdit/> Edit</Button>
          </div>
        </div>
        </div>
      ),
      "Bank Access": (
        <div className="p-4 pt-0 border-b mb-4">
        <div className='flex items-center justify-between mt-2'>
          <div className='flex  items-center gap-4 '>
            <p className='text-sm flex mr-12.5' >Bank Allowed Merchant Users</p>
            <input
                type="text"
                placeholder="10"
                className=" p-1.5 mt-1 border rounded-md"
              />           
          </div>
          <div className='flex gap-3'>
            <Button><TbEdit/> Edit</Button>
          </div>
        </div>
        <div className='flex items-center justify-between mt-2'>
          <div className='flex  items-center gap-4 '>
            <p className='text-sm flex mr-12.5' > Bank Allowed Transient Account (Hours)</p>
            <input
                type="text"
                placeholder="2"
                className=" p-1.5 mt-1 border rounded-md"
              />           
          </div>
          <div className='flex gap-3'>
            <Button><TbEdit/> Edit</Button>
          </div>
        </div>
        </div>
      ),
      "System Password": (
        <div className="p-4 pt-0 border-b mb-4">
        <div className='flex items-center justify-between mt-2'>
          <div className='flex  items-center gap-4 '>
            <p className='text-sm flex mr-12.5' >System Password History Password Size</p>
            <input
                type="text"
                placeholder="5"
                className=" p-1.5 mt-1 border rounded-md"
              />           
          </div>
          <div className='flex gap-3'>
            <Button><TbEdit/> Edit</Button>
          </div>
        </div>
        <div className='flex items-center justify-between mt-2'>
          <div className='flex  items-center gap-4 '>
            <p className='text-sm flex mr-12.5' > System Password Minimum Length</p>
            <input
                type="text"
                placeholder="8"
                className=" p-1.5 mt-1 border rounded-md"
              />           
          </div>
          <div className='flex gap-3'>
            <Button><TbEdit/> Edit</Button>
          </div>
        </div>
        <div className='flex items-center justify-between mt-2'>
          <div className='flex  items-center gap-4 '>
            <p className='text-sm flex mr-12.5' > System Password Maximum Length</p>
            <input
                type="text"
                placeholder="25"
                className=" p-1.5 mt-1 border rounded-md"
              />           
          </div>
          <div className='flex gap-3'>
            <Button><TbEdit/> Edit</Button>
          </div>
        </div>
        <div className='flex items-center justify-between mt-2'>
          <div className='flex  items-center gap-4 '>
            <p className='text-sm flex mr-12.5' > System Password Expiration (Days)</p>
            <input
                type="text"
                placeholder="45"
                className=" p-1.5 mt-1 border rounded-md"
              />           
          </div>
          <div className='flex gap-3'>
            <Button><TbEdit/> Edit</Button>
          </div>
        </div>
        <div className='flex items-center justify-between mt-2'>
          <div className='flex  items-center gap-4 '>
            <p className='text-sm flex mr-12.5' > System Password Reset Expiration (Minutes)</p>
            <input
                type="text"
                placeholder="15"
                className=" p-1.5 mt-1 border rounded-md"
              />           
          </div>
          <div className='flex gap-3'>
            <Button><TbEdit/> Edit</Button>
          </div>
        </div>
        </div>
      ),
    };
    return forms[section as keyof typeof forms] || null;
  }
  
  return (
    <>
       <div className="flex items-center justify-between mt-6 mb-8 px-3">
      <div>
        <h3 className="text-sm">Variable Configuration</h3>
        <p className="text-xs">This section contains environment variables configurations for application setup</p>
      </div>
      <div className="flex gap-2">
        <Button >Export <Download /></Button>
      </div>
    </div>
    <div className='space-x-4'>
      <Button variant="ghost"
        className={`w-full flex items-center justify-between mb-6 pb-[35px] pt-4 ${expandedSection === "Bank Details Configurations" ? "" : "border-b"} rounded-none`}
        onClick={() => setExpandedSection(expandedSection === "Bank Details Configurations" ? null : "Bank Details Configurations")}
       >
        <span className="text-start pl-0">
          <h3 className="text-sm">Bank Details Configurations</h3>
          <p className="text-xs text-[#A5A5A5]">Setup or modify bank details configuration</p>
          </span>
           {expandedSection === "Bank Details Configurations" ? <IoIosArrowUp /> : <IoIosArrowDown />}
       </Button>
       {expandedSection === "Bank Details Configurations" && renderForm("Bank Details Configurations")}
      <Button variant="ghost"
        className={`w-full flex items-center justify-between mb-6 pb-[35px] pt-4 ${expandedSection === "Bank Support Configurations" ? "" : "border-b"} rounded-none`}
        onClick={() => setExpandedSection(expandedSection === "Bank Support Configurations" ? null : "Bank Support Configurations")}
       >
          <span className="text-start pl-0">
          <h3 className="text-sm">Bank Support Configurations</h3>
          <p className="text-xs text-[#A5A5A5]">Setup or modify bank support configuration</p>
          </span>
           {expandedSection === "Bank Support Configurations" ? <IoIosArrowUp /> : <IoIosArrowDown />}
       </Button>
       {expandedSection === "Bank Support Configurations" && renderForm("Bank Support Configurations")}

      <Button variant="ghost"
        className={`w-full flex items-center justify-between mb-6 pb-[35px] pt-4 ${expandedSection === "Bank Settlements" ? "" : "border-b"} rounded-none`}
        onClick={() => setExpandedSection(expandedSection === "Bank Settlements" ? null : "Bank Settlements")}
       >
          <span className="text-start pl-0">
          <h3 className="text-sm">Bank Settlement Account Configurations</h3>
          <p className="text-xs text-[#A5A5A5]">Setup or modify bank settlement account configuration</p>
          </span>
           {expandedSection === "Bank Settlements" ? <IoIosArrowUp /> : <IoIosArrowDown />}
       </Button>
       {expandedSection === "Bank Settlements" && renderForm("Bank Settlements")}

      <Button variant="ghost"
        className={`w-full flex items-center justify-between mb-6 pb-[35px] pt-4 ${expandedSection === "Bank Access" ? "" : "border-b"} rounded-none`}
        onClick={() => setExpandedSection(expandedSection === "Bank Access" ? null : "Bank Access")}
       >
          <span className="text-start pl-0">
          <h3 className="text-sm">Bank Access Allowance Configurations</h3>
          <p className="text-xs text-[#A5A5A5]">Setup or modify bank access allowance configuration</p>
          </span>
           {expandedSection === "Bank Access" ? <IoIosArrowUp /> : <IoIosArrowDown />}
       </Button>
       {expandedSection === "Bank Access" && renderForm("Bank Access")}
      <Button variant="ghost"
        className={`w-full flex items-center justify-between mb-6 pb-[35px] pt-4 ${expandedSection === "System Password" ? "" : "border-b"} rounded-none`}
        onClick={() => setExpandedSection(expandedSection === "System Password" ? null : "System Password")}
       >
          <span className="text-start pl-0">
          <h3 className="text-sm">System Password Configurations</h3>
          <p className="text-xs text-[#A5A5A5]">Setup or modify system password configuration</p>
          </span>
           {expandedSection === "System Password" ? <IoIosArrowUp /> : <IoIosArrowDown />}
      
       </Button>
       {expandedSection === "System Password" && renderForm("System Password")}
    </div>
    </>
  )
}

export default VariablesConfig