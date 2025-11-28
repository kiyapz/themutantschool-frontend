"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { WalletIcon, EllipsisVerticalIcon, ExclamationTriangleIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import api from "@/lib/api";

export default function PaymentsPage() {
  const [sortBy, setSortBy] = useState("oldest");
  const [kycData, setKycData] = useState(null);
  const [kycLoading, setKycLoading] = useState(true);
  const [kycError, setKycError] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(true);
  const [withdrawalsError, setWithdrawalsError] = useState(null);
  const [revenueBalance, setRevenueBalance] = useState(0);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [payoutInfo, setPayoutInfo] = useState(null);
  const [refundPolicy, setRefundPolicy] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleString("default", { month: "short" }).toUpperCase();
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${day}-${month}-${year}/${hours}:${minutes}`;
    } catch (error) {
      return dateString;
    }
  };

  // Map API status to display status
  const mapStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "Approved";
      case "pending":
        return "Pending";
      case "rejected":
      case "declined":
        return "Rejected";
      default:
        return status || "Pending";
    }
  };

  // Fetch affiliate dashboard data for payout info and refund rules
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setRevenueLoading(true);
        const response = await api.get("/affiliate/dashboard");
        const responsePayload = response.data.data;
        const dashboardPayload = responsePayload?.data;

        if (responsePayload?.success && dashboardPayload) {
          setDashboardData(dashboardPayload);
          
          // Extract payout information
          if (dashboardPayload.overview?.payoutInfo) {
            setPayoutInfo(dashboardPayload.overview.payoutInfo);
            
            // Set revenue balance from payout info balance (main balance from backend)
            const balance = Number(dashboardPayload.overview.payoutInfo.balance ?? 0);
            setRevenueBalance(balance);
            setRevenueLoading(false);
          } else {
            // Fallback to available earnings if payoutInfo doesn't exist
            const balance = Number(dashboardPayload.overview?.earnings?.available ?? 0);
            setRevenueBalance(balance);
            setRevenueLoading(false);
          }
          
          // Extract refund policy
          if (dashboardPayload.overview?.refundPolicyNotice) {
            setRefundPolicy(dashboardPayload.overview.refundPolicyNotice);
          }
        } else {
          setRevenueLoading(false);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setRevenueLoading(false);
        setRevenueBalance(0);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch KYC data on mount
  useEffect(() => {
    const fetchKycData = async () => {
      try {
        setKycLoading(true);
        setKycError(null);
        
        const userStr = localStorage.getItem("USER");
        if (!userStr) {
          setKycError("User not found");
          setKycLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        const userId = user._id || user.id;

        if (!userId) {
          setKycError("User ID not found");
          setKycLoading(false);
          return;
        }

        const response = await api.get(`/kyc/${userId}`);
        const kyc = response.data?.data || response.data;
        setKycData(kyc);
      } catch (error) {
        // If KYC doesn't exist (404), that's okay - user hasn't submitted yet
        if (error.response?.status === 404) {
          setKycData(null);
        } else {
          console.error("Error fetching KYC data:", error);
          setKycError("Failed to load KYC status");
        }
      } finally {
        setKycLoading(false);
      }
    };

    fetchKycData();
  }, []);


  // Fetch withdrawals on mount
  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        setWithdrawalsLoading(true);
        setWithdrawalsError(null);

        const response = await api.get("/withdrawal/my");
        const withdrawalsData = response.data?.data || response.data || [];
        
        // Calculate total paid withdrawals
        const totalPaid = withdrawalsData
          .filter((w) => w.status?.toLowerCase() === "paid")
          .reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0);
        
        // Calculate total pending withdrawals
        const totalPending = withdrawalsData
          .filter((w) => w.status?.toLowerCase() === "pending")
          .reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0);
        
        // If revenue balance is 0 (no earnings API), calculate available balance
        // This is a temporary calculation - should be replaced with actual earnings API
        if (revenueBalance === 0 && withdrawalsData.length > 0) {
          // For now, show total paid as reference (this should be replaced with actual earnings)
          // Available balance would be: totalEarnings - totalPaid - totalPending
          // Since we don't have totalEarnings, we'll show 0 or calculate from other sources
        }
        
        // Sort withdrawals based on sortBy state
        let sortedWithdrawals = [...withdrawalsData];
        if (sortBy === "oldest") {
          sortedWithdrawals.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateA - dateB;
          });
        } else {
          sortedWithdrawals.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA;
          });
        }
        
        setWithdrawals(sortedWithdrawals);
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
        setWithdrawalsError("Failed to load withdrawal history");
        setWithdrawals([]);
      } finally {
        setWithdrawalsLoading(false);
      }
    };

    fetchWithdrawals();
  }, [sortBy, revenueBalance]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-[#193024] text-[#38FF63]";
      case "Pending":
        return "bg-[#2B2B2B] text-[#757575]";
      case "Rejected":
        return "bg-[#301B19] text-[#FF6338]";
      default:
        return "bg-gray-400 text-gray-800";
    }
  };

  const getKycStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-[#193024] text-[#38FF63]";
      case "pending":
        return "bg-[#2B2B2B] text-[#757575]";
      case "rejected":
        return "bg-[#301B19] text-[#FF6338]";
      default:
        return "bg-[#2B2B2B] text-[#757575]";
    }
  };

  const getKycStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#38FF63]" />;
      case "pending":
        return <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#757575]" />;
      case "rejected":
        return <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#FF6338]" />;
      default:
        return <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#757575]" />;
    }
  };

  const getDocumentTypeLabel = (type) => {
    switch (type) {
      case "NATIONAL_ID":
        return "National ID";
      case "PASSPORT":
        return "Passport";
      case "DRIVER_LICENSE":
        return "Driver's License";
      default:
        return type || "N/A";
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* KYC Status Alert */}
      {!kycLoading && (
        <div className="mb-4 sm:mb-6">
          {!kycData ? (
            <div
              className="rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3"
              style={{ backgroundColor: "#2B2B2B" }}
            >
              <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#FF6338] flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium mb-1 text-sm sm:text-base">KYC Verification Required</h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 break-words">
                  You need to complete KYC verification to request payouts. Please submit your payment information.
                </p>
                <Link
                  href="/affiliate/profile/payment-information"
                  className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                  style={{ backgroundColor: "#7343B3", color: "#FFFFFF" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#9159d1")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#7343B3")}
                >
                  Complete KYC
                </Link>
              </div>
            </div>
          ) : kycData.status?.toLowerCase() === "pending" ? (
            <div
              className="rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3"
              style={{ backgroundColor: "#2B2B2B" }}
            >
              <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#757575] flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium mb-1 text-sm sm:text-base">KYC Verification Pending</h3>
                <p className="text-gray-400 text-xs sm:text-sm break-words">
                  Your KYC verification is under review. You&apos;ll be able to request payouts once approved.
                </p>
              </div>
            </div>
          ) : kycData.status?.toLowerCase() === "rejected" ? (
            <div
              className="rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3"
              style={{ backgroundColor: "#301B19" }}
            >
              <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#FF6338] flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium mb-1 text-sm sm:text-base">KYC Verification Rejected</h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 break-words">
                  Your KYC verification was rejected. Please update your payment information and resubmit.
                </p>
                <Link
                  href="/affiliate/profile/payment-information"
                  className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                  style={{ backgroundColor: "#7343B3", color: "#FFFFFF" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#9159d1")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#7343B3")}
                >
                  Update KYC
                </Link>
              </div>
            </div>
          ) : kycData.status?.toLowerCase() === "approved" ? (
            <div
              className="rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3"
              style={{ backgroundColor: "#193024" }}
            >
              <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#38FF63] flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium mb-1 text-sm sm:text-base">KYC Verified</h3>
                <p className="text-gray-400 text-xs sm:text-sm break-words">
                  Your KYC verification is approved. You can request payouts.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* KYC Information Card */}
      {!kycLoading && kycData && (
        <div className="rounded-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8 w-full min-w-0" style={{ backgroundColor: "#0F0F0F" }}>
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 lg:mb-4 text-white">KYC Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1 break-words">Status</p>
              <div className="flex items-center gap-2">
                {getKycStatusIcon(kycData.status)}
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getKycStatusColor(
                    kycData.status
                  )}`}
                >
                  {kycData.status ? kycData.status.charAt(0).toUpperCase() + kycData.status.slice(1) : "Not Submitted"}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1 break-words">Full Name</p>
              <p className="text-white text-sm sm:text-base break-words">{kycData.fullName || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1 break-words">Bank Name</p>
              <p className="text-white text-sm sm:text-base break-words">{kycData.bankName || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1 break-words">Document Type</p>
              <p className="text-white text-sm sm:text-base break-words">{getDocumentTypeLabel(kycData.documentType)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Payout Information and Refund Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
        {/* Payout Information */}
        {payoutInfo && (
          <div
            className="rounded-lg p-4 sm:p-6 w-full min-w-0"
            style={{ backgroundColor: "#060606" }}
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">
              Payout Information
            </h2>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                <span className="text-gray-400 text-sm sm:text-base">
                  Balance
                </span>
                <span className="font-medium text-sm sm:text-base break-words text-right sm:text-left text-white">
                  $
                  {Number(payoutInfo.balance ?? 0).toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                <span className="text-gray-400 text-sm sm:text-base">
                  Minimum Withdrawal
                </span>
                <span className="font-medium text-sm sm:text-base break-words text-right sm:text-left text-white">
                  $
                  {Number(payoutInfo.minimumWithdrawal ?? 0).toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
                <span className="text-gray-400 text-sm sm:text-base">
                  Next Payout Date
                </span>
                <span className="font-medium text-sm sm:text-base break-words text-right sm:text-left min-w-0 text-white">
                  {payoutInfo.nextPayoutDate
                    ? new Date(payoutInfo.nextPayoutDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
              {payoutInfo.paymentMethodNote && (
                <div className="text-xs sm:text-sm text-gray-500 pt-2 break-words leading-relaxed">
                  {payoutInfo.paymentMethodNote}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Refund & Payout Rules */}
        {refundPolicy && (
          <div
            className="rounded-lg p-3 sm:p-4 lg:p-6 w-full min-w-0"
            style={{ backgroundColor: "#060606" }}
          >
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 lg:mb-4 text-white">
              Refund & Payout Rules
            </h2>
            <div className="space-y-3 mb-4">
              {refundPolicy.progressThreshold && (
                <div className="text-sm text-gray-400">
                  <span className="font-medium text-gray-300">
                    Progress Threshold:
                  </span>{" "}
                  {refundPolicy.progressThreshold}%
                </div>
              )}
              {refundPolicy.refundWindowDays && (
                <div className="text-sm text-gray-400">
                  <span className="font-medium text-gray-300">
                    Refund Window:
                  </span>{" "}
                  {refundPolicy.refundWindowDays} days
                </div>
              )}
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400 list-disc list-outside pl-4 sm:pl-5">
              {refundPolicy.rules?.map((rule, index) => (
                <li key={index} className="break-words leading-relaxed pr-2">
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Revenue Balance Card */}
      <div className="rounded-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-gradient-to-r from-[#77448C] to-[#F94BFF]">
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
            <WalletIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xs sm:text-sm text-white opacity-90 mb-1 break-words">
              Your Revenue Balance
            </h2>
            {revenueLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white break-words">
                ${revenueBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
          </div>
        </div>
        <Link
          href="/affiliate/request-payout"
          className={`px-4 sm:px-6 py-2 sm:py-3 bg-[#F5F5F5] bg-opacity-20 rounded-[20px] text-[#711C94] font-[700] hover:bg-opacity-30 transition-colors inline-block text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
            !kycLoading && kycData && kycData?.status?.toLowerCase() !== "approved" 
              ? "opacity-50 cursor-not-allowed pointer-events-none" 
              : ""
          }`}
          onClick={(e) => {
            // Only prevent if KYC is loaded and not approved
            if (!kycLoading && kycData && kycData?.status?.toLowerCase() !== "approved") {
              e.preventDefault();
            }
          }}
        >
          Request Payout
        </Link>
      </div>

      {/* Payouts History Section */}
      <div className="rounded-lg p-3 sm:p-4 lg:p-6 w-full min-w-0 overflow-x-auto -mx-3 sm:-mx-4 lg:mx-0 px-3 sm:px-4 lg:px-0">
        {/* Section Header */}
        <div className="mb-3 sm:mb-4 lg:mb-6">
          <h2 className="text-base sm:text-lg lg:text-xl font-[700] text-[#A333CF] border-b border-[#A333CF] pb-2 sm:pb-3 inline-block">
            Payouts history
          </h2>
          <div className="border-b border-gray-400 w-full"></div>
        </div>

        {/* History Table Header */}
        <div className="flex flex-row justify-between items-center gap-2 sm:gap-4 mb-3 sm:mb-4 lg:mb-6">
          <h3 className="text-base sm:text-lg font-medium text-white flex-shrink-0 min-w-0">History</h3>
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">Sort By:</span>
            <button
              onClick={() => setSortBy(sortBy === "oldest" ? "newest" : "oldest")}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors hover:opacity-80 whitespace-nowrap"
              style={{ backgroundColor: "#2A2A2A" }}
            >
              <span className="hidden sm:inline">{sortBy === "oldest" ? "Oldest to Newest" : "Newest to Oldest"}</span>
              <span className="sm:hidden">{sortBy === "oldest" ? "Oldest" : "Newest"}</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {withdrawalsLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-t-transparent border-[#7343B3] rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error State */}
        {!withdrawalsLoading && withdrawalsError && (
          <div
            className="mb-6 p-4 rounded-lg text-red-400 text-sm flex items-start gap-2"
            style={{ backgroundColor: "#301B19" }}
          >
            <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{withdrawalsError}</span>
          </div>
        )}

        {/* Empty State */}
        {!withdrawalsLoading && !withdrawalsError && withdrawals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-2">No withdrawal requests found</p>
            <p className="text-sm text-gray-500">Your withdrawal history will appear here once you make a request.</p>
          </div>
        )}

        {/* Table */}
        {!withdrawalsLoading && withdrawals.length > 0 && (
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
                  {withdrawals.map((withdrawal, index) => {
                    const displayStatus = mapStatus(withdrawal.status);
                    const transactionId = withdrawal._id ? withdrawal._id.substring(0, 8).toUpperCase() : `ID${index + 1}`;
                    
                    return (
                      <tr key={withdrawal._id || index} className="bg-[#0C0C0C] rounded-[10px]">
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-white">{index + 1}.</td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-[#9B9B9B] break-all max-w-[120px] sm:max-w-none hidden sm:table-cell">
                          {transactionId}
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-[#9B9B9B] hidden sm:table-cell">
                          {formatDate(withdrawal.createdAt)}
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-white font-medium">
                          ${parseFloat(withdrawal.amount || 0).toFixed(2)}
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4">
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              displayStatus
                            )}`}
                          >
                            {displayStatus}
                          </span>
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4">
                          <button className="bg-[#6B6B6B] text-[#A5A5A5] rounded-[10px] hover:text-white transition-colors p-1 sm:p-1.5">
                            <EllipsisVerticalIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
