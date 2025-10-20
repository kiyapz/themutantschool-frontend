"use client";

import { useState } from "react";
import {
  ShareIcon,
  DocumentDuplicateIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";

export default function AffiliatePage() {
  const [sortBy, setSortBy] = useState("newest");

  const summaryStats = [
    { title: "Total Earnings", value: "$5,005", color: "text-green-400" },
    { title: "Pending Payout", value: "$1,500", color: "text-yellow-400" },
    { title: "Total Clicks", value: "21", color: "text-blue-400" },
    { title: "Purchased Courses", value: "15", color: "text-purple-400" },
  ];

  const getStatusColors = (status) => {
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

  const performanceMetrics = [
    {
      title: "Clicks Tracked",
      value: "105",
      change: "+21.01%",
      changeColor: "text-[#38FF63]",
      graphColor: "bg-[#38FF63]",
      cardColor: "bg-[#193024]",
    },
    {
      title: "Signups",
      value: "21",
      change: "+18.34%",
      changeColor: "text-[#FF6338]",
      graphColor: "bg-[#FF6338]",
      cardColor: "bg-[#301B19]",
    },
    {
      title: "Conversions",
      value: "15",
      change: "+12.45%",
      changeColor: "text-[#A333CF]",
      graphColor: "bg-[#A333CF]",
      cardColor: "bg-[#2A1A3A]",
    },
  ];

  const conversionHistory = [
    {
      id: 1,
      date: "2024-01-15",
      user: "@john_doe",
      course: "Python Mastery",
      status: "Completed",
      commission: "$50.00",
    },
    {
      id: 2,
      date: "2024-01-14",
      user: "@jane_smith",
      course: "React Fundamentals",
      status: "Pending",
      commission: "$75.00",
    },
    {
      id: 3,
      date: "2024-01-13",
      user: "@mike_wilson",
      course: "Data Science Bootcamp",
      status: "Completed",
      commission: "$100.00",
    },
  ];

  const copyReferralLink = () => {
    navigator.clipboard.writeText("themutantschool.com/abdulrahmanassan/r...");
    // Add toast notification here
  };

  const shareReferralLink = () => {
    // Add share functionality here
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

  return (
    <div>
      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryStats.map((stat, index) => (
          <div
            key={index}
            className="rounded-lg p-6"
            style={{ backgroundColor: "#0A0A0A" }}
          >
            <h3 className="text-sm text-gray-400 mb-2">{stat.title}</h3>
            <p className={`text-2xl font-bold text-white`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {performanceMetrics.map((metric, index) => (
          <div
            key={index}
            className="rounded-lg bg-[#0A0A0A] p-6"
            // style={{ backgroundColor: metric.cardColor }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm text-gray-400 mb-2">{metric.title}</h3>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <p className={`text-sm ${metric.changeColor}`}>
                  {metric.change}
                </p>
              </div>
              <div className="w-32">
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

      <div className="grid grid-cols-1  gap-8">
        {/* Referral Link */}
        <div className="rounded-lg p-6" style={{ backgroundColor: "#060606" }}>
          <h2 className="text-xl font-semibold mb-4">Your Referral Link</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1  rounded-lg px-4 py-3">
              <span className="text-[#6D35A1]  text-sm">
                themutantschool.com/abdulrahmanassan/r...
              </span>
            </div>
            <button
              onClick={shareReferralLink}
              className="px-4 py-3 rounded-lg flex items-center space-x-2 transition-colors"
              style={{ backgroundColor: "#101010" }}
            >
              <ShareIcon className="h-4 w-4" />
              <span className="text-sm">Share</span>
            </button>
            <button
              onClick={copyReferralLink}
              className="px-4 py-3 rounded-lg flex items-center space-x-2 transition-colors"
              style={{ backgroundColor: "#101010" }}
            >
              <DocumentDuplicateIcon className="h-4 w-4" />
              <span className="text-sm">Copy</span>
            </button>
          </div>
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
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColors(
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
  );
}
