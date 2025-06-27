import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PUT(request: Request) {
  console.log("Received PUT request for /api/onboard-org");
  try {
    const body = await request.json();
    console.log("Request Body:", JSON.stringify(body, null, 2));

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const userId = cookieStore.get("userId")?.value;
    console.log("Retrieved accessToken:", accessToken ? "Present" : "Missing");
    console.log("Retrieved userId:", userId ? userId : "Missing");

    if (!accessToken) {
      console.error("No access token found");
      return NextResponse.json({ error: "Authorization required" }, { status: 401 });
    }

    if (!userId) {
      console.error("No user ID found in cookies");
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    const apiUrl = `https://redcollection.onrender.com/api/v1/users/onboard-org`;
    console.log("External API PUT URL:", apiUrl);

    const payload = {
      ...body,
      inviteUserId: userId,
    };
    console.log("Sending Payload to External API:", JSON.stringify(payload, null, 2));

    const res = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
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
      console.error("External API PUT Error:", data);
      return NextResponse.json(
        {
          error: data.message || "Failed to onboard organization",
          status: res.status,
          response: data,
        },
        { status: res.status }
      );
    }
  } catch (error) {
    console.error("PUT Onboard Org:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}