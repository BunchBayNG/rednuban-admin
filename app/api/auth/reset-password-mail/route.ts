import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const apiUrl = `https://redcollection.onrender.com/api/v1/redtech/auth/reset-password-mail?email=${encodeURIComponent(email)}`;
    console.log("External API URL:", apiUrl); // Debug log
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    console.log("External API response:", JSON.stringify(data, null, 2)); // Debug log

    // Check if the response is an array and contains a success status
    if (res.ok && Array.isArray(data) && data.length > 0 && data[0].status === "Forgot password Email Sent.") {
      return NextResponse.json({ success: true, message: "Reset link sent to your email" });
    } else {
      return NextResponse.json(
        { error: data.message || data[0]?.rejectReason || "Failed to send reset link" },
        { status: res.status }
      );
    }
  } catch (error) {
    console.error("Reset password mail error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}