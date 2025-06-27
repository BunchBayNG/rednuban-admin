import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  console.log("Received GET request for /api/reports/organization-customers");
  try {
    const { searchParams } = new URL(request.url);
    const merchantOrgId = searchParams.get("merchantOrgId");
    const search = searchParams.get("search") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const status = searchParams.get("status") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "ASC";
    const page = searchParams.get("page") || "0";
    const size = searchParams.get("size") || "10";

    if (!merchantOrgId) {
      console.error("Missing merchantOrgId");
      return NextResponse.json({ error: "merchantOrgId is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    console.log("Retrieved accessToken:", accessToken ? "Present" : "Missing");

    if (!accessToken) {
      console.error("No access token found");
      return NextResponse.json({ error: "Authorization required" }, { status: 401 });
    }

    const params = new URLSearchParams({
      merchantOrgId,
      search,
      startDate,
      endDate,
      status,
      sortBy,
      sortOrder,
      page,
      size,
    });

    const apiUrl = `https://redcollection.onrender.com/api/v1/reports/organization-customers?${params}`;
    console.log("External API GET URL:", apiUrl);

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();
    console.log("External API Response:", {
      status: res.status,
      headers: Object.fromEntries(res.headers.entries()),
      body: JSON.stringify(data, null, 2),
    });

    if (res.ok && data.status) {
      return NextResponse.json(data, { status: 200 });
    } else {
      console.error("External API GET Error:", data);
      return NextResponse.json(
        {
          error: data.message || "Failed to fetch organization customers",
          status: res.status,
          response: data,
        },
        { status: res.status }
      );
    }
  } catch (error) {
    console.error("GET Organization Customers:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}