"use client";

import { useState } from "react";
import Link from "next/link";
import { WalletIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";

export default function PaymentsPage() {
  const [sortBy, setSortBy] = useState("oldest");

  const payoutHistory = [
    {
      id: 1,
      transactionId: "ID2045",
      dateTime: "15-JUN-2025/18:20",
      amount: "$200.22",
      status: "Pending",
    },
    {
      id: 2,
      transactionId: "ID2045",
      dateTime: "15-JUN-2025/18:20",
      amount: "$500",
      status: "Pending",
    },
    {
      id: 3,
      transactionId: "ID2045",
      dateTime: "15-JUN-2025/18:20",
      amount: "$50",
      status: "Pending",
    },
    {
      id: 4,
      transactionId: "ID2045",
      dateTime: "15-JUN-2025/18:20",
      amount: "$211.00",
      status: "Pending",
    },
    {
      id: 5,
      transactionId: "ID2045",
      dateTime: "15-JUN-2025/18:20",
      amount: "$20",
      status: "Approved",
    },
    {
      id: 6,
      transactionId: "ID2045",
      dateTime: "15-JUN-2025/18:20",
      amount: "$20",
      status: "Approved",
    },
    {
      id: 7,
      transactionId: "ID2045",
      dateTime: "15-JUN-2025/18:20",
      amount: "$20",
      status: "Rejected",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-[#193024] text-[#38FF63";
      case "Pending":
        return "bg-[#2B2B2B] text-[#757575]";
      case "Rejected":
        return "bg-[#301B19] text-[#FF6338]";
      default:
        return "bg-gray-400 text-gray-800";
    }
  };

  return (
    <div>
      {/* Revenue Balance Card */}
      <div className="rounded-lg p-6 mb-8 flex items-center justify-between bg-gradient-to-r from-[#77448C] to-[#F94BFF]">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <WalletIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-sm text-white opacity-90 mb-1">
              Your Revenue Balance
            </h2>
            <p className="text-3xl font-bold text-white">$55,000</p>
          </div>
        </div>
        <Link
          href="/affiliate/request-payout"
          className="px-6 py-3 bg-[#F5F5F5] bg-opacity-20 rounded-[20px] text-[#711C94] font-[700] hover:bg-opacity-30 transition-colors inline-block"
        >
          Request Payout
        </Link>
      </div>

      {/* Payouts History Section */}
      <div className="rounded-lg p-6">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-xl font-[700] text-[#A333CF]  border-b border-[#A333CF] pb-3 inline-block">
            Payouts history
          </h2>
          <div className="border-b border-gray-400 w-full "></div>
        </div>

        {/* History Table Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-white">History</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort By:</span>
            <button
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: "#2A2A2A" }}
            >
              <span>Oldest to Newest</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0C0C0C]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9B9B9B]">
                  #
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9B9B9B]">
                  Transaction ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9B9B9B]">
                  Date/Time
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9B9B9B]">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9B9B9B]">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9B9B9B]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="mb-2">
              {payoutHistory.map((payout) => (
                <tr key={payout.id} className="bg-[#0C0C0C] rounded-[10px] ">
                  <td className="py-4 px-4 text-sm text-white">{payout.id}.</td>
                  <td className="py-4 px-4 text-sm text-[#9B9B9B]">
                    {payout.transactionId}
                  </td>
                  <td className="py-4 px-4 text-sm text-[#9B9B9B]">
                    {payout.dateTime}
                  </td>
                  <td className="py-4 px-4 text-sm text-white font-medium">
                    {payout.amount}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        payout.status
                      )}`}
                    >
                      {payout.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 ">
                    <button className="bg-[#6B6B6B] text-[#A5A5A5] rounded-[10px] hover:text-white">
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
