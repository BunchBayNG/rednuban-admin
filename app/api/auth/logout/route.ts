import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cookieStore: any = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) {
      const response = NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      response.cookies.delete("accessToken");
      response.cookies.delete("tempAccessToken");
      response.cookies.delete("refreshToken");
      return response;
    }

    const res = await fetch("https://redcollection.onrender.com/api/v1/auth/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log("Logout API response:", JSON.stringify(data, null, 2)); // Debug log
    if (res.ok && data.status) {
      const response = NextResponse.json({ success: true, message: data.message });
      response.cookies.delete("accessToken");
      response.cookies.delete("tempAccessToken");
      response.cookies.delete("refreshToken");
      return response;
    } else {
      console.error("Logout failed response:", JSON.stringify(data, null, 2));
      const response = NextResponse.json({ error: data.message || "Logout failed" }, { status: res.status });
      response.cookies.delete("accessToken");
      response.cookies.delete("tempAccessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
  } catch (error) {
    console.error("Logout error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    response.cookies.delete("accessToken");
    response.cookies.delete("tempAccessToken");
    response.cookies.delete("refreshToken");
    return response;
  }
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed. Use GET for logout." }, { status: 405 });
}