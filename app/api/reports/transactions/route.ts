
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    console.log("Retrieved accessToken from cookie:", accessToken);

    if (!accessToken) {
      console.error("No access token found in cookie");
      return NextResponse.json({ error: "Authorization required" }, { status: 401 });
    }

    // Only include parameters from API docs
    const queryParams = {
      page: params.page || "0",
      size: params.size || "10",
      sortBy: params.sortBy || "createdAt", // Default to response field
      sortOrder: params.sortOrder || "asc",
      search: params.search || "",
      status: params.status || "",
      startDate: params.startDate || "",
      endDate: params.endDate || "",
    };

    // Filter out empty parameters
    const filteredParams = Object.fromEntries(
      Object.entries(queryParams).filter(([, v]) => v !== "")
    );

    const queryString = new URLSearchParams(filteredParams).toString();
    console.log("Raw Query String:", queryString);
    console.log("Filtered Query Parameters:", filteredParams);

    const apiUrl = "https://redcollection.onrender.com/api/v1/reports/transactions";
    const fullUrl = queryString ? `${apiUrl}?${queryString}` : apiUrl;
    console.log("External API URL:", fullUrl);
    console.log("Outgoing Request Headers:", { Authorization: `Bearer ${accessToken}` });

    const res = await fetch(fullUrl, {
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
        {
          error: data.detail || data.message || "Failed to fetch transaction data",
          status: res.status,
        },
        { status: res.status }
      );
    }
  } catch (error) {
    console.error("Transaction Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    console.log("Retrieved accessToken from cookie:", accessToken);

    if (!accessToken) {
      console.error("No access token found in cookie");
      return NextResponse.json({ error: "Authorization required" }, { status: 401 });
    }

    // Only include parameters from API docs
    const queryParams = {
      page: body.page?.toString() || "0",
      size: body.size?.toString() || "10",
      sortBy: body.sortBy || "createdAt",
      sortOrder: body.sortOrder || "asc",
      search: body.search || "",
      status: body.status || "",
      startDate: body.startDate || "",
      endDate: body.endDate || "",
    };

    console.log("Request Body:", body);
    console.log("Filtered Query Parameters:", queryParams);

    const apiUrl = "https://redcollection.onrender.com/api/reports/transactions";
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(queryParams),
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
        {
          error: data.detail || data.message || "Failed to fetch transaction data",
          status: res.status,
        },
        { status: res.status }
      );
    }
  } catch (error) {
    console.error("Transaction Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}