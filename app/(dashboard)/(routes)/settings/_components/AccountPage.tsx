import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountDetails from "./AccountDetails";
import Security from "./Security";
import RolesPrivileges from "./RolesPrivileges";
import Services from "./Services";
import VariablesConfig from "./VariablesConfig";
import ThirdParties from "./ThirdParties";

export default function AccountPage() {
  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="account-details" className="w-full">
        <TabsList className="grid  grid-cols-6 dark:bg-background">
          <TabsTrigger value="account-details">Account Details</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="roles-privileges">Roles & Privileges</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="third-parties">Third Parties</TabsTrigger>
          <TabsTrigger value="variables-config">Variables Config</TabsTrigger>
        </TabsList>
        <TabsContent value="account-details">
          <AccountDetails />
        </TabsContent>
        <TabsContent value="security">
          <Security />
        </TabsContent>
        <TabsContent value="roles-privileges">
          <RolesPrivileges />
        </TabsContent>
        <TabsContent value="services">
          <Services />
        </TabsContent>
        <TabsContent value="third-parties">
          <ThirdParties />
        </TabsContent>
        <TabsContent value="variables-config">
          <VariablesConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
}