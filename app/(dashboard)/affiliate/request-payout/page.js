"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import api from "@/lib/api";

export default function RequestPayoutPage() {
  const router = useRouter();
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [accountDetails, setAccountDetails] = useState("******* *** 1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [revenueBalance, setRevenueBalance] = useState(0);
  const [revenueLoading, setRevenueLoading] = useState(true);

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

    if (amount < 30) {
      setError("Minimum withdrawal amount is $30.");
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

  // Fetch revenue balance on mount
  useEffect(() => {
    const fetchRevenueBalance = async () => {
      try {
        setRevenueLoading(true);
        
        // Try multiple possible endpoints for affiliate earnings
        const possibleEndpoints = [
          "/affiliate/dashboard",
          "/affiliate/earnings",
          "/affiliate/balance",
          "/affiliate/revenue",
        ];
        
        let balance = 0;
        let found = false;
        
        for (const endpoint of possibleEndpoints) {
          try {
            const response = await api.get(endpoint);
            const data = response.data?.data || response.data;
            
            // Check for various possible field names
            if (data?.totalEarnings !== undefined) {
              balance = parseFloat(data.totalEarnings) || 0;
              found = true;
              break;
            } else if (data?.balance !== undefined) {
              balance = parseFloat(data.balance) || 0;
              found = true;
              break;
            } else if (data?.revenue !== undefined) {
              balance = parseFloat(data.revenue) || 0;
              found = true;
              break;
            } else if (data?.availableBalance !== undefined) {
              balance = parseFloat(data.availableBalance) || 0;
              found = true;
              break;
            } else if (typeof data === "number") {
              balance = parseFloat(data) || 0;
              found = true;
              break;
            }
          } catch (error) {
            // Continue to next endpoint
            continue;
          }
        }
        
        if (!found) {
          balance = 0;
        }
        
        setRevenueBalance(balance);
      } catch (error) {
        console.error("Error fetching revenue balance:", error);
        setRevenueBalance(0);
      } finally {
        setRevenueLoading(false);
      }
    };

    fetchRevenueBalance();
  }, []);

  // Calculate summary values
  const requestedAmount = parseFloat(withdrawalAmount) || 0;
  const transactionFee = 0; // Can be updated if fees are implemented
  const receivingAmount = requestedAmount - transactionFee;

  return (
    <div>
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/affiliate/payments"
          className="flex items-center space-x-2 text-white hover:text-gray-300"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="text-lg font-semibold">REQUEST PAYOUT</span>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Payout Details Form */}
        <div className="flex-1">
          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: "#0C0C0C" }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              Payout Details
            </h2>

            {/* Error Message */}
            {error && (
              <div
                className="mb-6 p-4 rounded-lg text-red-400 text-sm flex items-start gap-2"
                style={{ backgroundColor: "#301B19" }}
              >
                <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div
                className="mb-6 p-4 rounded-lg text-green-400 text-sm flex items-start gap-2"
                style={{ backgroundColor: "#1A2E1A" }}
              >
                <CheckCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Withdrawal Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Withdrawal Amount
                </label>
                <input
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => {
                    setWithdrawalAmount(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your withdrawal Amount (Min. of $30)"
                  className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 transition-all duration-200"
                  style={{
                    backgroundColor: "#000000",
                    border: "1px solid #1A1A1A",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                  onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                  min="30"
                  step="0.01"
                  disabled={loading}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum withdrawal amount is $30
                  {!revenueLoading && revenueBalance > 0 && (
                    <span className="ml-2">
                      • Available: ${revenueBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  )}
                </p>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                  style={{
                    backgroundColor: "#000000",
                    border: "1px solid #1A1A1A",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                  onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                  disabled={loading}
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="stripe">Stripe</option>
                </select>
              </div>

              {/* Account/Wallet Details */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account/Wallet Details
                </label>
                <input
                  type="text"
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  placeholder="Enter your account details"
                  className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 transition-all duration-200"
                  style={{
                    backgroundColor: "#000000",
                    border: "1px solid #1A1A1A",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                  onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Payment details from your KYC verification will be used
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="w-full lg:w-80">
          <div className="space-y-6">
            {/* Revenue Balance Card */}
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: "#0C0C0C" }}
            >
              <h3 className="text-sm text-gray-400 mb-2">
                Your Revenue Balance
              </h3>
              {revenueLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-2xl font-bold text-white">Loading...</p>
                </div>
              ) : (
                <p className="text-2xl font-bold text-white">
                  ${revenueBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )}
            </div>

            {/* Next Payout Date Card */}
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: "#0C0C0C" }}
            >
              <h3 className="text-sm text-gray-400 mb-2">Next Payout Date</h3>
              <p className="text-lg font-semibold text-white">29 Sept. 2025</p>
            </div>

            {/* Summary */}
            <div
              className="rounded-lg p-6"
              style={{ backgroundColor: "#0C0C0C" }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "#F94BFF" }}
              >
                Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Requested Amount:</span>
                  <span className="text-white font-medium">
                    ${requestedAmount > 0 ? requestedAmount.toFixed(2) : "0.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">
                    Estimated Processing Time:
                  </span>
                  <span className="text-white font-medium">
                    3-5 Business Days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Transaction Fee:</span>
                  <span className="text-white font-medium">
                    ${transactionFee.toFixed(2)}
                  </span>
                </div>
                <div
                  className="flex justify-between items-center pt-3"
                  style={{ borderTop: "1px solid #77448C" }}
                >
                  <span className="text-white font-semibold">
                    Receiving Amount:
                  </span>
                  <span className="text-white font-bold text-lg">
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
                  parseFloat(withdrawalAmount) < 30 ||
                  (revenueBalance > 0 && parseFloat(withdrawalAmount) > revenueBalance)
                }
                className="w-full mt-6 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  backgroundColor: loading ? "#5a2d8a" : "#F5F5F5",
                  color: "#711C94",
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
