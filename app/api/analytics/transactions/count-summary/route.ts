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
    };

    // Log incoming request
    console.log("API request received:", {
      url: request.url,
      queryParams,
    });

    // Validate parameters
    if (!queryParams.startDate || !queryParams.endDate) {
      console.error("Validation failed: Missing startDate or endDate");
      return NextResponse.json(
        {
          statusCode: 400,
          status: false,
          message: "startDate and endDate are required",
          data: null,
        },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(queryParams.startDate) || !dateRegex.test(queryParams.endDate)) {
      console.error("Validation failed: Invalid date format", queryParams);
      return NextResponse.json(
        {
          statusCode: 400,
          status: false,
          message: "Invalid date format. Use YYYY-MM-DD",
          data: null,
        },
        { status: 400 }
      );
    }

    // Validate date range
    const start = new Date(queryParams.startDate);
    const end = new Date(queryParams.endDate);
    const now = new Date("2025-07-05");
    const minDate = new Date("2020-01-01");
    if (start > now || end > now || start < minDate || end < minDate || start > end) {
      console.error("Validation failed: Invalid date range", queryParams);
      return NextResponse.json(
        {
          statusCode: 400,
          status: false,
          message: "Invalid date range. Dates must be after 2020 and not in the future.",
          data: null,
        },
        { status: 400 }
      );
    }

    // Get access token from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    console.log("Retrieved accessToken from cookie:", accessToken ? "Present" : "Missing");

    if (!accessToken) {
      console.error("No access token found in cookie");
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

    // Convert to ISO 8601
    const isoStartDate = `${queryParams.startDate}T00:00:00Z`;
    const isoEndDate = `${queryParams.endDate}T00:00:00Z`;

    const apiUrl = "https://redcollection.onrender.com/api/v1/analytics/transactions/count-summary";
    const externalUrl = `${apiUrl}?startDate=${encodeURIComponent(isoStartDate)}&endDate=${encodeURIComponent(isoEndDate)}${queryParams.merchantOrgId ? `&merchantOrgId=${queryParams.merchantOrgId}` : ""}`;
    console.log("Attempting external API URL:", externalUrl);
    console.log("Outgoing Request Headers:", { Authorization: `Bearer ${accessToken}` });

    const res = await fetch(externalUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json();
    console.log("External API Response:", {
      status: res.status,
      statusText: res.statusText,
      body: JSON.stringify(data, null, 2),
    });

    if (res.ok && data.status) {
      if (typeof data.data !== "object" || !("total" in data.data)) {
        console.error("Invalid response data: Expected object with total, success, pending, failed", data.data);
        return NextResponse.json(
          {
            statusCode: 500,
          status: false,
          message: "Invalid response data from external API",
          data: null,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(data, { status: 200 });
  } else {
    console.error("External API Error:", {
      status: res.status,
      statusText: res.statusText,
      body: data,
    });
    return NextResponse.json(
      {
        statusCode: 1073741824,
        status: true,
        message: `Mock data due to API failure (Status: ${res.status})`,
        data: {
          total: 72760,
          success: 70970,
          pending: 0,
          failed: 1790,
        },
      },
      { status: 200 }
    );
  }
} catch (error) {
  console.error("API Error:", {
    message: error instanceof Error ? error.message : "Unknown error",
    stack: error instanceof Error ? error.stack : "No stack available",
  });
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