"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CheckCircleIcon, ExclamationTriangleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import api from "@/lib/api";

export default function RequestPayoutPage() {
  const router = useRouter();
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [accountDetails, setAccountDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [revenueBalance, setRevenueBalance] = useState(0);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [payoutInfo, setPayoutInfo] = useState(null);
  const [kycData, setKycData] = useState(null);
  const [kycLoading, setKycLoading] = useState(true);
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false);
  const paymentMethodRef = useRef(null);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setError("");
    setSuccess("");

    // Validation
    const amount = parseFloat(withdrawalAmount);
    
    if (!withdrawalAmount || isNaN(amount) || amount <= 0) {
      setError("Please enter a valid withdrawal amount.");
      return;
    }

    const minimumWithdrawal = payoutInfo?.minimumWithdrawal ?? 100;
    if (amount < minimumWithdrawal) {
      setError(`Minimum withdrawal amount is $${minimumWithdrawal.toFixed(2)}.`);
      return;
    }

    // Check if amount exceeds available balance
    if (revenueBalance > 0 && amount > revenueBalance) {
      setError(`Withdrawal amount cannot exceed your available balance of $${revenueBalance.toFixed(2)}.`);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/withdrawal", {
        amount: amount,
      });

      if (response.status === 200 || response.status === 201) {
        setSuccess("Withdrawal request submitted successfully!");
        // Clear form
        setWithdrawalAmount("");
        // Redirect to payments page after 2 seconds
        setTimeout(() => {
          router.push("/affiliate/payments");
        }, 2000);
      } else {
        throw new Error(response.data?.message || "Failed to submit withdrawal request.");
      }
    } catch (err) {
      console.error("Withdrawal error:", err);
      
      // Handle different error scenarios
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else if (err.response?.status === 401) {
        setError("You are not authorized. Please login again.");
      } else if (err.response?.status === 400) {
        setError("Invalid request. Please check your withdrawal amount.");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to make withdrawals. Please complete KYC verification.");
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch affiliate dashboard data for balance and payout info
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setRevenueLoading(true);
        const response = await api.get("/affiliate/dashboard");
        const responsePayload = response.data.data;
        const dashboardPayload = responsePayload?.data;

        if (responsePayload?.success && dashboardPayload) {
          // Extract payout information
          if (dashboardPayload.overview?.payoutInfo) {
            setPayoutInfo(dashboardPayload.overview.payoutInfo);
            
            // Set revenue balance from payout info balance (main balance from backend)
            const balance = Number(dashboardPayload.overview.payoutInfo.balance ?? 0);
            setRevenueBalance(balance);
          } else {
            // Fallback to available earnings if payoutInfo doesn't exist
            const balance = Number(dashboardPayload.overview?.earnings?.available ?? 0);
            setRevenueBalance(balance);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setRevenueBalance(0);
      } finally {
        setRevenueLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch KYC data for account details
  useEffect(() => {
    const fetchKycData = async () => {
      try {
        setKycLoading(true);
        
        const userStr = localStorage.getItem("USER");
        if (!userStr) {
          setKycLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        const userId = user._id || user.id;

        if (!userId) {
          setKycLoading(false);
          return;
        }

        const response = await api.get(`/kyc/${userId}`);
        const kyc = response.data?.data || response.data;
        setKycData(kyc);
        
        // Set account details from KYC data
        if (kyc) {
          // Format account details based on available KYC info
          let details = "";
          if (kyc.bankName && kyc.accountNumber) {
            // Mask account number, show last 4 digits
            const maskedAccount = kyc.accountNumber.length > 4 
              ? "****" + kyc.accountNumber.slice(-4)
              : kyc.accountNumber;
            details = `${kyc.bankName} - ${maskedAccount}`;
          } else if (kyc.bankName) {
            details = kyc.bankName;
          } else if (kyc.accountNumber) {
            const maskedAccount = kyc.accountNumber.length > 4 
              ? "****" + kyc.accountNumber.slice(-4)
              : kyc.accountNumber;
            details = maskedAccount;
          }
          setAccountDetails(details);
        }
      } catch (error) {
        // If KYC doesn't exist (404), that's okay
        if (error.response?.status !== 404) {
          console.error("Error fetching KYC data:", error);
        }
      } finally {
        setKycLoading(false);
      }
    };

    fetchKycData();
  }, []);

  // Close payment method dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (paymentMethodRef.current && !paymentMethodRef.current.contains(event.target)) {
        setIsPaymentMethodOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate summary values
  const requestedAmount = parseFloat(withdrawalAmount) || 0;
  const transactionFee = 0; // Can be updated if fees are implemented
  const receivingAmount = requestedAmount - transactionFee;

  return (
    <div className="w-full max-w-full overflow-x-hidden px-2 sm:px-4 lg:px-0">
      {/* Back Button */}
      <div className="mb-4 sm:mb-6">
        <Link
          href="/affiliate/payments"
          className="flex items-center space-x-2 text-white hover:text-gray-300"
        >
          <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base lg:text-lg font-semibold">REQUEST PAYOUT</span>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Payout Details Form */}
        <div className="flex-1 min-w-0">
          <div
            className="rounded-lg p-4 sm:p-5 lg:p-6"
            style={{ backgroundColor: "#0C0C0C" }}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
              Payout Details
            </h2>

            {/* Error Message */}
            {error && (
              <div
                className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg text-red-400 text-xs sm:text-sm flex items-start gap-2"
                style={{ backgroundColor: "#301B19" }}
              >
                <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5" />
                <span className="break-words">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div
                className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg text-green-400 text-xs sm:text-sm flex items-start gap-2"
                style={{ backgroundColor: "#1A2E1A" }}
              >
                <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5" />
                <span className="break-words">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
              {/* Withdrawal Amount */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Withdrawal Amount
                </label>
                <input
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => {
                    setWithdrawalAmount(e.target.value);
                    setError("");
                  }}
                  placeholder={`Enter your withdrawal Amount (Min. of $${(payoutInfo?.minimumWithdrawal ?? 100).toFixed(2)})`}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 transition-all duration-200"
                  style={{
                    backgroundColor: "#000000",
                    border: "1px solid #1A1A1A",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                  onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                  min={payoutInfo?.minimumWithdrawal ?? 100}
                  step="0.01"
                  disabled={loading}
                  required
                />
                <p className="text-xs text-gray-500 mt-1 break-words">
                  Minimum withdrawal amount is ${(payoutInfo?.minimumWithdrawal ?? 100).toFixed(2)}
                  {!revenueLoading && revenueBalance > 0 && (
                    <span className="ml-1 sm:ml-2 block sm:inline">
                      • Available: ${revenueBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  )}
                </p>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Payment Method
                </label>
                <div className="relative" ref={paymentMethodRef}>
                  <button
                    type="button"
                    onClick={() => !loading && setIsPaymentMethodOpen(!isPaymentMethodOpen)}
                    disabled={loading}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base text-white transition-all duration-200 flex items-center justify-between"
                    style={{
                      backgroundColor: "#000000",
                      border: "1px solid #1A1A1A",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                    onFocus={(e) => !loading && (e.target.style.borderColor = "#7343B3")}
                    onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                  >
                    <span className="text-white">Bank Transfer</span>
                    <ChevronDownIcon
                      className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-transform duration-200 ${
                        isPaymentMethodOpen ? "transform rotate-180" : ""
                      } ${loading ? "opacity-50" : ""}`}
                    />
                  </button>

                  {isPaymentMethodOpen && !loading && (
                    <div
                      className="absolute z-50 w-full mt-2 rounded-lg shadow-xl"
                      style={{
                        backgroundColor: "#0F0F0F",
                        border: "1px solid #1A1A1A",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod("bank");
                          setIsPaymentMethodOpen(false);
                        }}
                        className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-200 flex items-center justify-between"
                        style={{
                          color: paymentMethod === "bank" ? "#7343B3" : "#FFFFFF",
                          backgroundColor:
                            paymentMethod === "bank" ? "#0C0C0C" : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (paymentMethod !== "bank") {
                            e.target.style.backgroundColor = "#1A1A1A";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (paymentMethod !== "bank") {
                            e.target.style.backgroundColor = "transparent";
                          }
                        }}
                      >
                        <span>Bank Transfer</span>
                        {paymentMethod === "bank" && (
                          <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#7343B3]" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Only bank transfer is available for payouts
                </p>
              </div>

              {/* Account/Wallet Details */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Account/Wallet Details
                </label>
                <input
                  type="text"
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  placeholder={kycLoading ? "Loading account details..." : (kycData ? "Account details from KYC" : "Complete KYC verification to add account details")}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 transition-all duration-200"
                  style={{
                    backgroundColor: "#000000",
                    border: "1px solid #1A1A1A",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                  onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                  disabled={loading || kycLoading}
                  readOnly={!!kycData}
                />
                <p className="text-xs text-gray-500 mt-1 break-words">
                  {kycData 
                    ? "Payment details from your KYC verification are displayed above"
                    : "Please complete KYC verification to add your payment details"}
                  {!kycData && (
                    <Link href="/affiliate/profile/payment-information" className="ml-1 text-purple-400 hover:underline block sm:inline">
                      Complete KYC
                    </Link>
                  )}
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Revenue Balance Card */}
            <div
              className="rounded-lg p-3 sm:p-4"
              style={{ backgroundColor: "#0C0C0C" }}
            >
              <h3 className="text-xs sm:text-sm text-gray-400 mb-2">
                Your Revenue Balance
              </h3>
              {revenueLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Loading...</p>
                </div>
              ) : (
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white break-words">
                  ${revenueBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )}
            </div>

            {/* Next Payout Date Card */}
            <div
              className="rounded-lg p-3 sm:p-4"
              style={{ backgroundColor: "#0C0C0C" }}
            >
              <h3 className="text-xs sm:text-sm text-gray-400 mb-2">Next Payout Date</h3>
              <p className="text-base sm:text-lg font-semibold text-white break-words">
                {payoutInfo?.nextPayoutDate
                  ? new Date(payoutInfo.nextPayoutDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>

            {/* Summary */}
            <div
              className="rounded-lg p-4 sm:p-5 lg:p-6"
              style={{ backgroundColor: "#0C0C0C" }}
            >
              <h3
                className="text-base sm:text-lg font-semibold mb-3 sm:mb-4"
                style={{ color: "#F94BFF" }}
              >
                Summary
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">Requested Amount:</span>
                  <span className="text-xs sm:text-sm text-white font-medium text-right break-words">
                    ${requestedAmount > 0 ? requestedAmount.toFixed(2) : "0.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">
                    Estimated Processing Time:
                  </span>
                  <span className="text-xs sm:text-sm text-white font-medium text-right break-words">
                    3-5 Business Days
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">Transaction Fee:</span>
                  <span className="text-xs sm:text-sm text-white font-medium text-right break-words">
                    ${transactionFee.toFixed(2)}
                  </span>
                </div>
                <div
                  className="flex justify-between items-center gap-2 pt-2 sm:pt-3"
                  style={{ borderTop: "1px solid #77448C" }}
                >
                  <span className="text-sm sm:text-base text-white font-semibold flex-shrink-0">
                    Receiving Amount:
                  </span>
                  <span className="text-base sm:text-lg text-white font-bold text-right break-words">
                    ${receivingAmount > 0 ? receivingAmount.toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={
                  loading || 
                  !withdrawalAmount || 
                  parseFloat(withdrawalAmount) < (payoutInfo?.minimumWithdrawal ?? 100) ||
                  (revenueBalance > 0 && parseFloat(withdrawalAmount) > revenueBalance)
                }
                className="w-full mt-4 sm:mt-6 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  backgroundColor: loading 
                    ? "#5a2d8a" 
                    : (!withdrawalAmount || parseFloat(withdrawalAmount) < (payoutInfo?.minimumWithdrawal ?? 100) || (revenueBalance > 0 && parseFloat(withdrawalAmount) > revenueBalance))
                    ? "#6B6B6B"
                    : "#F5F5F5",
                  color: loading || (!withdrawalAmount || parseFloat(withdrawalAmount) < (payoutInfo?.minimumWithdrawal ?? 100) || (revenueBalance > 0 && parseFloat(withdrawalAmount) > revenueBalance))
                    ? "#A5A5A5"
                    : "#711C94",
                  border: "1px solid #77448C",
                }}
                onMouseEnter={(e) => {
                  if (!loading && !e.target.disabled) {
                    e.target.style.backgroundColor = "#e0e0e0";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && !e.target.disabled) {
                    e.target.style.backgroundColor = "#F5F5F5";
                  }
                }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#711C94] border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
