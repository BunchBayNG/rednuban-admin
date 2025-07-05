import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const queryParams = {
      topN: parseInt(params.topN || "5"),
      startDate: params.startDate || "",
      endDate: params.endDate || "",
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

    if (!Number.isInteger(queryParams.topN) || queryParams.topN < 1) {
      console.error("Validation failed: Invalid topN", queryParams);
      return NextResponse.json(
        {
          statusCode: 400,
          status: false,
          message: "topN must be a positive integer",
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
    const now = new Date();
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

    const apiUrl = "https://redcollection.onrender.com/api/v1/analytics/transactions/top-merchants";
    const externalUrl = `${apiUrl}?topN=${queryParams.topN}&startDate=${encodeURIComponent(isoStartDate)}&endDate=${encodeURIComponent(isoEndDate)}`;
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
      if (!Array.isArray(data.data)) {
        console.error("Invalid response data: Expected array", data.data);
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
      console.error("External API Error:", data);
      return NextResponse.json(
        {
          statusCode: 1073741824,
          status: true,
          message: "Mock data due to API failure",
          data: [
            {
              merchantId: 1,
              merchantName: "Stanley Mbaka .E.",
              totalVolume: 16015900.0,
            },
            {
              merchantId: 2,
              merchantName: "Kingsley Njoku .B.",
              totalVolume: 13997060.0,
            },
            {
              merchantId: 3,
              merchantName: "Fairefield .M. Wiston",
              totalVolume: 10870000.0,
            },
            {
              merchantId: 4,
              merchantName: "Mariah Kelly",
              totalVolume: 10670970.83,
            },
          ],
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