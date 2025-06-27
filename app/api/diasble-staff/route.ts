import { NextResponse } from "next/server";

export async function PUT(request: Request) {
try {
const { searchParams } = new URL(request.url);
const merchantAdminId = searchParams.get("merchantAdminId") || "";
const staffId = searchParams.get("staffId") || "";
if (!merchantAdminId || !staffId) {
return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
}

const apiUrl = `https://redcollection.onrender.com/disable-staff?merchantAdminId=${encodeURIComponent(merchantAdminId)}&staffId=${encodeURIComponent(staffId)}`;
console.log("External API URL:", apiUrl);

const res = await fetch(apiUrl, {
method: "PUT",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${request.headers.get("Authorization") || ""}`,
},
});

const data = await res.json();
console.log("External API response:", JSON.stringify(data, null, 2));

if (res.ok && data.status) {
return NextResponse.json({ success: true, message: data.message || "Staff status updated successfully" });
} else {
return NextResponse.json({ error: data.message || "Failed to update staff status" }, { status: res.status });
}
} catch (error) {
console.error("Disable staff error:", error);
return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
}