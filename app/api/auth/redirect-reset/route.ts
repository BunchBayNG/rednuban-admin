import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Invalid reset link" }, { status: 400 });
  }

  // Redirect to frontend reset page
  const redirectUrl = new URL("/reset", process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000");
  redirectUrl.searchParams.set("token", token);
  return NextResponse.redirect(redirectUrl);
}