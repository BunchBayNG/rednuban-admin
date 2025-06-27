import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  console.log("Received GET request for /api/get-staff");
  try {
    const { searchParams } = new URL(request.url);
    const merchantAdminId = searchParams.get("merchantAdminId");

    if (!merchantAdminId) {
      console.error("Missing merchantAdminId");
      return NextResponse.json({ error: "merchantAdminId is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    console.log("Retrieved accessToken:", accessToken ? "Present" : "Missing");

    if (!accessToken) {
      console.error("No access token found");
      return NextResponse.json({ error: "Authorization required" }, { status: 401 });
    }

    const apiUrl = `https://redcollection.onrender.com/api/v1/users/get-staff?merchantAdminId=${merchantAdminId}`;
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
          error: data.message || "Failed to fetch staff data",
          status: res.status,
          response: data,
        },
        { status: res.status }
      );
    }
  } catch (error) {
    console.error("GET Staff:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}