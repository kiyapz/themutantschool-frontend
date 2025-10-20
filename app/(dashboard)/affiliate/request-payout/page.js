"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function RequestPayoutPage() {
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [accountDetails, setAccountDetails] = useState("******* *** 1234");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle payout request submission
    console.log("Payout request submitted:", {
      withdrawalAmount,
      paymentMethod,
      accountDetails,
    });
  };

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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Withdrawal Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Withdrawal Amount
                </label>
                <input
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  placeholder="Enter your withdrawal Amount (Min. of $30)"
                  className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500"
                  style={{
                    backgroundColor: "#000000",
                    // border: "1px solid #77448C",
                  }}
                  min="30"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-white"
                  style={{
                    backgroundColor: "#000000",
                    // border: "1px solid #77448C",
                  }}
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
                  className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500"
                  style={{
                    backgroundColor: "#000000",
                    // border: "1px solid #77448C",
                  }}
                />
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
              <p className="text-2xl font-bold text-white">$55,000</p>
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
                  <span className="text-white font-medium">$1000</span>
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
                  <span className="text-white font-medium">$0</span>
                </div>
                <div
                  className="flex justify-between items-center pt-3"
                  style={{ borderTop: "1px solid #77448C" }}
                >
                  <span className="text-white font-semibold">
                    Receiving Amount:
                  </span>
                  <span className="text-white font-bold text-lg">$1000</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full mt-6 px-6 py-3 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: "#F5F5F5",
                  color: "#711C94",
                  border: "1px solid #77448C",
                }}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
