import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const queryParams = {
      startDate: params.startDate || "",
      endDate: params.endDate || "",
    };

    // Log the incoming request
    console.log("Total Merchants API Request:", {
      url: request.url,
      queryParams,
    });

    // Validate required parameters
    if (!queryParams.startDate || !queryParams.endDate) {
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

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(queryParams.startDate) || !dateRegex.test(queryParams.endDate)) {
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

    const start = new Date(queryParams.startDate);
    const end = new Date(queryParams.endDate);
    const now = new Date();
    const minDate = new Date("2020-01-01");

    if (start > now || end > now || start < minDate || end < minDate || start > end) {
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

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    console.log("Retrieved accessToken from cookie:", accessToken ? "Present" : "Missing");


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

    // Convert to ISO
    const isoStartDate = `${queryParams.startDate}T00:00:00Z`;
    const isoEndDate = `${queryParams.endDate}T00:00:00Z`;

    const apiUrl = `https://redcollection.onrender.com/api/v1/analytics/transactions/total-merchants?startDate=${isoStartDate}&endDate=${isoEndDate}`;

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json();

    console.log("External API (Total Merchants) Response:", {
      status: res.status,
      body: data,
    });

    if (res.ok && data.status && typeof data.data === "number") {
      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json(
        {
          statusCode: res.status,
          status: false,
          message: data.message || "Failed to fetch total merchants",
          data: null,
        },
        { status: res.status }
      );
    }
  } catch (error) {
    console.error("Total Merchants API Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack",
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
