import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const res = await fetch("https://redcollection.onrender.com/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("Login API response:", JSON.stringify(data, null, 2)); // Debug log
    if (res.ok && data.status) {
      const token = data.data?.token;
      if (!token) {
        console.error("No token in response:", data);
        return NextResponse.json({ error: "No token provided by server" }, { status: 500 });
      }

      const response = NextResponse.json({ success: true, message: data.message });
      response.cookies.set("tempAccessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600, // 1 hour
      });
      console.log("Set tempAccessToken:", token); // Debug log
      return response;
    } else {
      return NextResponse.json({ error: data.message || "Login failed" }, { status: res.status });
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}