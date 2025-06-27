
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const queryParams = {
      page: params.page || "0",
      size: params.size || "10",
      sortBy: params.sortBy || "createdAt", // Use createdAt per API response schema
      ascending: params.ascending || "true",
      sourceAccount: params.sourceAccount || "",
      destinationAccount: params.destinationAccount || "",
      transactionRef: params.transactionRef || "",
      paymentReference: params.paymentReference || "",
      merchantName: params.merchantName || "",
      merchantOrgId: params.merchantOrgId || "",
      startDate: params.startDate || "",
      endDate: params.endDate || "",
      status: params.status || "",
    };

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    console.log("Retrieved accessToken from cookie:", accessToken);
    console.log("Query Parameters:", queryParams);

    if (!accessToken) {
      console.error("No access token found in cookie");
      return NextResponse.json({ error: "Authorization required" }, { status: 401 });
    }

    const apiUrl = "https://redcollection.onrender.com/api/v1/reports/payouts";
    const queryString = new URLSearchParams(queryParams).toString();
    console.log("External API URL:", `${apiUrl}?${queryString}`);
    console.log("Outgoing Request Headers:", { Authorization: `Bearer ${accessToken}` });

    const res = await fetch(`${apiUrl}?${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();
    console.log("External API Response:", {
      status: res.status,
      body: JSON.stringify(data, null, 2),
    });

    if (res.ok && data.status) {
      return NextResponse.json(data, { status: 200 });
    } else {
      console.error("External API Error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to fetch payouts" },
        { status: res.status }
      );
    }
  } catch (error) {
    console.error("Payouts Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}