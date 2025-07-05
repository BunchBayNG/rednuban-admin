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

    console.log("API request received:", {
      url: request.url,
      queryParams,
    });

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
    if (
      !dateRegex.test(queryParams.startDate) ||
      !dateRegex.test(queryParams.endDate)
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

    const start = new Date(queryParams.startDate);
    const end = new Date(queryParams.endDate);
    const now = new Date();
    const minDate = new Date("2020-01-01");

    if (
      start > now ||
      end > now ||
      start < minDate ||
      end < minDate ||
      start > end
    ) {
      return NextResponse.json(
        {
          statusCode: 400,
          status: false,
          message:
            "Invalid date range. Dates must be after 2020 and not in the future.",
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

    const endpoints = [
      "https://redcollection.onrender.com/api/v1/analytics/vnubans/total-dynamic",
    ];

    let lastError = null;

    for (const apiUrl of endpoints) {
      const externalUrl = `${apiUrl}?startDate=${encodeURIComponent(
        isoStartDate
      )}&endDate=${encodeURIComponent(isoEndDate)}${
        queryParams.merchantOrgId
          ? `&merchantOrgId=${queryParams.merchantOrgId}`
          : ""
      }`;

      try {
        const res = await fetch(externalUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          signal: AbortSignal.timeout(10000),
        });

        const data = await res.json();

        if (res.ok && data.status && typeof data.data === "number") {
          return NextResponse.json(data, { status: 200 });
        } else {
          lastError = data;
        }
      } catch (err) {
        lastError = err;
        console.error("Fetch failed for:", apiUrl, err);
      }
    }

    console.error("All API attempts failed. Returning mock data.", lastError);
    return NextResponse.json(
      {
        statusCode: 1073741824,
        status: true,
        message: "Mock data due to API failure",
        data: 9007199254740991,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in route:", error);
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
