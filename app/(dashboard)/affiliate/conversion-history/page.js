"use client";

import { useState } from "react";
import {
  ShareIcon,
  DocumentDuplicateIcon,
  EllipsisVerticalIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

export default function ConversionHistoryPage() {
  const [sortBy, setSortBy] = useState("newest");

  const conversionHistory = [
    {
      id: 1,
      date: "C0045",
      user: "@AbdulrahmanAssan",
      mission: "Master Python",
      status: "Pending",
      commission: "$300.22",
    },
    {
      id: 2,
      date: "C0045",
      user: "@ShabuMohammad",
      mission: "Javascript Mast...",
      status: "Pending",
      commission: "$100",
    },
    {
      id: 3,
      date: "C0045",
      user: "@SharonFletcher",
      mission: "Mobile App Design",
      status: "Pending",
      commission: "$50",
    },
    {
      id: 4,
      date: "C0045",
      user: "@Ekanem_Ekanem",
      mission: "JavaScript Mast...",
      status: "Refunded",
      commission: "$25.00",
    },
    {
      id: 5,
      date: "C0045",
      user: "@KwameDutsin@gm...",
      mission: "Master Python",
      status: "Confirmed",
      commission: "$20",
    },
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

  const copyReferralLink = () => {
    navigator.clipboard.writeText("themutantschool.com/abdulrahmanassanyh...");
    // Add toast notification here
  };

  const shareReferralLink = () => {
    // Add share functionality here
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500 text-white";
      case "Pending":
        return "bg-gray-400 text-white";
      case "Refunded":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <div>
      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="rounded-lg p-6" style={{ backgroundColor: "#0A0A0A" }}>
          <h3 className="text-sm text-gray-400 mb-2">Total Earnings</h3>
          <p className="text-2xl font-bold text-white">$5,005</p>
        </div>
        <div className="rounded-lg p-6" style={{ backgroundColor: "#0A0A0A" }}>
          <h3 className="text-sm text-gray-400 mb-2">Pending Payout</h3>
          <p className="text-2xl font-bold text-white">$1,500</p>
        </div>
        <div className="rounded-lg p-6" style={{ backgroundColor: "#0A0A0A" }}>
          <h3 className="text-sm text-gray-400 mb-2">Total Clicks</h3>
          <p className="text-2xl font-bold text-white">21</p>
        </div>
        <div className="rounded-lg p-6" style={{ backgroundColor: "#0A0A0A" }}>
          <h3 className="text-sm text-gray-400 mb-2">Purchased Courses</h3>
          <p className="text-2xl font-bold text-white">15</p>
        </div>
      </div>

      {/* Referral Link Section */}
      <div
        className="rounded-lg p-6 mb-8"
        style={{ backgroundColor: "#060606" }}
      >
        <h2 className="text-xl font-semibold mb-4">Referral Link</h2>
        <div className="flex items-center space-x-4">
          <div className="flex-1  rounded-lg px-4 py-3">
            <span className="text-purple-400 font-mono text-sm">
              themutantschool.com/abdulrahmanassanyh...
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

      {/* Conversion History Table */}
      <div className="rounded-lg p-6" style={{ backgroundColor: "#000000" }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Conversion History</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Sort By:</span>
            <button
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: "#2A2A2A" }}
            >
              <span>Newest To Oldest</span>
              <ChevronDownIcon className="h-4 w-4" />
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
    </div>
  );
}
