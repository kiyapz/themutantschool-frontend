"use client";

import { useState, useEffect } from "react";
import {
  ShareIcon,
  DocumentDuplicateIcon,
  EllipsisVerticalIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import api from "@/lib/api";

export default function AffiliatePage() {
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetchAffiliateData();
    fetchUserProfile();
  }, []);

  const fetchAffiliateData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/affiliate/dashboard");
      const responsePayload = response.data.data;

      // The actual dashboard data is nested inside the 'data' property.
      const dashboardPayload = responsePayload?.data;

      if (responsePayload?.success && dashboardPayload) {
        console.log("✅ Affiliate API Response:", responsePayload);

        setDashboardData(dashboardPayload);
      } else {
        setError(responsePayload?.message || "Failed to fetch affiliate data.");
        console.error(
          "❌ Failed to get affiliate data or data is missing:",
          responsePayload
        );
      }
    } catch (error) {
      console.error("Error fetching affiliate data:", error);
      if (error.response?.status === 429) {
        const message =
          error.response?.data?.message ||
          "Too many requests. Please wait a few minutes and try again.";
        setError(message);
      } else if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        setError("Authentication required. Please login.");
      } else {
        const message =
          error.response?.data?.message ||
          "Failed to fetch data. Please try again.";
        setError(message);
      }
    } finally {
      setLoading(false);
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

  // Calculate summary stats from API data
  const summaryStats = [
    {
      title: "Total Earnings",
      value: dashboardData
        ? `$${Number(dashboardData.overview?.earnings?.total ?? 0).toFixed(2)}`
        : "$0.00",
    },
    {
      title: "Pending Payout",
      value: dashboardData
        ? `$${Number(dashboardData.overview?.earnings?.pending ?? 0).toFixed(
            2
          )}`
        : "$0.00",
    },
    {
      title: "Total Referrals",
      value: dashboardData
        ? `${Number(dashboardData.metrics?.referredStudents ?? 0)}`
        : "0",
    },
    {
      title: "Available For Payout",
      value: dashboardData
        ? `$${Number(dashboardData.overview?.earnings?.available ?? 0).toFixed(
            2
          )}`
        : "$0.00",
    },
  ];

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

  const payoutHistory = dashboardData?.transactions?.records || [];
  const recentReferrals = dashboardData?.referrals || [];
  const withdrawals = dashboardData?.withdrawals || [];

  // Calculate performance metrics from API data (with numeric coercion)
  const commissionPerStudent = Number(
    dashboardData?.metrics?.commissionPerStudent ?? 0
  );
  const referredStudents = Number(
    dashboardData?.metrics?.referredStudents ?? 0
  );
  const currentMonthEarnings = Number(
    dashboardData?.overview?.earnings?.currentMonth ?? 0
  );
  const pendingEarnings = Number(
    dashboardData?.overview?.earnings?.pending ?? 0
  );
  const totalEarnings = Number(dashboardData?.overview?.earnings?.total ?? 0);

  // Debug logs to verify values used in cards
  console.log("🧮 commissionPerStudent:", commissionPerStudent);
  console.log("🧮 referredStudents:", referredStudents);
  console.log("🧮 currentMonthEarnings:", currentMonthEarnings);
  console.log("🧮 pendingEarnings:", pendingEarnings);
  console.log("🧮 totalEarnings:", totalEarnings);

  const performanceMetrics = [
    {
      title: "Commission Per Student",
      value: `$${
        isNaN(commissionPerStudent) ? 0 : commissionPerStudent.toFixed(2)
      }`,
      change: `${isNaN(referredStudents) ? 0 : referredStudents} students`,
      changeColor: "text-[#38FF63]",
      graphColor: "bg-[#38FF63]",
      cardColor: "bg-[#193024]",
    },
    {
      title: "Total Referrals",
      value: `${isNaN(referredStudents) ? 0 : referredStudents}`,
      change: `$${isNaN(totalEarnings) ? 0 : totalEarnings.toFixed(2)} earned`,
      changeColor: "text-[#FF6338]",
      graphColor: "bg-[#FF6338]",
      cardColor: "bg-[#301B19]",
    },
    {
      title: "Current Month",
      value: `$${
        isNaN(currentMonthEarnings) ? 0 : currentMonthEarnings.toFixed(2)
      }`,
      change: `$${
        isNaN(pendingEarnings) ? 0 : pendingEarnings.toFixed(2)
      } pending`,
      changeColor: "text-[#A333CF]",
      graphColor: "bg-[#A333CF]",
      cardColor: "bg-[#2A1A3A]",
    },
  ];

  const copyReferralLink = async () => {
    try {
      const baseUrl = "https://themutantschool-frontend.vercel.app";
      const code =
        dashboardData?.metrics?.referralCode &&
        dashboardData.metrics.referralCode !== "N/A"
          ? dashboardData.metrics.referralCode
          : referralCode || "";
      const link = code
        ? `${baseUrl}/auth/register?ref=${code}`
        : `${baseUrl}/auth/register?ref=`;
      await navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const shareReferralLink = async () => {
    const baseUrl = "https://themutantschool-frontend.vercel.app";
    const code =
      dashboardData?.metrics?.referralCode &&
      dashboardData.metrics.referralCode !== "N/A"
        ? dashboardData.metrics.referralCode
        : referralCode || "";
    const link = code
      ? `${baseUrl}/auth/register?ref=${code}`
      : `${baseUrl}/auth/register?ref=`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Mutant School",
          text: "Join me on Mutant School and start learning!",
          url: link,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(link);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500 text-white";
      case "Pending":
        return "bg-yellow-500 text-black";
      case "Cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-t-transparent border-[#7343B3] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* Error Message */}
      {error && (
        <div
          className="mb-6 p-4 rounded-lg text-yellow-400 border border-yellow-400/20"
          style={{ backgroundColor: "#301B19" }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1">
              <p className="font-semibold mb-1">⚠️ Rate Limit Exceeded</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={fetchAffiliateData}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-80 transition-opacity whitespace-nowrap"
              style={{ backgroundColor: "#7343B3" }}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-6 mb-4 sm:mb-6 lg:mb-8 w-full">
        {summaryStats.map((stat, index) => (
          <div
            key={index}
            className="rounded-lg p-2.5 sm:p-3 lg:p-6 w-full min-w-0"
            style={{ backgroundColor: "#0A0A0A" }}
          >
            <h3 className="text-xs sm:text-sm text-gray-400 mb-2 break-words leading-tight">
              {stat.title}
            </h3>
            <p
              className={`text-lg sm:text-xl lg:text-2xl font-bold text-white break-words`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        {performanceMetrics.map((metric, index) => (
          <div
            key={index}
            className="rounded-lg bg-[#0A0A0A] p-3 sm:p-4 lg:p-6"
          >
            <div className="flex items-center">
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm text-gray-400 mb-2">
                  {metric.title}
                </h3>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {metric.value}
                </p>
                <p className={`text-xs sm:text-sm ${metric.changeColor}`}>
                  {metric.change}
                </p>
              </div>
              <div className="flex-1 min-w-0 ml-3">
                <svg
                  width="100%"
                  height="40"
                  viewBox="0 0 100 40"
                  className="overflow-visible"
                >
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    points="0,35 20,25 40,30 60,15 80,20 100,10"
                    className={metric.changeColor}
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
        {/* Referral Link */}
        <div
          className="rounded-lg p-3 sm:p-4 lg:p-6 w-full min-w-0"
          style={{ backgroundColor: "#060606" }}
        >
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 lg:mb-4">
            Your Referral Link
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 rounded-lg px-3 sm:px-4 py-2 sm:py-3 overflow-x-auto min-w-0">
              <span className="text-purple-400 font-mono text-xs sm:text-sm break-all break-words leading-relaxed block">
                {(() => {
                  const code =
                    dashboardData?.metrics?.referralCode &&
                    dashboardData.metrics.referralCode !== "N/A"
                      ? dashboardData.metrics.referralCode
                      : referralCode;
                  return code ? (
                    <>
                      https://themutantschool-frontend.vercel.app/auth/register?ref=
                      {code}
                    </>
                  ) : (
                    "Loading referral code..."
                  );
                })()}
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
                    <span className="text-xs sm:text-sm text-[#38FF63]">
                      Copied!
                    </span>
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
      </div>

      {/* Recent Referrals Table */}
      <div className="overflow-x-auto mt-4 sm:mt-6 lg:mt-8 -mx-3 sm:-mx-4 lg:mx-0 px-3 sm:px-4 lg:px-0">
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 lg:mb-4">
          Recent Referrals
        </h2>
        <div className="min-w-full inline-block align-middle">
          <table className="w-full min-w-[400px] sm:min-w-[600px]">
            <thead>
              <tr className="bg-[#0C0C0C]">
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-[#9B9B9B]">
                  Name
                </th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-[#9B9B9B] hidden sm:table-cell">
                  Joined Date
                </th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-[#9B9B9B]">
                  Commission
                </th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-[#9B9B9B]">
                  Paid Out
                </th>
              </tr>
            </thead>
            <tbody className="mb-2">
              {recentReferrals.length > 0 ? (
                recentReferrals.map((referral, index) => (
                  <tr key={index} className="bg-[#0C0C0C] rounded-[10px] ">
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-white">
                      {referral.name}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-[#9B9B9B] hidden sm:table-cell">
                      {new Date(referral.joined).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-white font-medium">
                      ${Number(referral.commissionEarned ?? 0).toFixed(2)}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                          referral.paidOut
                            ? "bg-[#193024] text-[#38FF63]"
                            : "bg-[#2B2B2B] text-[#757575]"
                        }`}
                      >
                        {referral.paidOut ? "Yes" : "No"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-8 px-4 text-center text-gray-400 text-sm"
                  >
                    No referrals found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="overflow-x-auto mt-4 sm:mt-6 lg:mt-8 -mx-3 sm:-mx-4 lg:mx-0 px-3 sm:px-4 lg:px-0">
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 lg:mb-4">
          Payout History
        </h2>
        {payoutHistory.length > 0 ? (
          <div className="min-w-full inline-block align-middle">
            <table className="w-full min-w-[400px] sm:min-w-[640px]">
              <thead>
                <tr className="bg-[#0C0C0C]">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-[#9B9B9B]">
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
                </tr>
              </thead>
              <tbody className="mb-2">
                {payoutHistory.map((payout, index) => (
                  <tr key={index} className="bg-[#0C0C0C] rounded-[10px] ">
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-[#9B9B9B] break-all max-w-[120px] sm:max-w-none">
                      {payout.id ||
                        payout.transactionId ||
                        payout._id ||
                        `TXN${index + 1}`}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-[#9B9B9B] hidden sm:table-cell">
                      {payout.date || payout.createdAt || payout.timestamp
                        ? new Date(
                            payout.date || payout.createdAt || payout.timestamp
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-white font-medium">
                      ${Number(payout.amount ?? 0).toFixed(2)}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColors(
                          payout.status
                        )}`}
                      >
                        {payout.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            className="rounded-lg p-4 sm:p-6 text-center text-gray-400 text-sm"
            style={{ backgroundColor: "#0C0C0C" }}
          >
            No payout history available
          </div>
        )}
      </div>

      {/* Withdrawals Section */}
      {withdrawals.length > 0 && (
        <div className="overflow-x-auto mt-4 sm:mt-6 lg:mt-8 -mx-3 sm:-mx-4 lg:mx-0 px-3 sm:px-4 lg:px-0">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 lg:mb-4">
            Withdrawals
          </h2>
          <div className="min-w-full inline-block align-middle">
            <table className="w-full min-w-[400px] sm:min-w-[640px]">
              <thead>
                <tr className="bg-[#0C0C0C]">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-[#9B9B9B]">
                    Withdrawal ID
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
                </tr>
              </thead>
              <tbody className="mb-2">
                {withdrawals.map((withdrawal, index) => (
                  <tr key={index} className="bg-[#0C0C0C] rounded-[10px] ">
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-[#9B9B9B] break-all max-w-[120px] sm:max-w-none">
                      {withdrawal.id ||
                        withdrawal.withdrawalId ||
                        withdrawal._id ||
                        `WD${index + 1}`}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-[#9B9B9B] hidden sm:table-cell">
                      {withdrawal.date ||
                      withdrawal.createdAt ||
                      withdrawal.timestamp
                        ? new Date(
                            withdrawal.date ||
                              withdrawal.createdAt ||
                              withdrawal.timestamp
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-white font-medium">
                      ${Number(withdrawal.amount ?? 0).toFixed(2)}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColors(
                          withdrawal.status
                        )}`}
                      >
                        {withdrawal.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
