import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const userId = cookieStore.get("userId")?.value;
    const organizationId = cookieStore.get("organizationId")?.value;

    console.log("Invite User - Incoming Request:", {
      url: request.url,
      method: request.method,
      cookies: { accessToken: accessToken ? "Present" : "Missing", userId, organizationId },
      body,
    });

    if (!accessToken) {
      console.error("No accessToken found in cookies");
      return NextResponse.json({ error: "Session expired. Please log in again." }, { status: 401 });
    }

    if (!userId) {
      console.error("No userId found in cookies");
      return NextResponse.json({ error: "User ID not found. Please log in again." }, { status: 400 });
    }

    if (!organizationId || organizationId === "") {
      console.error("No organizationId found in cookies or empty");
      return NextResponse.json({ error: "Organization ID not found. Please log in again." }, { status: 400 });
    }

    if (!body.firstName || !body.lastName || !body.email || !body.role) {
      console.error("Missing required fields in request body:", body);
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiUrl = "https://redcollection.onrender.com/api/v1/users/invite";
    console.log("External API URL:", apiUrl);
    console.log("Outgoing Request:", {
      headers: { Authorization: `Bearer ${accessToken}` },
      body: {
        organizationId,
        userId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        role: body.role,
        message: body.message,
      },
    });

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      body: JSON.stringify({
        organizationId,
        userId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        role: body.role,
        message: body.message,
      }),
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