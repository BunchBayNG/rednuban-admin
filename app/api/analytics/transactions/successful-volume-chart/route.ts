import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      startDate: searchParams.get("startDate") || "",
      endDate: searchParams.get("endDate") || "",
      period: searchParams.get("period") || "",
      merchantOrgId: searchParams.get("merchantOrgId") || "",
    };

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });
    }

    const apiUrl = "https://redcollection.onrender.com/api/v1/analytics/transactions/successful-volume-chart";
    const url = `${apiUrl}?startDate=${queryParams.startDate}&endDate=${queryParams.endDate}&period=${queryParams.period}${
      queryParams.merchantOrgId ? `&merchantOrgId=${queryParams.merchantOrgId}` : ""
    }`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json();

    if (!res.ok || !data.status) {
      return NextResponse.json({ status: false, message: "Failed to fetch data", data: [] }, { status: 500 });
    }

    return NextResponse.json({ status: true, data: data.data }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { status: false, message: err instanceof Error ? err.message : "Unknown error", data: [] },
      { status: 500 }
    );
  }
}
