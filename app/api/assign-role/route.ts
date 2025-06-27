import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const { adminId, email, roleName, roleId, permissionsIds } = await request.json();
    if (!adminId || !email || !roleName || !roleId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiUrl = `https://redcollection.onrender.com/api/v1/redtech/assign-role`;
    console.log("External API URL:", apiUrl);

    const res = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${request.headers.get("Authorization") || ""}`,
      },
      body: JSON.stringify({ adminId, email, roleName, roleId, permissionsIds }),
    });

    const data = await res.json();
    console.log("External API response:", JSON.stringify(data, null, 2));

    if (res.ok && data.status) {
      return NextResponse.json({ success: true, message: data.message || "Role assigned successfully" });
    } else {
      return NextResponse.json({ error: data.message || "Failed to assign role" }, { status: res.status });
    }
  } catch (error) {
    console.error("Assign role error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}