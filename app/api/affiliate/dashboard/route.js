import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");

    const backendUrl =
      "https://themutantschool-backend.onrender.com/api/affiliate/dashboard";

    console.log("🔄 [Dashboard API Route] Fetching dashboard from backend...");
    console.log("🔄 [Dashboard API Route] Backend URL:", backendUrl);
    console.log("🔄 [Dashboard API Route] Has Auth Header:", !!authHeader);

    const headers = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
      console.log("🔄 [Dashboard API Route] Auth Header:", authHeader.substring(0, 20) + "...");
    }

    console.log("🔄 [Dashboard API Route] Request Headers:", headers);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: headers,
    });

    console.log("📥 [Dashboard API Route] Backend Response Status:", response.status);
    console.log("📥 [Dashboard API Route] Backend Response Headers:", Object.fromEntries(response.headers.entries()));

    const data = await response.json();

    console.log("📥 [Dashboard API Route] ========================================");
    console.log("📥 [Dashboard API Route] FULL BACKEND RESPONSE:");
    console.log("📥 [Dashboard API Route] ========================================");
    console.log(JSON.stringify(data, null, 2));
    console.log("📥 [Dashboard API Route] ========================================");
    
    console.log("📥 [Dashboard API Route] Response Data Type:", typeof data);
    console.log("📥 [Dashboard API Route] Is Array:", Array.isArray(data));
    console.log("📥 [Dashboard API Route] Has Success Flag:", !!data?.success);
    console.log("📥 [Dashboard API Route] Data Keys:", data ? Object.keys(data) : "No data");

    if (data?.data) {
      console.log("📥 [Dashboard API Route] Data.data exists");
      console.log("📥 [Dashboard API Route] Data.data Type:", typeof data.data);
      console.log("📥 [Dashboard API Route] Data.data Is Array:", Array.isArray(data.data));
      console.log("📥 [Dashboard API Route] Data.data Keys:", Object.keys(data.data));
      
      if (data.data) {
        console.log("📥 [Dashboard API Route] Data.data Content:", JSON.stringify(data.data, null, 2));
        
        // Log metrics
        if (data.data.metrics) {
          console.log("📥 [Dashboard API Route] Metrics:", JSON.stringify(data.data.metrics, null, 2));
          console.log("📥 [Dashboard API Route] - commissionPerStudent:", data.data.metrics.commissionPerStudent);
          console.log("📥 [Dashboard API Route] - referralCode:", data.data.metrics.referralCode);
          console.log("📥 [Dashboard API Route] - referredStudents:", data.data.metrics.referredStudents);
        }
        
        // Log overview
        if (data.data.overview) {
          console.log("📥 [Dashboard API Route] Overview:", JSON.stringify(data.data.overview, null, 2));
          if (data.data.overview.earnings) {
            console.log("📥 [Dashboard API Route] - earnings.available:", data.data.overview.earnings.available);
            console.log("📥 [Dashboard API Route] - earnings.currentMonth:", data.data.overview.earnings.currentMonth);
            console.log("📥 [Dashboard API Route] - earnings.pending:", data.data.overview.earnings.pending);
            console.log("📥 [Dashboard API Route] - earnings.total:", data.data.overview.earnings.total);
          }
        }
        
        // Log payoutInfo
        if (data.data.payoutInfo) {
          console.log("📥 [Dashboard API Route] PayoutInfo:", JSON.stringify(data.data.payoutInfo, null, 2));
        }
        
        // Log refundPolicyNotice
        if (data.data.refundPolicyNotice) {
          console.log("📥 [Dashboard API Route] RefundPolicyNotice:", JSON.stringify(data.data.refundPolicyNotice, null, 2));
        }
        
        // Log referrals
        if (data.data.referrals) {
          console.log("📥 [Dashboard API Route] Referrals:", JSON.stringify(data.data.referrals, null, 2));
          console.log("📥 [Dashboard API Route] - Referrals Count:", Array.isArray(data.data.referrals) ? data.data.referrals.length : "Not an array");
          if (Array.isArray(data.data.referrals) && data.data.referrals.length > 0) {
            console.log("📥 [Dashboard API Route] - First Referral:", JSON.stringify(data.data.referrals[0], null, 2));
          }
        }
        
        // Log transactions
        if (data.data.transactions) {
          console.log("📥 [Dashboard API Route] Transactions:", JSON.stringify(data.data.transactions, null, 2));
          console.log("📥 [Dashboard API Route] - Transactions.records:", Array.isArray(data.data.transactions.records) ? data.data.transactions.records.length : "Not an array");
          if (Array.isArray(data.data.transactions.records) && data.data.transactions.records.length > 0) {
            console.log("📥 [Dashboard API Route] - First Transaction:", JSON.stringify(data.data.transactions.records[0], null, 2));
          }
        }
        
        // Log withdrawals
        if (data.data.withdrawals) {
          console.log("📥 [Dashboard API Route] Withdrawals:", JSON.stringify(data.data.withdrawals, null, 2));
          console.log("📥 [Dashboard API Route] - Withdrawals Count:", Array.isArray(data.data.withdrawals) ? data.data.withdrawals.length : "Not an array");
        }
      }
    } else if (data && !data.data) {
      console.log("📥 [Dashboard API Route] Response data is directly in root");
      console.log("📥 [Dashboard API Route] Root Data Keys:", Object.keys(data));
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("❌ [Dashboard API Route] Error proxying to backend:", error);
    console.error("❌ [Dashboard API Route] Error Message:", error.message);
    console.error("❌ [Dashboard API Route] Error Stack:", error.stack);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch affiliate dashboard data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
