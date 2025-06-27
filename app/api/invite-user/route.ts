import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("Authorization");

    console.log("Invite User - Incoming Request:", {
      url: request.url,
      method: request.method,
      headers: { Authorization: authHeader },
      body,
    });

    if (!authHeader) {
      console.error("No Authorization header provided");
      return NextResponse.json({ error: "Authorization header missing" }, { status: 401 });
    }

    const apiUrl = "https://redcollection.onrender.com/invite-user";
    console.log("External API URL:", apiUrl);
    console.log("Outgoing Request Headers:", { Authorization: authHeader });

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("External API Response:", {
      status: res.status,
      body: JSON.stringify(data, null, 2),
    });

    if (res.ok && data.status) {
      return NextResponse.json({ success: true, message: data.message, data: data.data });
    } else {
      console.error("External API Error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to invite user" },
        { status: res.status }
      );
    }
  } catch (error) {
    console.error("Invite User Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}