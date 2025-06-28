import Default from '@/components/svg Icons/Default'
import Service from '@/components/svg Icons/Service'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import React from 'react'
import { IoIosArrowDown } from "react-icons/io";

function Services() {
  return (
    <>
    <div className='flex items-center justify-between mt-6 mb-8 px-3'>
      <div>
      <h3 className='text-sm'>Services</h3>
      <p className='text-xs '>The section contains default fee configuration for available services </p>
      </div>
      <div className='flex gap-2'>
        <Button variant={"outline"}>Add Service <Service/></Button>
        <Button variant={"outline"}>Reset To Default <Default/></Button>
        <Button >Export <Download/></Button>
      </div>
      </div>
      <Button variant={"ghost"} className='w-full flex items-center justify-between mb-6 pb-[35px] pt-4 border-b rounded-none'>
        <span className='text-start pl-0'>
          <h3 className='text-sm'>Open Account</h3> 
          <p className='text-xs text-[#A5A5A5]'>Open a Virtual Account</p>
          </span>
          <IoIosArrowDown/> 
          </Button>
          <Button variant={"ghost"} className='w-full flex items-center justify-between mb-6 pb-[35px] pt-4 border-b rounded-none'>
        <span className='text-start pl-0'>
          <h3 className='text-sm'>Virtual Transaction</h3> 
          <p className='text-xs text-[#A5A5A5]'>Process inflow transaction via virtual account</p>
          </span>
          <IoIosArrowDown/> 
          </Button>
          <Button variant={"ghost"} className='w-full flex items-center justify-between mb-6 pb-[35px] pt-4 border-b rounded-none'>
        <span className='text-start pl-0'>
          <h3 className='text-sm'>Merchant Setup</h3> 
          <p className='text-xs text-[#A5A5A5]'>Merchant setup fee</p>
          </span>
          <IoIosArrowDown/> 
          </Button>
    </>
  )
}

export default Services