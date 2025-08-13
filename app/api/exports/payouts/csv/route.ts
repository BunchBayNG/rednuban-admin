import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const queryParams = {
      startDate: params.startDate || "",
      endDate: params.endDate || "",
      merchantOrgId: params.merchantOrgId || "",
      search: params.search || "",
      status: params.status || "",
      sortBy: params.sortBy || "provisionDate",
      sortOrder: params.sortOrder || "asc",
    };

    console.log("Export CSV - API request received:", {
      url: request.url,
      queryParams,
    });

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    // Get merchantOrgId from cookies (same as frontend) or fallback to query params
    const merchantOrgIdFromCookie = cookieStore.get("organizationId")?.value;
    const merchantOrgId = merchantOrgIdFromCookie || queryParams.merchantOrgId;

    if (!accessToken) {
      return NextResponse.json(
        {
          statusCode: 401,
          status: false,
          message: "Unauthorized: Missing access token",
          data: null,
        },
        { status: 401 }
      );
    }

    if (!merchantOrgId) {
      return NextResponse.json(
        {
          statusCode: 400,
          status: false,
          message: "Merchant Organization ID not found. Please log in again.",
          data: null,
        },
        { status: 400 }
      );
    }

    console.log("Export CSV - Final params:", {
      merchantOrgIdFromCookie,
      finalMerchantOrgId: merchantOrgId,
    });

    // Build the API URL with all the same parameters as the table uses
    const baseApiUrl = "https://redcollection.onrender.com/api/v1/exports/payouts/csv";
    let apiUrl = `${baseApiUrl}?merchantOrgId=${encodeURIComponent(merchantOrgId)}`;
    
    // Add optional parameters
    if (queryParams.startDate) apiUrl += `&startDate=${encodeURIComponent(queryParams.startDate)}`;
    if (queryParams.endDate) apiUrl += `&endDate=${encodeURIComponent(queryParams.endDate)}`;
    if (queryParams.search) apiUrl += `&search=${encodeURIComponent(queryParams.search)}`;
    if (queryParams.status) apiUrl += `&status=${encodeURIComponent(queryParams.status)}`;
    if (queryParams.sortBy) apiUrl += `&sortBy=${encodeURIComponent(queryParams.sortBy)}`;
    if (queryParams.sortOrder) apiUrl += `&sortOrder=${encodeURIComponent(queryParams.sortOrder)}`;

    console.log("Final API URL:", apiUrl);

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("External API Error:", errorData);
      return NextResponse.json(
        {
          statusCode: res.status,
          status: false,
          message: errorData.message || "Failed to export CSV",
          data: null,
        },
        { status: res.status }
      );
    }

    const blob = await res.blob();
    const headers = res.headers;
    const filename = headers.get("content-disposition")?.match(/filename="(.+)"/)?.[1] || `payouts_${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export CSV Error:", error);
    return NextResponse.json(
      {
        statusCode: 500,
        status: false,
        message: "Internal server error",
        data: null,
      },
      { status: 500 }
    );
  }
}