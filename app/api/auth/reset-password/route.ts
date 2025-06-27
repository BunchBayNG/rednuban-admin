import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { newPassword, confirmPassword, token } = await request.json();
    if (!newPassword || !confirmPassword || !token) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    const apiUrl = `https://redcollection.onrender.com/api/v1/redtech/auth/reset-password?newPassword=${encodeURIComponent(newPassword)}&confirmPassword=${encodeURIComponent(confirmPassword)}&token=${encodeURIComponent(token)}`;
    console.log("External API URL:", apiUrl); // Debug log
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    console.log("External API response:", JSON.stringify(data, null, 2)); // Debug log
    if (res.ok && data.status) {
      return NextResponse.json({ success: true, message: data.message || "Password reset successfully" });
    } else {
      if (data.message?.includes("expired")) {
        return NextResponse.json({ error: "Reset link has expired. Please request a new link." }, { status: 400 });
      }
      return NextResponse.json({ error: data.message || "Failed to reset password" }, { status: res.status });
    }
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}