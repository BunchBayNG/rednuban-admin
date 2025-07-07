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

    const isoStartDate = `${queryParams.startDate}T00:00:00Z`;
    const isoEndDate = `${queryParams.endDate}T00:00:00Z`;

    const externalUrl = `https://redcollection.onrender.com/api/v1/analytics/transactions/total-merchants?startDate=${isoStartDate}&endDate=${isoEndDate}${
      queryParams.merchantOrgId ? `&merchantOrgId=${queryParams.merchantOrgId}` : ""
    }`;

    const response = await fetch(externalUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    const data = await response.json();

    if (!response.ok || !data.status || typeof data.data !== "number") {
      return NextResponse.json(
        {
          statusCode: 502,
          status: false,
          message: data?.message || "Invalid or failed response from external API",
          data: null,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        statusCode: 500,
        status: false,
        message: error instanceof Error ? error.message : "Internal server error",
        data: null,
      },
      { status: 500 }
    );
  }
}
