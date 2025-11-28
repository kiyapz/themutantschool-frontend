import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");

    const backendUrl =
      "https://themutantschool-backend.onrender.com/api/affiliate/metrics";

    console.log("🔄 [Metrics API Route] Fetching metrics from backend...");
    console.log("🔄 [Metrics API Route] Backend URL:", backendUrl);
    console.log("🔄 [Metrics API Route] Has Auth Header:", !!authHeader);

    const headers = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
      console.log("🔄 [Metrics API Route] Auth Header:", authHeader.substring(0, 20) + "...");
    }

    console.log("🔄 [Metrics API Route] Request Headers:", headers);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: headers,
    });

    console.log("📥 [Metrics API Route] Backend Response Status:", response.status);
    console.log("📥 [Metrics API Route] Backend Response Headers:", Object.fromEntries(response.headers.entries()));

    const data = await response.json();

    console.log("📥 [Metrics API Route] ========================================");
    console.log("📥 [Metrics API Route] FULL BACKEND RESPONSE:");
    console.log("📥 [Metrics API Route] ========================================");
    console.log(JSON.stringify(data, null, 2));
    console.log("📥 [Metrics API Route] ========================================");
    
    console.log("📥 [Metrics API Route] Response Data Type:", typeof data);
    console.log("📥 [Metrics API Route] Is Array:", Array.isArray(data));
    console.log("📥 [Metrics API Route] Has Success Flag:", !!data?.success);
    console.log("📥 [Metrics API Route] Data Keys:", data ? Object.keys(data) : "No data");

    if (data?.data) {
      console.log("📥 [Metrics API Route] Data.data exists");
      console.log("📥 [Metrics API Route] Data.data Type:", typeof data.data);
      console.log("📥 [Metrics API Route] Data.data Is Array:", Array.isArray(data.data));
      console.log("📥 [Metrics API Route] Data.data Keys:", Object.keys(data.data));
      
      if (data.data) {
        console.log("📥 [Metrics API Route] Data.data Content:", JSON.stringify(data.data, null, 2));
        console.log("📥 [Metrics API Route] totalEarnings:", data.data.totalEarnings, "Type:", typeof data.data.totalEarnings);
        console.log("📥 [Metrics API Route] totalReferrals:", data.data.totalReferrals, "Type:", typeof data.data.totalReferrals);
        console.log("📥 [Metrics API Route] activeReferrals:", data.data.activeReferrals, "Type:", typeof data.data.activeReferrals);
        console.log("📥 [Metrics API Route] conversionRate:", data.data.conversionRate, "Type:", typeof data.data.conversionRate);
      }
    } else if (data && !data.data) {
      console.log("📥 [Metrics API Route] Response data is directly in root");
      console.log("📥 [Metrics API Route] totalEarnings:", data.totalEarnings, "Type:", typeof data.totalEarnings);
      console.log("📥 [Metrics API Route] totalReferrals:", data.totalReferrals, "Type:", typeof data.totalReferrals);
      console.log("📥 [Metrics API Route] activeReferrals:", data.activeReferrals, "Type:", typeof data.activeReferrals);
      console.log("📥 [Metrics API Route] conversionRate:", data.conversionRate, "Type:", typeof data.conversionRate);
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("❌ [Metrics API Route] Error proxying to backend:", error);
    console.error("❌ [Metrics API Route] Error Message:", error.message);
    console.error("❌ [Metrics API Route] Error Stack:", error.stack);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch affiliate metrics data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
