import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  console.log("Received GET request for /api/auth/refresh");
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    console.log("Retrieved refreshToken:", refreshToken ? "Present" : "Missing");

    if (!refreshToken) {
      console.error("No refresh token found");
      return NextResponse.json({ error: "Refresh token required" }, { status: 401 });
    }

    const apiUrl = `https://redcollection.onrender.com/api/v1/auth/refreshToken`;
    console.log("External API URL:", apiUrl);

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const data = await res.json();
    console.log("External API Response:", JSON.stringify(data, null, 2));

    if (res.ok && data.status) {
      const response = NextResponse.json({
        success: true,
        message: data.message,
        data: {
          accessToken: data.data.accessToken,
        },
      });

      response.cookies.set("accessToken", data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600, // 1 hour
      });

      if (data.data.refreshToken) {
        response.cookies.set("refreshToken", data.data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 3600, // 7 days
        });
        console.log("Set new refreshToken:", data.data.refreshToken);
      } else {
        console.warn("No new refreshToken provided in API response");
      }

      return response;
    } else {
      console.error("External API Error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to refresh token" },
        { status: res.status }
      );
    }
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}