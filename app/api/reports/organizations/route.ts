import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function GET(request: Request) {
  console.log("Received GET request for /api/reports/organizations");
  console.log("Raw Request URL:", request.url);
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    console.log("Retrieved accessToken:", accessToken ? "Present" : "Missing");

    if (!accessToken) {
      console.error("No access token found");
      return NextResponse.json({ error: "Authorization required" }, { status: 401 });
    }

    const queryParams = {
      page: (parseInt(params.page) || 0).toString(),
      size: (parseInt(params.size) || 10).toString(),
      sortBy: params.sortBy || "createdAt",
      sortOrder: params.sortOrder || "ASC",
      search: params.search || "",
      merchantOrgId: params.merchantOrgId || "",
      status: params.status || "",
      startDate: params.startDate || "",
      endDate: params.endDate || "",
    };

    const filteredParams = Object.fromEntries(
      Object.entries(queryParams).filter(([ v]) => v !== "")
    );
    const queryString = new URLSearchParams(filteredParams).toString();
    console.log("GET Query Parameters:", filteredParams);
    console.log("GET Query String:", queryString);

    const apiUrl = "https://redcollection.onrender.com/api/v1/reports/organizations";
    const fullUrl = queryString ? `${apiUrl}?${queryString}` : apiUrl;
    console.log("External API GET URL:", fullUrl);

    const res = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();
    console.log("External API GET Response:", {
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
          error: data.detail || data.message || "Failed to fetch organization data",
          status: res.status,
          response: data,
        },
        { status: res.status }
      );
    }
  } catch (error) {
    console.error("GET Organization Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}