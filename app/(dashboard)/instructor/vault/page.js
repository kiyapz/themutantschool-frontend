"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import profilebase from "../profile/_components/profilebase";
import CustomDropdown from "./_components/CustomDropdown";

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
  }, [fetchDashboardData]);

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
        <div className="flex h-fit justify-between w-full items-start">
          <div>
            <p className="text-[var(--background)] font-[600] leading-[40px] text-[42px]">
              The Vault
            </p>
            <p className="text-[var(--text)] text-[12px] xl:text-[15px] leading-[40px]">
              Manage your earnings and withdrawals
            </p>
          </div>
        </div>

        {/* Earnings Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          <div className="bg-[var(--accent)] rounded-[10px] p-6 shadow-lg">
            <p className="text-[var(--text-light)] text-[14px] font-[600] mb-2">
              Total Earnings
            </p>
            <p className="text-[var(--background)] text-[32px] font-[700]">
              {formatCurrency(earnings.total || 0)}
            </p>
          </div>

          <div className="bg-[var(--accent)] rounded-[10px] p-6 shadow-lg">
            <p className="text-[var(--text-light)] text-[14px] font-[600] mb-2">
              Available Now
            </p>
            <p className="text-[var(--background)] text-[32px] font-[700]">
              {formatCurrency(earnings.available || 0)}
            </p>
          </div>

          <div className="bg-[var(--accent)] rounded-[10px] p-6 shadow-lg">
            <p className="text-[var(--text-light)] text-[14px] font-[600] mb-2">
              Pending Hold
            </p>
            <p className="text-[var(--background)] text-[32px] font-[700]">
              {formatCurrency(earnings.pending || 0)}
            </p>
          </div>

          <div className="bg-[var(--accent)] rounded-[10px] p-6 shadow-lg">
            <p className="text-[var(--text-light)] text-[14px] font-[600] mb-2">
              This Month
            </p>
            <p className="text-[var(--background)] text-[32px] font-[700]">
              {formatCurrency(earnings.currentMonth || 0)}
            </p>
          </div>
        </div>

        {/* Payout Information */}
        <div className="mt-6 bg-[var(--accent)] rounded-[10px] p-6">
          <h3 className="text-[var(--background)] text-[20px] font-[700] mb-4">
            Payout Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>
    </div>
  );
}
