"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";

interface MerchantData {
  id: string;
  name: string;
  amount: string;
}

export function TopMerchants() {
  const [merchants, setMerchants] = useState<MerchantData[]>([
    {
      id: "1",
      name: "Stanley Mbaka .E.",
      amount: "₦16,015,900.00",
    },
    {
      id: "2",
      name: "Kingsley Njoku .B.",
      amount: "₦13,997,060.00",
    },
    {
      id: "3",
      name: "Fairefield .M. Wiston",
      amount: "₦10,870,000.00",
    },
    {
      id: "4",
      name: "Mariah Kelly",
      amount: "₦10,670,970.83",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopMerchants() {
      setLoading(true);
      setError(null);

      const topN = 5;
      const startDate = "2024-12-01";
      const endDate = "2025-01-01";

      try {
        const response = await fetch(
          `/api/analytics/transactions/top-merchants?topN=${topN}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log("Client-side: Top merchants response:", {
          status: response.status,
          body: JSON.stringify(data, null, 2),
        });

        if (response.ok && data.status) {
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedMerchants = data.data.map((merchant: any) => ({
            id: merchant.merchantId.toString(),
            name: merchant.merchantName,
            amount: `₦${(merchant.totalVolume).toLocaleString("en-NG", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
          }));
          setMerchants(formattedMerchants);
        } else {
          throw new Error(data.message || "Failed to fetch top merchants");
        }
      } catch (err) {
        console.error("Client-side: Fetch error:", {
          message: err instanceof Error ? err.message : "Unknown error",
          stack: err instanceof Error ? err.stack : "Unknown stack",
        });
        setError("Failed to load top merchants");
      } finally {
        setLoading(false);
      }
    }

    fetchTopMerchants();
  }, []);

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
          Top Merchants By Payouts
          <ExternalLink className="h-3 w-3 text-muted-foreground/50" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center text-sm text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-sm text-red-500">{error}</div>
        ) : merchants.length === 0 ? (
          <div className="text-center text-sm text-gray-500">No merchants found</div>
        ) : (
          merchants.map((merchant) => (
            <div key={merchant.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                    {merchant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">{merchant.name}</div>
                </div>
              </div>
              <div className="text-sm font-medium text-right">{merchant.amount}</div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}