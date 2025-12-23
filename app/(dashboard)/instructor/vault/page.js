"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import profilebase from "../profile/_components/profilebase";
import CustomDropdown from "./_components/CustomDropdown";
import WithdrawalModal from "./_components/WithdrawalModal";
import KYCModal from "./_components/KYCModal";


export default function TheVault() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedMonthFilter, setSelectedMonthFilter] = useState("all");
  const [selectedYearFilter, setSelectedYearFilter] = useState("all");
  const [monthlyTransactionPage, setMonthlyTransactionPage] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoadingWithdrawals, setIsLoadingWithdrawals] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);
  const [isLoadingKYC, setIsLoadingKYC] = useState(false);
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);


  // Enhanced token refresh function
  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("login-refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await profilebase.post(
        "auth/refresh-token",
        { refreshToken },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "login-accessToken"
            )}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.setItem("login-accessToken", response.data.accessToken);
        return response.data.accessToken;
      }
      throw new Error("Failed to refresh token");
    } catch (error) {
      console.error("Token refresh failed:", error);
      localStorage.removeItem("USER");
      localStorage.removeItem("login-accessToken");
      localStorage.removeItem("login-refreshToken");
      router.push("/auth/login");
      throw error;
    }
  }, [router]);

  // Generic authenticated request function
  const makeAuthenticatedRequest = useCallback(
    async (url, options = {}) => {
      try {
        let accessToken = localStorage.getItem("login-accessToken");

        const response = await profilebase.get(url, {
          ...options,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            ...options.headers,
          },
        });

        return response;
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            const newToken = await refreshAccessToken();
            const retryResponse = await profilebase.get(url, {
              ...options,
              headers: {
                Authorization: `Bearer ${newToken}`,
                ...options.headers,
              },
            });
            return retryResponse;
          } catch (refreshError) {
            throw refreshError;
          }
        }
        throw error;
      }
    },
    [refreshAccessToken]
  );

  // Fetch KYC status
  const fetchKYCStatus = useCallback(async () => {
    try {
      setIsLoadingKYC(true);
      
      // Get userId from localStorage
      const storedUser = localStorage.getItem("USER");
      if (!storedUser) {
        setKycStatus({ status: "not_submitted" });
        return;
      }

      let userId = "";
      try {
        const user = JSON.parse(storedUser);
        userId = user._id || user.id || "";
      } catch (error) {
        console.error("Error parsing user data:", error);
        setKycStatus({ status: "not_submitted" });
        return;
      }

      if (!userId) {
        setKycStatus({ status: "not_submitted" });
        return;
      }

      const response = await makeAuthenticatedRequest(`kyc/${userId}`);
      const raw = response?.data;
      
      // Handle response format: { success: true, data: { ... } }
      const kycData = raw?.data || raw;
      
      // Handle different response formats
      if (kycData && typeof kycData === 'object') {
        // If status exists directly
        if (kycData.status) {
          setKycStatus(kycData);
        } 
        // If it's nested
        else if (kycData.kyc && kycData.kyc.status) {
          setKycStatus(kycData.kyc);
        }
        // If status is a property
        else {
          setKycStatus(kycData);
        }
      } else {
        setKycStatus({ status: "not_submitted" });
      }
    } catch (error) {
      // If endpoint doesn't exist or returns 404, assume no KYC submitted (this is expected)
      if (error.response?.status === 404) {
        setKycStatus({ status: "not_submitted" });
        // Don't log 404 errors as they're expected when no KYC exists
      } else {
        // Only log non-404 errors
        console.error("Error fetching KYC status:", error);
        setKycStatus({ status: "not_submitted" });
      }
    } finally {
      setIsLoadingKYC(false);
    }
  }, [makeAuthenticatedRequest]);

  // Fetch withdrawal requests
  const fetchWithdrawals = useCallback(async () => {
    try {
      setIsLoadingWithdrawals(true);
      const response = await makeAuthenticatedRequest("withdrawal/my");
      const raw = response?.data;
      const withdrawalData = raw?.data || raw?.withdrawals || raw || [];
      setWithdrawals(Array.isArray(withdrawalData) ? withdrawalData : []);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      setWithdrawals([]);
    } finally {
      setIsLoadingWithdrawals(false);
    }
  }, [makeAuthenticatedRequest]);

  // Fetch instructor dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const storedUser = localStorage.getItem("USER");
      if (!storedUser) {
        router.push("/auth/login");
        return;
      }

      console.log("Fetching dashboard with page:", page, "limit:", limit);

      const response = await makeAuthenticatedRequest("instructor/dashboard", {
        params: { page, limit },
      });

      console.log("API Response:", response);

      // Normalize possible shapes:
      // 1) { success, data: { overview, transactions } }
      // 2) { success, data: { success, message, data: { ... } } }
      // 3) { overview, transactions }
      const raw = response?.data;
      const normalized = raw?.data?.data
        ? raw.data.data
        : raw?.data
        ? raw.data
        : raw;

      console.log("Fetched dashboard data (normalized):", normalized);
      console.log("Transactions:", normalized?.transactions);
      console.log("Total transactions:", normalized?.transactions?.total);
      console.log("Current page:", normalized?.transactions?.page);
      console.log("Records count:", normalized?.transactions?.records?.length);

      if (normalized && (normalized.overview || normalized.transactions)) {
        setDashboardData(normalized);
      } else {
        // Fallback to avoid silent zeroes
        setDashboardData(null);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load earnings data");

      if (error.response?.status === 401 || error.response?.status === 403) {
        router.push("/auth/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [makeAuthenticatedRequest, router, page, limit]);

  useEffect(() => {
    fetchDashboardData();
    fetchWithdrawals();
    fetchKYCStatus();
  }, [fetchDashboardData, fetchWithdrawals, fetchKYCStatus]);

  // Auto-dismiss success notifications after 5 seconds
  useEffect(() => {
    if (notification.type === "success" && notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-4 w-full">
        <div className="w-12 h-12 border-4 border-[var(--mutant-color)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-4 w-full">
        <p className="text-[var(--error-text-color)] text-center">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-6 py-2 bg-[var(--mutant-color)] text-white rounded-lg hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  const earnings = dashboardData?.overview?.earnings || {};
  const payoutInfo = dashboardData?.overview?.payoutInfo || {};
  const transactions = dashboardData?.transactions?.records || [];
  const monthlyBalances = earnings?.monthlyBalances || {};
  const monthlyTransactions =
    dashboardData?.transactions?.monthlyTransactions || {};
  const refundPolicy = dashboardData?.overview?.refundPolicyNotice || {};

  return (
    <div className="flex flex-col h-full gap-10 w-full">
      <div className="h-fit w-full">
        <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start w-full gap-4 lg:gap-6">
          <div>
            <p className="text-[var(--background)] font-[600] leading-tight text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px]">
              The Vault
            </p>
            <p className="text-[var(--text)] text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[15px] leading-tight mt-1">
              Manage your earnings and withdrawals
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 w-full sm:w-auto xl:w-auto">
            <button
              onClick={() => setIsKYCModalOpen(true)}
              className="px-4 py-2.5 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-6 lg:py-3 bg-[var(--accent)] border border-[var(--mutant-color)] text-[var(--mutant-color)] rounded-lg hover:bg-[var(--mutant-color)] hover:text-white transition-all text-sm sm:text-base lg:text-base font-semibold w-full sm:w-auto"
            >
              {kycStatus && kycStatus.status 
                ? (kycStatus.status === "approved" ? "Update KYC" : kycStatus.status === "not_submitted" || !kycStatus.status ? "Submit KYC" : "Update KYC")
                : "Submit KYC"}
            </button>
            <button
              onClick={() => {
                const withdrawalSection = document.getElementById('withdrawal-requests');
                if (withdrawalSection) {
                  withdrawalSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="px-4 py-2.5 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-6 lg:py-3 bg-[var(--accent)] border border-[var(--mutant-color)] text-[var(--mutant-color)] rounded-lg hover:bg-[var(--mutant-color)] hover:text-white transition-all text-sm sm:text-base lg:text-base font-semibold w-full sm:w-auto"
            >
              View My Withdrawals
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-6 lg:py-3 bg-[var(--mutant-color)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base lg:text-base font-semibold w-full sm:w-auto"
            >
              Request Withdrawal
            </button>
          </div>
        </div>

        {/* Notification */}
        {notification.message && (
          <div className={`mt-4 sm:mt-5 md:mt-6 lg:mt-6 p-3 sm:p-4 md:p-4 lg:p-5 rounded-lg text-center text-sm sm:text-base md:text-base lg:text-base ${
            notification.type === "success" ? "bg-green-500/20 text-green-200" : "bg-red-500/20 text-red-200"
          }`}>
            {notification.message}
          </div>
        )}

        {/* KYC Status Banner */}
        {kycStatus && kycStatus.status !== "approved" && !(notification.type === "success" && notification.message?.includes("KYC")) && (
          <div className={`mt-4 sm:mt-5 md:mt-6 lg:mt-6 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg ${
            kycStatus.status === "pending" 
              ? "bg-yellow-500/20 border border-yellow-500/50" 
              : kycStatus.status === "rejected"
              ? "bg-red-500/20 border border-red-500/50"
              : "bg-orange-500/20 border border-orange-500/50"
          }`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 lg:gap-6">
              <div className="flex-1">
                <h3 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 ${
                  kycStatus.status === "pending" 
                    ? "text-yellow-200" 
                    : kycStatus.status === "rejected"
                    ? "text-red-200"
                    : "text-orange-200"
                }`}>
                  {kycStatus.status === "pending" 
                    ? "KYC Verification Pending" 
                    : kycStatus.status === "rejected"
                    ? "KYC Verification Rejected"
                    : "KYC Verification Required"}
                </h3>
                <p className={`text-xs sm:text-sm md:text-base lg:text-base leading-relaxed ${
                  kycStatus.status === "pending" 
                    ? "text-yellow-200" 
                    : kycStatus.status === "rejected"
                    ? "text-red-200"
                    : "text-orange-200"
                }`}>
                  {kycStatus.status === "pending" 
                    ? "Your KYC information is under review. You'll be notified once it's approved."
                    : kycStatus.status === "rejected"
                    ? kycStatus.rejectionReason || "Your KYC submission was rejected. Please resubmit with correct information."
                    : "Please complete KYC verification to enable withdrawals and access all payment features."}
                </p>
              </div>
              {kycStatus.status !== "pending" && (
                <button
                  onClick={() => setIsKYCModalOpen(true)}
                  className="px-5 py-2.5 sm:px-6 sm:py-2.5 md:px-6 md:py-2 lg:px-8 lg:py-3 rounded bg-[var(--mutant-color)] text-white text-sm sm:text-base lg:text-base font-semibold hover:opacity-90 transition-opacity w-full md:w-auto whitespace-nowrap"
                >
                  {kycStatus.status === "rejected" 
                    ? "Resubmit KYC" 
                    : kycStatus.status === "not_submitted" || !kycStatus.status
                    ? "Submit KYC"
                    : "Update KYC"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Earnings Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-5 mt-4 sm:mt-5 md:mt-6">
          <div className="bg-[var(--accent)] rounded-[10px] p-4 sm:p-5 md:p-6 lg:p-6 shadow-lg">
            <p className="text-[var(--text-light)] text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-[600] mb-1 sm:mb-2">
              Total Earnings
            </p>
            <p className="text-[var(--background)] text-[18px] sm:text-[22px] md:text-[26px] lg:text-[30px] xl:text-[32px] font-[700] break-words">
              {formatCurrency(earnings.total || 0)}
            </p>
          </div>

          <div className="bg-[var(--accent)] rounded-[10px] p-4 sm:p-5 md:p-6 lg:p-6 shadow-lg">
            <p className="text-[var(--text-light)] text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-[600] mb-1 sm:mb-2">
              Available Now
            </p>
            <p className="text-[var(--background)] text-[18px] sm:text-[22px] md:text-[26px] lg:text-[30px] xl:text-[32px] font-[700] break-words">
              {formatCurrency(earnings.available || 0)}
            </p>
          </div>

          <div className="bg-[var(--accent)] rounded-[10px] p-4 sm:p-5 md:p-6 lg:p-6 shadow-lg">
            <p className="text-[var(--text-light)] text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-[600] mb-1 sm:mb-2">
              Pending Hold
            </p>
            <p className="text-[var(--background)] text-[18px] sm:text-[22px] md:text-[26px] lg:text-[30px] xl:text-[32px] font-[700] break-words">
              {formatCurrency(earnings.pending || 0)}
            </p>
          </div>

          <div className="bg-[var(--accent)] rounded-[10px] p-4 sm:p-5 md:p-6 lg:p-6 shadow-lg">
            <p className="text-[var(--text-light)] text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-[600] mb-1 sm:mb-2">
              This Month
            </p>
            <p className="text-[var(--background)] text-[18px] sm:text-[22px] md:text-[26px] lg:text-[30px] xl:text-[32px] font-[700] break-words">
              {formatCurrency(earnings.currentMonth || 0)}
            </p>
          </div>
        </div>

        {/* KYC Status Section */}
        {kycStatus && (
          <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-6 bg-[var(--accent)] rounded-[10px] p-4 sm:p-5 md:p-6 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 lg:gap-6 mb-4 lg:mb-5">
              <h3 className="text-[var(--background)] text-[18px] sm:text-[19px] md:text-[20px] lg:text-[22px] font-[700]">
                KYC Status
              </h3>
              <button
                onClick={() => setIsKYCModalOpen(true)}
                className="px-5 py-2.5 sm:px-5 sm:py-2.5 md:px-6 md:py-2.5 lg:px-8 lg:py-3 rounded bg-[var(--mutant-color)] text-white text-sm sm:text-base lg:text-base font-semibold hover:opacity-90 transition-opacity w-full sm:w-auto whitespace-nowrap"
              >
                {kycStatus.status === "approved" ? "Update KYC" : kycStatus.status === "not_submitted" || !kycStatus.status ? "Submit KYC" : "Update KYC"}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              <div>
                <p className="text-[var(--text-light)] text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] mb-1">
                  Status
                </p>
                <p className={`text-[var(--background)] font-[600] text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] capitalize ${
                  kycStatus.status === "approved" ? "text-green-400" :
                  kycStatus.status === "pending" ? "text-yellow-400" :
                  kycStatus.status === "rejected" ? "text-red-400" :
                  "text-orange-400"
                }`}>
                  {kycStatus.status || "Not Submitted"}
                </p>
              </div>
              {kycStatus.documentType && (
                <div>
                  <p className="text-[var(--text-light)] text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] mb-1">
                    Document Type
                  </p>
                  <p className="text-[var(--background)] font-[600] text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] break-words">
                    {kycStatus.documentType.replace(/_/g, " ")}
                  </p>
                </div>
              )}
              {kycStatus.bankName && (
                <div>
                  <p className="text-[var(--text-light)] text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] mb-1">
                    Bank Name
                  </p>
                  <p className="text-[var(--background)] font-[600] text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] break-words">
                    {kycStatus.bankName}
                  </p>
                </div>
              )}
              {kycStatus.accountNumber && (
                <div>
                  <p className="text-[var(--text-light)] text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] mb-1">
                    Account Number
                  </p>
                  <p className="text-[var(--background)] font-[600] text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] break-words">
                    {kycStatus.accountNumber.replace(/(.{4})/g, "$1 ").trim()}
                  </p>
                </div>
              )}
            </div>
            {kycStatus.status === "rejected" && kycStatus.rejectionReason && (
              <div className="mt-3 sm:mt-4 lg:mt-5 bg-red-500/20 border border-red-500/50 rounded-[8px] p-3 sm:p-4 lg:p-5">
                <p className="text-red-200 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] leading-relaxed">
                  <strong>Rejection Reason:</strong> {kycStatus.rejectionReason}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Payout Information */}
        <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-6 bg-[var(--accent)] rounded-[10px] p-4 sm:p-5 md:p-6 lg:p-6">
          <h3 className="text-[var(--background)] text-[18px] sm:text-[19px] md:text-[20px] lg:text-[22px] font-[700] mb-3 sm:mb-4 lg:mb-5">
            Payout Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            <div>
              <p className="text-[var(--text-light)] text-[12px] mb-1">
                Balance
              </p>
              <p className="text-[var(--background)] font-[600] text-[20px]">
                {formatCurrency(payoutInfo.balance || 0)}
              </p>
            </div>
            <div>
              <p className="text-[var(--text-light)] text-[12px] mb-1">
                Minimum Withdrawal
              </p>
              <p className="text-[var(--background)] font-[600] text-[16px]">
                {formatCurrency(payoutInfo.minimumWithdrawal || 0)}
              </p>
            </div>
            <div>
              <p className="text-[var(--text-light)] text-[12px] mb-1">
                Next Payout Date
              </p>
              <p className="text-[var(--background)] font-[600] text-[16px]">
                {formatDate(payoutInfo.nextPayoutDate)}
              </p>
            </div>
          </div>

          {payoutInfo.paymentMethodNote && (
            <div className="mt-4 bg-blue-500/20 border border-blue-500/50 rounded-[8px] p-4">
              <p className="text-blue-200 text-[13px]">
                💡 {payoutInfo.paymentMethodNote}
              </p>
            </div>
          )}

          {refundPolicy.rules && refundPolicy.rules.length > 0 && (
            <div className="mt-4 bg-orange-500/20 border border-orange-500/50 rounded-[8px] p-4">
              <p className="text-orange-200 text-[13px] font-[700] mb-2">
                Refund Policy ({refundPolicy.refundWindowDays} days hold,{" "}
                {refundPolicy.progressThreshold}% completion threshold)
              </p>
              <ul className="text-orange-200 text-[12px] space-y-1 list-disc list-inside">
                {refundPolicy.rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Monthly Earnings Chart */}
        {Object.keys(monthlyBalances).length > 0 && (
          <div className="mt-6 bg-[var(--accent)] rounded-[10px] p-6">
            <h3 className="text-[var(--background)] text-[20px] font-[700] mb-4">
              Monthly Earnings Trend
            </h3>
            <div className="flex flex-col gap-3">
              {Object.entries(monthlyBalances)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([month, amount]) => (
                  <div
                    key={month}
                    className="flex items-center justify-between"
                  >
                    <span className="text-[var(--text)] text-[14px] font-[600]">
                      {new Date(month + "-01").toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </span>
                    <span className="text-[var(--background)] text-[16px] font-[700]">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div className="mt-6 bg-[var(--accent)] rounded-[10px] p-6">
          <h3 className="text-[var(--background)] text-[20px] font-[700] mb-4">
            Recent Transactions
          </h3>
          {transactions.length === 0 ? (
            <p className="text-[var(--text-light)] text-center py-8">
              No transactions yet
            </p>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="bg-[var(--sidebar-linkcolor)]/10 rounded-[10px] p-4 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[var(--text-light)] text-[12px] font-[600]">
                        Status
                      </span>
                      <span className="text-[var(--background)] text-[14px] capitalize">
                        {transaction.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-[var(--text-light)] text-[12px] font-[600]">
                        Amount
                      </span>
                      <span className="text-[var(--background)] text-[14px] font-[600]">
                        {formatCurrency(transaction.amount)}{" "}
                        {transaction.currency || "USD"}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-[var(--text-light)] text-[12px] font-[600]">
                        Breakdown
                      </span>
                      <div className="text-[var(--text)] text-[12px] text-right">
                        {transaction.breakdown ? (
                          <div className="flex flex-col gap-1">
                            <span>
                              Instructor:{" "}
                              {Math.round(
                                transaction.breakdown.instructorRate * 100
                              )}
                              %
                            </span>
                            {transaction.breakdown.affiliateRate > 0 && (
                              <span>
                                Affiliate:{" "}
                                {Math.round(
                                  transaction.breakdown.affiliateRate * 100
                                )}
                                %
                              </span>
                            )}
                            <span>
                              Platform:{" "}
                              {Math.round(
                                transaction.breakdown.platformRate * 100
                              )}
                              %
                            </span>
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-[var(--text-light)] text-[12px] font-[600]">
                        Release Date
                      </span>
                      <span className="text-[var(--text)] text-[14px]">
                        {formatDate(
                          transaction.releaseDate || transaction.createdAt
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="border-b border-[var(--sidebar-linkcolor)]">
                      <th className="text-left py-3 px-4 text-[var(--text-light)] text-[12px] font-[700] w-[15%]">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-[var(--text-light)] text-[12px] font-[700] w-[20%]">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 text-[var(--text-light)] text-[12px] font-[700] w-[40%]">
                        Breakdown
                      </th>
                      <th className="text-left py-3 px-4 text-[var(--text-light)] text-[12px] font-[700] w-[25%]">
                        Release Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr
                        key={transaction._id}
                        className="border-b border-[var(--sidebar-linkcolor)]/30"
                      >
                        <td className="py-3 px-4 text-[var(--background)] text-[14px] capitalize">
                          {transaction.status}
                        </td>
                        <td className="py-3 px-4 text-[var(--background)] text-[14px] font-[600]">
                          {formatCurrency(transaction.amount)}{" "}
                          {transaction.currency || "USD"}
                        </td>
                        <td className="py-3 px-4 text-[var(--text)] text-[12px]">
                          {transaction.breakdown ? (
                            <div className="flex flex-col gap-1">
                              <span>
                                Instructor:{" "}
                                {Math.round(
                                  transaction.breakdown.instructorRate * 100
                                )}
                                %
                              </span>
                              {transaction.breakdown.affiliateRate > 0 && (
                                <span>
                                  Affiliate:{" "}
                                  {Math.round(
                                    transaction.breakdown.affiliateRate * 100
                                  )}
                                  %
                                </span>
                              )}
                              <span>
                                Platform:{" "}
                                {Math.round(
                                  transaction.breakdown.platformRate * 100
                                )}
                                %
                              </span>
                            </div>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="py-3 px-4 text-[var(--text)] text-[14px]">
                          {formatDate(
                            transaction.releaseDate || transaction.createdAt
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 rounded bg-[var(--accent)] text-[var(--background)] disabled:opacity-50 text-[14px] font-[600]"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    Prev
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-[var(--accent)] text-[var(--background)] disabled:opacity-50 text-[14px] font-[600]"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={
                      Math.ceil(
                        (dashboardData?.transactions?.total || 0) /
                          (dashboardData?.transactions?.limit || limit)
                      ) <= page
                    }
                  >
                    Next
                  </button>
                </div>
                <div className="text-[var(--text-light)] text-sm font-[600]">
                  Page {page} of{" "}
                  {Math.max(
                    1,
                    Math.ceil(
                      (dashboardData?.transactions?.total || 0) /
                        (dashboardData?.transactions?.limit || limit)
                    )
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--text-light)] text-sm font-[600]">
                    Rows:
                  </span>
                  <CustomDropdown
                    value={limit.toString()}
                    onChange={(value) => {
                      setPage(1);
                      setLimit(Number(value));
                    }}
                    options={[
                      { value: "5", label: "5" },
                      { value: "10", label: "10" },
                      { value: "20", label: "20" },
                    ]}
                    placeholder="Rows"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Monthly Transaction Breakdown */}
        {Object.keys(monthlyTransactions).length > 0 && (
          <div className="mt-6 bg-[var(--accent)] rounded-[10px] p-6">
            <div className="flex flex-col gap-4 mb-4">
              <h3 className="text-[var(--background)] text-[20px] font-[700]">
                Monthly Transaction Breakdown
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Year Filter */}
                <CustomDropdown
                  value={selectedYearFilter}
                  onChange={(value) => {
                    setSelectedYearFilter(value);
                    setSelectedMonthFilter("all");
                    setMonthlyTransactionPage({});
                  }}
                  options={[
                    { value: "all", label: "All Years" },
                    ...[2030, 2029, 2028, 2027, 2026, 2025].map((year) => ({
                      value: year.toString(),
                      label: year.toString(),
                    })),
                  ]}
                  placeholder="Select Year"
                />

                {/* Month Filter */}
                <CustomDropdown
                  value={selectedMonthFilter}
                  onChange={(value) => {
                    setSelectedMonthFilter(value);
                    setMonthlyTransactionPage({});
                  }}
                  options={[
                    { value: "all", label: "All Months" },
                    ...[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((month, index) => ({
                      value: (index + 1).toString().padStart(2, "0"),
                      label: month,
                    })),
                  ]}
                  placeholder="Select Month"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {Object.entries(monthlyTransactions)
                .sort(([a], [b]) => b.localeCompare(a))
                .filter(([month]) => {
                  // Filter by year
                  const monthYear = month.split("-")[0];
                  const matchesYear =
                    selectedYearFilter === "all" ||
                    monthYear === selectedYearFilter;
                  // Filter by month (check if month matches, e.g., "2025-11" contains "11")
                  const monthOnly = month.split("-")[1];
                  const matchesMonth =
                    selectedMonthFilter === "all" ||
                    monthOnly === selectedMonthFilter;
                  return matchesYear && matchesMonth;
                })
                .map(([month, trans]) => {
                  const currentPage = monthlyTransactionPage[month] || 1;
                  const itemsPerPage = 10;
                  const startIndex = (currentPage - 1) * itemsPerPage;
                  const endIndex = startIndex + itemsPerPage;
                  const paginatedTrans = trans.slice(startIndex, endIndex);
                  const totalPages = Math.ceil(trans.length / itemsPerPage);

                  return (
                    <div
                      key={month}
                      className="bg-[var(--background)]/10 rounded-[8px] p-4"
                    >
                      <h4 className="text-[var(--background)] font-[700] text-[16px] mb-3">
                        {new Date(month + "-01").toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                        <span className="text-[var(--text-light)] text-[12px] ml-2 font-normal">
                          ({trans.length} total)
                        </span>
                      </h4>
                      <div className="flex flex-col gap-2">
                        {paginatedTrans.map((t) => (
                          <div
                            key={t._id}
                            className="flex items-center justify-between text-[14px]"
                          >
                            <span className="text-[var(--text)]">
                              {formatDate(t.createdAt)}
                            </span>
                            <span className="text-[var(--background)] font-[600]">
                              {formatCurrency(t.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--background)]/20">
                          <button
                            className="px-3 py-1 rounded bg-[var(--background)] text-[var(--accent)] text-[12px] disabled:opacity-50"
                            onClick={() =>
                              setMonthlyTransactionPage((prev) => ({
                                ...prev,
                                [month]: Math.max(1, currentPage - 1),
                              }))
                            }
                            disabled={currentPage <= 1}
                          >
                            Prev
                          </button>
                          <span className="text-[var(--text-light)] text-[12px]">
                            Page {currentPage} of {totalPages}
                          </span>
                          <button
                            className="px-3 py-1 rounded bg-[var(--background)] text-[var(--accent)] text-[12px] disabled:opacity-50"
                            onClick={() =>
                              setMonthlyTransactionPage((prev) => ({
                                ...prev,
                                [month]: Math.min(totalPages, currentPage + 1),
                              }))
                            }
                            disabled={currentPage >= totalPages}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Withdrawal Requests */}
        <div id="withdrawal-requests" className="mt-6 bg-[var(--accent)] rounded-[10px] p-6">
          <h3 className="text-[var(--background)] text-[20px] font-[700] mb-4">
            Withdrawal Requests
          </h3>
          {isLoadingWithdrawals ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-[var(--mutant-color)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : withdrawals.length === 0 ? (
            <p className="text-[var(--text-light)] text-center py-8">
              No withdrawal requests yet
            </p>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {withdrawals.map((withdrawal) => (
                  <div
                    key={withdrawal._id || withdrawal.id}
                    className="bg-[var(--sidebar-linkcolor)]/10 rounded-[10px] p-4 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[var(--text-light)] text-[12px] font-[600]">
                        Amount
                      </span>
                      <span className="text-[var(--background)] text-[14px] font-[600]">
                        {formatCurrency(withdrawal.amount || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-[var(--text-light)] text-[12px] font-[600]">
                        Status
                      </span>
                      <span className={`text-[14px] capitalize font-[600] ${
                        withdrawal.status === 'approved' ? 'text-green-400' :
                        withdrawal.status === 'pending' ? 'text-yellow-400' :
                        withdrawal.status === 'rejected' ? 'text-red-400' :
                        'text-[var(--background)]'
                      }`}>
                        {withdrawal.status || 'pending'}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-[var(--text-light)] text-[12px] font-[600]">
                        Request Date
                      </span>
                      <span className="text-[var(--text)] text-[14px]">
                        {formatDate(withdrawal.createdAt || withdrawal.requestDate)}
                      </span>
                    </div>
                    {withdrawal.processedAt && (
                      <div className="flex justify-between items-start">
                        <span className="text-[var(--text-light)] text-[12px] font-[600]">
                          Processed Date
                        </span>
                        <span className="text-[var(--text)] text-[14px]">
                          {formatDate(withdrawal.processedAt)}
                        </span>
                      </div>
                    )}
                    {withdrawal.notes && (
                      <div className="flex flex-col gap-1">
                        <span className="text-[var(--text-light)] text-[12px] font-[600]">
                          Notes
                        </span>
                        <span className="text-[var(--text)] text-[12px]">
                          {withdrawal.notes}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="border-b border-[var(--sidebar-linkcolor)]">
                      <th className="text-left py-3 px-4 text-[var(--text-light)] text-[12px] font-[700] w-[20%]">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 text-[var(--text-light)] text-[12px] font-[700] w-[15%]">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-[var(--text-light)] text-[12px] font-[700] w-[20%]">
                        Request Date
                      </th>
                      <th className="text-left py-3 px-4 text-[var(--text-light)] text-[12px] font-[700] w-[20%]">
                        Processed Date
                      </th>
                      <th className="text-left py-3 px-4 text-[var(--text-light)] text-[12px] font-[700] w-[25%]">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((withdrawal) => (
                      <tr
                        key={withdrawal._id || withdrawal.id}
                        className="border-b border-[var(--sidebar-linkcolor)]/30"
                      >
                        <td className="py-3 px-4 text-[var(--background)] text-[14px] font-[600]">
                          {formatCurrency(withdrawal.amount || 0)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[14px] capitalize font-[600] ${
                            withdrawal.status === 'approved' ? 'text-green-400' :
                            withdrawal.status === 'pending' ? 'text-yellow-400' :
                            withdrawal.status === 'rejected' ? 'text-red-400' :
                            'text-[var(--background)]'
                          }`}>
                            {withdrawal.status || 'pending'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[var(--text)] text-[14px]">
                          {formatDate(withdrawal.createdAt || withdrawal.requestDate)}
                        </td>
                        <td className="py-3 px-4 text-[var(--text)] text-[14px]">
                          {withdrawal.processedAt ? formatDate(withdrawal.processedAt) : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-[var(--text)] text-[12px]">
                          {withdrawal.notes || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      <WithdrawalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(message) => {
          setNotification({ message, type: "success" });
          fetchDashboardData();
          fetchWithdrawals();
        }}
        availableBalance={earnings.available || 0}
      />

      <KYCModal
        isOpen={isKYCModalOpen}
        onClose={() => setIsKYCModalOpen(false)}
        onSuccess={(message) => {
          // Optimistically update status to pending FIRST
          setKycStatus({ status: "pending" });
          // Then show success notification
          setNotification({ message, type: "success" });
          // Add a small delay to ensure backend has processed the submission, then refresh
          setTimeout(() => {
            fetchKYCStatus();
          }, 1500);
        }}
        existingKYC={kycStatus && kycStatus.status ? kycStatus : null}
      />
    </div>
  );
}
