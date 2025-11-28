import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");

    const backendUrl =
      "https://themutantschool-backend.onrender.com/api/affiliate/conversion-history";

    console.log("🔄 [API Route] Fetching conversion history from backend...");
    console.log("🔄 [API Route] Backend URL:", backendUrl);
    console.log("🔄 [API Route] Has Auth Header:", !!authHeader);

    const headers = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
      console.log("🔄 [API Route] Auth Header:", authHeader.substring(0, 20) + "...");
    }

    console.log("🔄 [API Route] Request Headers:", headers);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: headers,
    });

    console.log("📥 [API Route] Backend Response Status:", response.status);
    console.log("📥 [API Route] Backend Response Headers:", Object.fromEntries(response.headers.entries()));

    const data = await response.json();

    console.log("📥 [API Route] Backend Response Data:", JSON.stringify(data, null, 2));
    console.log("📥 [API Route] Response Data Type:", typeof data);
    console.log("📥 [API Route] Is Array:", Array.isArray(data));
    console.log("📥 [API Route] Has Success Flag:", !!data?.success);
    console.log("📥 [API Route] Data Keys:", data ? Object.keys(data) : "No data");

    if (data?.data) {
      console.log("📥 [API Route] Data.data Type:", typeof data.data);
      console.log("📥 [API Route] Data.data Is Array:", Array.isArray(data.data));
      if (Array.isArray(data.data)) {
        console.log("📥 [API Route] Data.data Length:", data.data.length);
        if (data.data.length > 0) {
          console.log("📥 [API Route] First Item in data.data:", data.data[0]);
        }
      }
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("❌ [API Route] Error proxying to backend:", error);
    console.error("❌ [API Route] Error Message:", error.message);
    console.error("❌ [API Route] Error Stack:", error.stack);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch affiliate conversion history data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

