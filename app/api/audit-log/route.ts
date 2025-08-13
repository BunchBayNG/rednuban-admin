import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    // Validate required parameters
    if (!queryParams.page || !queryParams.size) {
      return NextResponse.json(
        {
          statusCode: 400,
          status: false,
          message: "page and size are required",
          data: null,
        },
        { status: 400 }
      );
    }

    // Validate date format if provided
    if (queryParams.startDate || queryParams.endDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (
        (queryParams.startDate && !dateRegex.test(queryParams.startDate)) ||
        (queryParams.endDate && !dateRegex.test(queryParams.endDate))
      ) {
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
    }

    // Validate date range
    const start = queryParams.startDate ? new Date(queryParams.startDate) : null;
    const end = queryParams.endDate ? new Date(queryParams.endDate) : null;
    const now = new Date("2025-08-07"); // Current date
    const minDate = new Date("2020-01-01");

    if (
      (start && (start > now || start < minDate)) ||
      (end && (end > now || end < minDate)) ||
      (start && end && start > end)
    ) {
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

    // Retrieve access token
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

    // Build external API URL with default values
    const externalUrl = new URL("https://redcollection.onrender.com/api/v1/audit-log/fetch");
    Object.entries({
      page: queryParams.page || "0",
      size: queryParams.size || "10",
      search: queryParams.search || "",
      merchantOrgId: queryParams.merchantOrgId || "",
      startDate: queryParams.startDate || "",
      endDate: queryParams.endDate || "",
      status: queryParams.status || "",
      sortBy: queryParams.sortBy || "createdAt",
      sortOrder: queryParams.sortOrder || "DESC",
    }).forEach(([key, value]) => {
      if (value) externalUrl.searchParams.append(key, value);
    });

    console.log("Audit Logs API Request:", {
      url: externalUrl.toString(),
      headers: { Authorization: `Bearer ${accessToken.slice(0, 10)}...` },
      queryParams,
    });

    const response = await fetch(externalUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error("Audit Logs API: Invalid JSON response", { status: response.status, text: text.slice(0, 100) });
      console.log(error);
      return NextResponse.json(
        {
          statusCode: 502,
          status: false,
          message: `Invalid response from external API: Not JSON (status ${response.status})`,
          data: null,
        },
        { status: 502 }
      );
    }

    console.log("External API (Audit Logs) Response:", {
      status: response.status,
      body: JSON.stringify(data, null, 2),
    });

    if (!response.ok || !data.status) {
      return NextResponse.json(
        {
          statusCode: response.status,
          status: false,
          message: data.message || `Failed to fetch audit logs (status ${response.status})`,
          data: null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Audit Logs API Error:", {
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