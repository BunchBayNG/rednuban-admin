"use client";


import { SearchInput } from "./SearchInput";
import Notification from "./svg Icons/Notifications";


export const NavbarRoutes = ({

}) => {


  return (
    <div className="flex items-center justify-between gap-6 w-full p-4">
      <div className="hidden md:block max-w-md pl-4">
    
        <h1 className="font-semibold">Virtual Account Service</h1>
      </div>
      <div className="flex items-center gap-3">
      <SearchInput
         
         />
       <Notification />
       
      </div>
    </div>
  );
};