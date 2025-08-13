import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const otp = searchParams.get("otp");
  const from = searchParams.get("from"); // Get 'from' parameter for redirect

  console.log("Received GET request for /api/auth/verify", { otp, from });
  
  if (!otp) {
    console.error("OTP is required");
    return NextResponse.json({ error: "OTP is required" }, { status: 400 });
  }

  try {
    const cookieStore = await cookies();
    const tempAccessToken = cookieStore.get("tempAccessToken")?.value;
    console.log("Retrieved tempAccessToken:", tempAccessToken ? "Present" : "Missing");

    if (!tempAccessToken) {
      console.error("No temp access token found");
      return NextResponse.json({ error: "Session expired. Please log in again." }, { status: 401 });
    }

    const apiUrl = `https://redcollection.onrender.com/api/v1/auth/verify-login-otp?otp=${encodeURIComponent(otp)}`;
    console.log("External API URL:", apiUrl);

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tempAccessToken}`,
      },
    });

    const data = await res.json();
    console.log("External API Response:", JSON.stringify(data, null, 2));

    if (res.ok && data.status) {
      // Verify required data is present
      if (!data.data.accessToken) {
        console.error("No accessToken received from API");
        return NextResponse.json({ error: "Authentication data missing" }, { status: 500 });
      }
      
      if (!data.data.userId) {
        console.error("No userId received from API");
        return NextResponse.json({ error: "User data missing" }, { status: 500 });
      }
      
      if (!data.data.organizationId) {
        console.error("No organizationId received from API");
        return NextResponse.json({ error: "Organization data missing" }, { status: 500 });
      }

      console.log("organizationId from API:", data.data.organizationId);
      console.log("userId from API:", data.data.userId);
      console.log("accessToken from API:", data.data.accessToken ? "Present" : "Missing");

      const redirectPath = from === "forgot-password" 
        ? `/reset?email=${encodeURIComponent(data.data.email || "")}` 
        : (from || "/dashboard");
        
      const response = NextResponse.json({
        success: true,
        message: data.message,
        redirect: redirectPath,
        data: {
          accessToken: data.data.accessToken,
          organizationId: data.data.organizationId,
          userId: data.data.userId, // merchantAdminId
        },
      });

      // Set accessToken cookie
      response.cookies.set("accessToken", data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600, // 1 hour
      });
      console.log("Set accessToken cookie");

      // Set userId cookie
      response.cookies.set("userId", data.data.userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600, // 1 hour, same as accessToken
      });
      console.log("Set userId cookie:", data.data.userId);

      // Set organizationId cookie (THIS WAS MISSING)
      response.cookies.set("organizationId", data.data.organizationId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600, // 1 hour, same as accessToken
      });
      console.log("Set organizationId cookie:", data.data.organizationId);

      // Set refreshToken if available
      if (data.data.refreshToken) {
        response.cookies.set("refreshToken", data.data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 3600, // 7 days
        });
        console.log("Set refreshToken cookie");
      } else {
        console.warn("No refreshToken provided in API response");
      }

      // Clean up temp token
      response.cookies.delete("tempAccessToken");
      console.log("Deleted tempAccessToken");

      return response;
    } else {
      console.error("Verification failed:", data);
      return NextResponse.json({ error: data.message || "Verification failed" }, { status: res.status });
    }
  } catch (error) {
    console.error("Verify Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}