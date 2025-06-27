import { cookies } from "next/headers";

export async function getValidAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value ?? null;
  const refreshToken = cookieStore.get("refreshToken")?.value ?? null;

  console.log("Checking accessToken:", accessToken ? "Present" : "Missing");
  console.log("Checking refreshToken:", refreshToken ? "Present" : "Missing");

  if (!accessToken && !refreshToken) {
    console.error("No access or refresh token available");
    return null;
  }

  if (!accessToken && refreshToken) {
    console.log("Access token missing, attempting to refresh");
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log("Refresh API Response:", JSON.stringify(data, null, 2));

      if (res.ok && data.success) {
        const newAccessToken = data.data.accessToken;
        console.log("New accessToken set:", newAccessToken);
        return newAccessToken;
      } else {
        console.error("Failed to refresh token:", data);
        return null;
      }
    } catch (error) {
      console.error("Refresh Token Error:", error);
      return null;
    }
  }

  return accessToken;
}