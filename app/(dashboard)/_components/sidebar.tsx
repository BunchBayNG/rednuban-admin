
import { SidebarRoutes } from "./sidebar-routes"
import Logo from "@/components/svg Icons/Logo"


export const Sidebar = () => {
    return (
        <div className="h-full md:w-[250px] border-r 
        flex flex-col items-center overflow-y-auto bg-card 
        shadow-sm">
           <div className="p-6">
         <Logo/>
           </div>
           <div className="flex flex-col w-full">
            <SidebarRoutes />
           </div>
        </div>
    )
}