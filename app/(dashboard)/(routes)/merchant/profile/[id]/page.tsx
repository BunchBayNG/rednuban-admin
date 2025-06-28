"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MerchantUsersTable } from "../../_components/MerchantUsersTable";
import { MerchantStaffsTable } from "../../_components/MerchantStaffTable";
import Loading from "@/components/Loading";

// Define PageProps type for dynamic routes
interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MerchantProfilePage({ params }: PageProps) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [merchant, setMerchant] = useState<any>(null); // Consider defining a specific Merchant type
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMerchant = async () => {
      // Resolve params Promise
      const { id } = await params;
      setIsLoading(true);
      setError(null);
      console.log("Fetching merchant with ID:", id);

      try {
        const response = await fetch(
          `/api/reports/organizations?page=0&size=100&sortBy=createdAt&sortOrder=ASC`,
          {
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Include accessToken cookie
          }
        );
        console.log("API Response Status:", response.status);
        const data = await response.json();
        console.log("API Response Body:", JSON.stringify(data, null, 2));

        if (response.ok && data.status && data.data.content.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const item = data.data.content.find((m: any) => m.id === id);
          if (item) {
            const mappedMerchant = {
              sN: item.id,
              merchantName: item.organizationName,
              code: item.productPrefix || `MCH-${item.id.slice(-6)}`,
              accountName: item.settlementAccountName || "",
              accountNumber: item.settlementAccountNumber || "",
              email: item.contactEmail || "N/A",
              bvn: item.registeredBVN || "N/A",
              status: item.orgStatus || "Unknown",
              noOfUsers: item.noOfUsers || 0,
              vnuban: item.vnuban || 0,
              merchantFees: item.merchantFees || 0,
              createdAt: new Date(item.createdAt).toLocaleString(),
            };
            console.log("Mapped Merchant:", mappedMerchant);
            setMerchant(mappedMerchant);
          } else {
            setError("No merchant found for this ID");
            console.log("No matching merchant:", id);
          }
        } else {
          setError(data.detail || data.error || `API error: ${response.status}`);
          console.log("API Error:", data);
        }
      } catch (err) {
        setError("Network or server error");
        console.error("Fetch Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchant();
  }, [params]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (error || !merchant) {
    return (
      <div className="min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-red-500 mb-4">{error || "Failed to load merchant"}</div>
        <Button onClick={() => router.push("/merchant")}>Back to Merchants</Button>
      </div>
    );
  }

  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0][0];
  };

  return (
    <div className="min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FaLongArrowAltLeft
            className="bg-[#F5F5F5] dark:bg-card p-1 w-5 h-5 cursor-pointer"
            onClick={() => router.push("/merchant")}
          />
          <h1 className="text-sm font-medium">
            <span className="text-[#A5A5A5]">Merchants/</span>Merchant Profile
          </h1>
        </div>
        <Button>
          Export
          <Download className="h-4 w-4 ml-2" />
        </Button>
      </div>
      <div className="w-full flex justify-between mb-4">
        <div className="w-[30%] border rounded-t-lg bg-card">
          <div className="flex items-center gap-2 pl-4 py-4 border-b">
            <Avatar>
              <AvatarImage src="/images/avatar-placeholder.jpg" alt={merchant.merchantName} className="rounded-full" />
              <AvatarFallback>{getInitials(merchant.merchantName)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{merchant.merchantName}</p>
            </div>
          </div>
          <div className="pl-4">
            <div className="flex flex-col gap-2 mb-3 mt-2">
              <span className="text-xs text-[#A5A5A5]">Status</span>
              <span
                className={`ml-2 text-sm ${
                  merchant.status === "Active"
                    ? "text-green-500"
                    : merchant.status === "Inactive"
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {merchant.status}
              </span>
            </div>
            <div className="flex flex-col gap-2 mb-3">
              <span className="text-xs text-[#A5A5A5]">Code</span>
              <p className="text-sm">{merchant.code}</p>
            </div>
            <div className="flex flex-col gap-2 mb-3">
              <span className="text-xs text-[#A5A5A5]">Account Name</span>
              <p className="text-sm">{merchant.accountName}</p>
            </div>
            <div className="flex flex-col gap-2 mb-3">
              <span className="text-xs text-[#A5A5A5]">Account Number</span>
              <p className="text-sm">{merchant.accountNumber}</p>
            </div>
            <div className="flex flex-col gap-2 mb-3">
              <span className="text-xs text-[#A5A5A5]">Primary Contact Email</span>
              <p className="text-sm">{merchant.email}</p>
            </div>
            <div className="flex flex-col gap-2 mb-3">
              <span className="text-xs text-[#A5A5A5]">BVN</span>
              <p className="text-sm">{merchant.bvn}</p>
            </div>
            <div className="flex flex-col gap-2 mb-3">
              <span className="text-xs text-[#A5A5A5]">Created At</span>
              <p className="text-sm">{merchant.createdAt}</p>
            </div>
          </div>
        </div>
        <div className="w-[68%] border rounded-t-lg">
          <div className="flex items-center justify-between gap-2 px-2 py-4 border-b bg-card">
            <div>
              <span className="text-xs text-[#A5A5A5]">Total vNUBANs Distributed</span>
              <p>{merchant.vnuban}</p>
            </div>
            <div>
              <span className="text-xs text-[#A5A5A5]">Total No. of Users</span>
              <p>{merchant.noOfUsers}</p>
            </div>
            <div>
              <span className="text-xs text-[#A5A5A5]">Total Merchant Fees</span>
              <p>{merchant.merchantFees}</p>
            </div>
          </div>
          <div className="pl-3 pt-3 mt-4 border-t bg-card">
            <Tabs defaultValue="merchant-staffs">
              <TabsList className="dark:bg-background">
                <TabsTrigger value="merchant-staffs">Merchant Staff</TabsTrigger>
                <TabsTrigger value="merchant-users">Merchant Users</TabsTrigger>
              </TabsList>
              <TabsContent value="merchant-staffs">
                <MerchantStaffsTable merchantAdminId={merchant.sN} />
              </TabsContent>
              <TabsContent value="merchant-users">
                <MerchantUsersTable merchantOrgId={merchant.sN} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}