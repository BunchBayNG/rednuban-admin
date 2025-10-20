import { NextResponse } from "next/server";
import { cookies } from "next/headers";

interface ConfigItem {
  id: number;
  serviceType: string;
  fee: number;
  feeType: string;
  cap: number | null;
}

// Backend returns just an array, not wrapped object
type RawConfigResponse = ConfigItem[];

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    console.log("Retrieved accessToken for config:", accessToken ? "Present" : "Missing");

    if (!accessToken) {
      console.error("No access token found in cookie");
      return NextResponse.json({ error: "Authorization required" }, { status: 401 });
    }

    const apiUrl = "https://redcollection.onrender.com/api/v1/admin/manage-config";
    console.log("External API URL:", apiUrl);

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseText = await res.text();
    console.log("=== RAW API RESPONSE DEBUG ===");
    console.log("Status:", res.status);
    console.log("Response Body (first 500 chars):", responseText.substring(0, 500));
    console.log("================================");

    if (responseText.includes("<!doctype") || responseText.includes("<html")) {
      console.error("API returned HTML error page");
      return NextResponse.json(
        { error: "API returned HTML error page" }, 
        { status: 502 }
      );
    }

    let configData: RawConfigResponse;
    try {
      configData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON response from API" }, 
        { status: 502 }
      );
    }

    console.log("Parsed Config Data:", configData);

    // Since backend returns just array, wrap it in expected format
    const responseData = {
      statusCode: res.status,
      status: true,
      message: "Configuration fetched successfully",
      data: configData
    };

    if (res.ok) {
      return NextResponse.json(responseData, { status: 200 });
    } else {
      return NextResponse.json(
        {
          statusCode: res.status,
          status: false,
          message: "Failed to fetch configuration",
          data: configData
        },
        { status: res.status }
      );
    }
  } catch (error) {
    console.error("Config fetch error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        status: false,
        message: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  }
}