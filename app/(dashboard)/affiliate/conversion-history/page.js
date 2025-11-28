"use client";

import { useState, useEffect } from "react";
import {
  ShareIcon,
  DocumentDuplicateIcon,
  EllipsisVerticalIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import api, { getFrontendBaseUrl } from "@/lib/api";

export default function ConversionHistoryPage() {
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [metricsData, setMetricsData] = useState(null);
  const [conversionHistory, setConversionHistory] = useState([]);
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState(null);
  const [frontendBaseUrl, setFrontendBaseUrl] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Set frontend base URL on client side
    if (typeof window !== "undefined") {
      setFrontendBaseUrl(window.location.origin);
    }
    fetchMetrics();
    fetchConversionHistory();
    fetchUserProfile();
  }, []);

  // Log conversion history whenever it changes
  useEffect(() => {
    console.log("📊 Conversion History State Updated:", conversionHistory);
    console.log("📊 Conversion History Length:", conversionHistory?.length || 0);
    if (conversionHistory && conversionHistory.length > 0) {
      console.log("📋 Conversion History Items:", conversionHistory);
    }
  }, [conversionHistory]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/affiliate/metrics");

      if (response.data?.success) {
        console.log("📊 Metrics Data Received:", response.data.data);
        console.log("📊 All Available Fields:", Object.keys(response.data.data || {}));
        console.log("📊 Total Earnings:", response.data.data?.totalEarnings, "Type:", typeof response.data.data?.totalEarnings);
        console.log("📊 Total Referrals:", response.data.data?.totalReferrals, "Type:", typeof response.data.data?.totalReferrals);
        console.log("📊 Active Referrals:", response.data.data?.activeReferrals, "Type:", typeof response.data.data?.activeReferrals);
        console.log("📊 Pending Earnings:", response.data.data?.pendingEarnings, "Type:", typeof response.data.data?.pendingEarnings);
        console.log("📊 Available Earnings:", response.data.data?.availableEarnings, "Type:", typeof response.data.data?.availableEarnings);
        console.log("📊 Balance:", response.data.data?.balance, "Type:", typeof response.data.data?.balance);
        console.log("📊 Conversion Rate:", response.data.data?.conversionRate, "Type:", typeof response.data.data?.conversionRate);
        
        console.log("📊 Final Metrics Object:", response.data.data);
        setMetricsData(response.data.data);
      } else {
        setError(response.data?.message || "Failed to fetch metrics.");
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
      if (error.response?.status === 429) {
        const message = error.response?.data?.message || "Too many requests. Please wait a few minutes and try again.";
        setError(message);
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        setError("Authentication required. Please login.");
      } else {
        const message = error.response?.data?.message || "Failed to fetch metrics. Please try again.";
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchConversionHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Fetching conversion history from backend...");
      const response = await api.get("/affiliate/conversion-history");

      // Log the full response
      console.log("📥 Full API Response:", response);
      console.log("📥 Response Data:", response.data);
      console.log("📥 Response Status:", response.status);
      console.log("📥 Response Headers:", response.headers);

      if (response.data?.success) {
        console.log("✅ Response has success flag");
        // Handle different possible response structures
        const historyData = response.data.data || response.data.conversions || response.data.transactions || [];
        console.log("📊 Extracted History Data:", historyData);
        console.log("📊 History Data Type:", typeof historyData);
        console.log("📊 Is Array:", Array.isArray(historyData));
        console.log("📊 History Data Length:", Array.isArray(historyData) ? historyData.length : "N/A");
        
        if (Array.isArray(historyData) && historyData.length > 0) {
          console.log("📋 First Item Sample:", historyData[0]);
        }
        
        setConversionHistory(Array.isArray(historyData) ? historyData : []);
      } else {
        console.log("⚠️ Response does not have success flag");
        // If no success flag, try to extract data directly
        const historyData = response.data?.data || response.data?.conversions || response.data?.transactions || response.data || [];
        console.log("📊 Extracted History Data (no success flag):", historyData);
        console.log("📊 History Data Type:", typeof historyData);
        console.log("📊 Is Array:", Array.isArray(historyData));
        console.log("📊 History Data Length:", Array.isArray(historyData) ? historyData.length : "N/A");
        
        if (Array.isArray(historyData) && historyData.length > 0) {
          console.log("📋 First Item Sample:", historyData[0]);
        }
        
        setConversionHistory(Array.isArray(historyData) ? historyData : []);
      }
    } catch (error) {
      console.error("❌ Error fetching conversion history:", error);
      console.error("❌ Error Response:", error.response);
      console.error("❌ Error Response Data:", error.response?.data);
      console.error("❌ Error Response Status:", error.response?.status);
      console.error("❌ Error Message:", error.message);
      
      if (error.response?.status === 429) {
        const message = error.response?.data?.message || "Too many requests. Please wait a few minutes and try again.";
        setError(message);
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        setError("Authentication required. Please login.");
      } else {
        // If endpoint doesn't exist yet, set empty array (no dummy data)
        console.log("⚠️ Setting empty array - no data from backend");
        setConversionHistory([]);
      }
    } finally {
      setLoading(false);
      console.log("🏁 Fetch conversion history completed");
    }
  };

  const fetchUserProfile = async () => {
    try {
      const userStr = localStorage.getItem("USER");
      if (!userStr) {
        console.warn("User not found in localStorage");
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user._id || user.id;

      if (!userId) {
        console.warn("User ID not found");
        return;
      }

      const response = await api.get(`/user-profile/${userId}`);
      const userData = response.data?.data || response.data;

      if (userData?.referralCode) {
        setReferralCode(userData.referralCode);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };


   const getStatusColors = (status) => {
     switch (status?.toLowerCase()) {
       case "approved":
       case "completed":
         return "bg-[#193024] text-[#38FF63]";
       case "pending":
         return "bg-[#2B2B2B] text-[#757575]";
       case "rejected":
       case "failed":
         return "bg-[#301B19] text-[#FF6338]";
       default:
         return "bg-gray-400 text-gray-800";
     }
   };

   // Format conversion history from backend data
   const formatConversionHistory = () => {
     console.log("🔧 Formatting conversion history...");
     console.log("🔧 Conversion History State:", conversionHistory);
     console.log("🔧 Is Array:", Array.isArray(conversionHistory));
     console.log("🔧 Length:", conversionHistory?.length || 0);
     
     if (!conversionHistory || !Array.isArray(conversionHistory) || conversionHistory.length === 0) {
       console.log("⚠️ No conversion history to format");
       return [];
     }

     console.log("✅ Formatting", conversionHistory.length, "items");
     const formatted = conversionHistory.map((conversion, index) => {
       console.log(`📝 Formatting item ${index + 1}:`, conversion);
       // Handle different date field names
       const dateValue = conversion.date || conversion.createdAt || conversion.timestamp || conversion.dateTime;
       const date = dateValue ? new Date(dateValue) : new Date();
       
       const formattedDate = date.toLocaleDateString("en-GB", {
         day: "2-digit",
         month: "short",
         year: "numeric",
       });
       const formattedTime = date.toLocaleTimeString("en-GB", {
         hour: "2-digit",
         minute: "2-digit",
       });

       // Map API status to display status
       let displayStatus = conversion.status;
       if (conversion.status === "completed" || conversion.status === "approved") {
         displayStatus = "Approved";
       } else if (conversion.status === "pending") {
         displayStatus = "Pending";
       } else if (conversion.status === "failed" || conversion.status === "rejected") {
         displayStatus = "Rejected";
       }

       // Handle different transaction ID field names
       const transactionId = conversion.id || conversion._id || conversion.transactionId || conversion.transaction_id || `TXN${index + 1}`;
       
       // Handle different amount field names
       const amount = conversion.amount || conversion.commission || conversion.value || 0;

       const formattedItem = {
         id: index + 1,
         transactionId: transactionId,
         dateTime: `${formattedDate}/${formattedTime}`,
         amount: `$${amount}`,
         status: displayStatus,
       };
       console.log(`✅ Formatted item ${index + 1}:`, formattedItem);
       return formattedItem;
     });
     
     console.log("✅ All formatted items:", formatted);
     return formatted;
   };

   const formattedHistory = formatConversionHistory();
   console.log("📋 Final Formatted History for Display:", formattedHistory);
   console.log("📋 Formatted History Length:", formattedHistory.length);

  const copyReferralLink = async () => {
    try {
      const baseUrl = "https://themutantschool-frontend.vercel.app";
      const referralLink = referralCode 
        ? `${baseUrl}/auth/register?ref=${referralCode}`
        : `${baseUrl}/auth/register?ref=`;
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const shareReferralLink = async () => {
    const baseUrl = "https://themutantschool-frontend.vercel.app";
    const referralLink = referralCode 
      ? `${baseUrl}/auth/register?ref=${referralCode}`
      : `${baseUrl}/auth/register?ref=`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Mutant School",
          text: "Join me on Mutant School and start learning!",
          url: referralLink,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(referralLink);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-t-transparent border-[#7343B3] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg p-6" style={{ backgroundColor: "#0A0A0A" }}>
        <div className="text-red-400 mb-4">{error}</div>
        <button
          onClick={fetchMetrics}
          className="px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: "#7343B3" }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* Summary Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-6 mb-4 sm:mb-6 lg:mb-8 w-full">
        <div className="rounded-lg p-2.5 sm:p-3 lg:p-6 w-full min-w-0" style={{ backgroundColor: "#0A0A0A" }}>
          <h3 className="text-xs sm:text-sm text-gray-400 mb-2 break-words leading-tight">Total Earnings</h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white break-words">
            ${metricsData?.totalEarnings || 0}
          </p>
        </div>
        <div className="rounded-lg p-2.5 sm:p-3 lg:p-6 w-full min-w-0" style={{ backgroundColor: "#0A0A0A" }}>
          <h3 className="text-xs sm:text-sm text-gray-400 mb-2 break-words leading-tight">Total Referrals</h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white break-words">
            {metricsData?.totalReferrals || 0}
          </p>
        </div>
        <div className="rounded-lg p-2.5 sm:p-3 lg:p-6 w-full min-w-0" style={{ backgroundColor: "#0A0A0A" }}>
          <h3 className="text-xs sm:text-sm text-gray-400 mb-2 break-words leading-tight">Pending Earnings</h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white break-words">
            ${metricsData?.pendingEarnings || 0}
          </p>
        </div>
        <div className="rounded-lg p-2.5 sm:p-3 lg:p-6 w-full min-w-0" style={{ backgroundColor: "#0A0A0A" }}>
          <h3 className="text-xs sm:text-sm text-gray-400 mb-2 break-words leading-tight">Available Earnings</h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white break-words">
            ${metricsData?.availableEarnings || 0}
          </p>
        </div>
      </div>

      {/* Additional Metrics */}
      {metricsData && (
        <div className="rounded-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8 w-full min-w-0" style={{ backgroundColor: "#060606" }}>
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 lg:mb-4">Analytics Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1 break-words">Earnings per Referral</p>
              <p className="text-base sm:text-lg font-semibold text-white break-words">
                {(() => {
                  const totalRefs = Number(metricsData.totalReferrals) || 0;
                  const totalEarnings = Number(metricsData.totalEarnings) || 0;
                  if (totalRefs > 0) {
                    const perRef = totalEarnings / totalRefs;
                    return `$${isNaN(perRef) ? "0.00" : perRef.toFixed(2)}`;
                  }
                  return "$0.00";
                })()}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1 break-words">Pending Earnings</p>
              <p className="text-base sm:text-lg font-semibold text-white break-words">
                ${Number(metricsData.pendingEarnings) || 0}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1 break-words">Available Earnings</p>
              <p className="text-base sm:text-lg font-semibold text-white break-words">
                ${Number(metricsData.availableEarnings) || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Referral Link Section */}
      <div
        className="rounded-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8 w-full min-w-0"
        style={{ backgroundColor: "#060606" }}
      >
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 lg:mb-4">Referral Link</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 rounded-lg px-3 sm:px-4 py-2 sm:py-3 overflow-x-auto min-w-0">
            <span className="text-purple-400 font-mono text-xs sm:text-sm break-all break-words leading-relaxed block">
              {referralCode ? (
                <>
                  https://themutantschool-frontend.vercel.app/auth/register?ref={referralCode}
                </>
              ) : (
                "Loading referral code..."
              )}
            </span>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={shareReferralLink}
              className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors flex-1 sm:flex-initial"
              style={{ backgroundColor: "#101010" }}
            >
              <ShareIcon className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Share</span>
            </button>
            <button
              onClick={copyReferralLink}
              className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors flex-1 sm:flex-initial"
              style={{ backgroundColor: copiedLink ? "#193024" : "#101010" }}
            >
              {copiedLink ? (
                <>
                  <CheckIcon className="h-4 w-4 text-[#38FF63]" />
                  <span className="text-xs sm:text-sm text-[#38FF63]">Copied!</span>
                </>
              ) : (
                <>
                  <DocumentDuplicateIcon className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Conversion History Table */}
      <div className="rounded-lg p-3 sm:p-4 lg:p-6 w-full min-w-0 overflow-x-auto -mx-3 sm:-mx-4 lg:mx-0 px-3 sm:px-4 lg:px-0" style={{ backgroundColor: "#000000" }}>
        <div className="flex flex-row justify-between items-center gap-2 sm:gap-4 mb-3 sm:mb-4 lg:mb-6">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold flex-shrink-0 min-w-0">Conversion History</h2>
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">Sort By:</span>
            <button
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
              style={{ backgroundColor: "#2A2A2A" }}
            >
              <span className="hidden sm:inline">Newest To Oldest</span>
              <span className="sm:hidden">Newest</span>
              <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <table className="w-full min-w-[600px] sm:min-w-full">
            <thead>
              <tr className="bg-[#0C0C0C]">
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-[#9B9B9B]">
                  #
                </th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-[#9B9B9B] hidden sm:table-cell">
                  Transaction ID
                </th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-[#9B9B9B] hidden sm:table-cell">
                  Date/Time
                </th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-[#9B9B9B]">
                  Amount
                </th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-[#9B9B9B]">
                  Status
                </th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-[#9B9B9B]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="mb-2">
              {formattedHistory.length > 0 ? (
                formattedHistory.map((conversion) => (
                <tr key={conversion.id} className="bg-[#0C0C0C] rounded-[10px] ">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-white">{conversion.id}.</td>
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-[#9B9B9B] break-all max-w-[120px] sm:max-w-none hidden sm:table-cell">
                    {conversion.transactionId}
                  </td>
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-[#9B9B9B] hidden sm:table-cell">
                    {conversion.dateTime}
                  </td>
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-white font-medium">
                    {conversion.amount}
                  </td>
                  <td className="py-3 sm:py-4 px-2 sm:px-4">
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColors(
                        conversion.status
                      )}`}
                    >
                      {conversion.status}
                    </span>
                  </td>
                  <td className="py-3 sm:py-4 px-2 sm:px-4">
                    <button className="bg-[#6B6B6B] text-[#A5A5A5] rounded-[10px] hover:text-white p-1 sm:p-1.5">
                      <EllipsisVerticalIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </td>
                </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 px-4 text-center text-gray-400 text-sm">
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-t-transparent border-[#7343B3] rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      "No conversion history found"
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
}
