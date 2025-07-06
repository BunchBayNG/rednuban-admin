import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const queryParams = {
      period: params.period || "",
      startDate: params.startDate || "",
      endDate: params.endDate || "",
      merchantOrgId: params.merchantOrgId || "",
    };

    console.log("✅ Incoming API request:", {
      url: request.url,
      queryParams,
    });

    // Basic validation
    if (!queryParams.period || !queryParams.startDate || !queryParams.endDate) {
      return NextResponse.json(
        {
          statusCode: 400,
          status: false,
          message: "period, startDate, and endDate are required",
          data: null,
        },
        { status: 400 }
      );
    }

    // Allowed periods
    const validPeriods = ["daily", "weekly", "monthly", "yearly", "month"];
    if (!validPeriods.includes(queryParams.period)) {
      return NextResponse.json(
        {
          statusCode: 400,
          status: false,
          message: "Invalid period. Must be one of: daily, weekly, monthly, yearly, month",
          data: null,
        },
        { status: 400 }
      );
    }

    // Date format check
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

    // Date sanity check
    const start = new Date(queryParams.startDate);
    const end = new Date(queryParams.endDate);
    const now = new Date("2025-07-05");
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

    // Try all endpoint name variations
    const baseUrls = [
      "https://redcollection.onrender.com/api/v1/analytics/vnubans/generated-chart",
    ];

    // Also try both period names
    const periodVariants = queryParams.period === "monthly"
      ? ["monthly", "month"]
      : [queryParams.period];

    let res: Response | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any = null;

    for (const baseUrl of baseUrls) {
      for (const period of periodVariants) {
        const externalUrl = `${baseUrl}?period=${encodeURIComponent(period)}&startDate=${queryParams.startDate}T00:00:00Z&endDate=${queryParams.endDate}T00:00:00Z${queryParams.merchantOrgId ? `&merchantOrgId=${queryParams.merchantOrgId}` : ""}`;

        console.log("🔁 Trying endpoint:", externalUrl);

        try {
          res = await fetch(externalUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            signal: AbortSignal.timeout(10000),
          });

          data = await res.json();

          console.log(`🔄 API response from ${baseUrl}`, {
            status: res.status,
            body: JSON.stringify(data, null, 2),
          });

          if (res.ok && data.status && Array.isArray(data.data)) {
            return NextResponse.json(data, { status: 200 });
          }
        } catch (err) {
          console.warn("❌ Error fetching data:", err);
        }
      }
    }

    // Fallback mock data
    return NextResponse.json(
      {
        statusCode: 1073741824,
        status: true,
        message: `Fallback: all API attempts failed`,
        data: [
          { period: "Jan", value: 115000 },
          { period: "Feb", value: 118000 },
          { period: "Mar", value: 112000 },
          { period: "Apr", value: 108000 },
          { period: "May", value: 198007 },
          { period: "Jun", value: 125000 },
          { period: "Jul", value: 135000 },
          { period: "Aug", value: 145000 },
          { period: "Sep", value: 165000 },
          { period: "Oct", value: 185000 },
          { period: "Nov", value: 175000 },
          { period: "Dec", value: 155000 },
        ],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❗ Internal Server Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
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
