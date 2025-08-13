import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const startDate = params.startDate || "";
    const endDate = params.endDate || "";
    const merchantOrgId = params.merchantOrgId || "";

    // Validate required params
    if (!startDate || !endDate) {
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
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
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

    const start = new Date(startDate);
    const end = new Date(endDate);
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

    // Format for $date-time: ISO 8601 with time
    const isoStart = new Date(startDate).toISOString(); // "2025-07-08T00:00:00.000Z"
    const isoEnd = new Date(endDate).toISOString();

    let externalUrl = `https://redcollection.onrender.com/api/v1/analytics/transactions/total-merchants?startDate=${isoStart}&endDate=${isoEnd}`;
    if (merchantOrgId) {
      externalUrl += `&merchantOrgId=${merchantOrgId}`;
    }

    console.log("Calling external API:", externalUrl);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(externalUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await response.json();

    console.log("External response status:", response.status);
    console.log("External response body:", data);

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

    return NextResponse.json(
      {
        statusCode: 200,
        status: true,
        message: "Success",
        data: data.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in merchants/total endpoint:", error);

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
