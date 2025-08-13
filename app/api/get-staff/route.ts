import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  console.log("Received GET request for /api/get-staff");
  try {
    const { searchParams } = new URL(request.url);
    const merchantAdminId = searchParams.get("merchantAdminId");

    if (!merchantAdminId) {
      console.error("Missing merchantAdminId");
      return NextResponse.json(
        { statusCode: 400, status: false, message: "merchantAdminId is required", data: null },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    console.log("Retrieved accessToken:", accessToken ? "Present" : "Missing");

    if (!accessToken) {
      console.error("No access token found");
      return NextResponse.json(
        { statusCode: 401, status: false, message: "Authorization required", data: null },
        { status: 401 }
      );
    }

    const apiUrl = `https://redcollection.onrender.com/api/v1/users/get-staff?merchantAdminId=${encodeURIComponent(merchantAdminId)}`;
    console.log("External API GET URL:", apiUrl);

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    const text = await res.text();
    console.log("Raw API Response:", text);
    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error("External API GET: Invalid JSON response", { status: res.status, text: text.slice(0, 100) });
      console.log(error);
      return NextResponse.json(
        { statusCode: 502, status: false, message: `Invalid response from external API: Not JSON (status ${res.status})`, data: null },
        { status: 502 }
      );
    }

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
          statusCode: res.status,
          status: false,
          message: data.message || "Failed to fetch staff data",
          data: null,
        },
        { status: res.status }
      );
    }
  } catch (error) {
    console.error("GET Staff:", error);
    return NextResponse.json(
      { statusCode: 500, status: false, message: "Internal server error", data: null },
      { status: 500 }
    );
  }
}