"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState("weekly");

  const leaderboardData = [
    { rank: 1, name: "@Anolmutant", earnings: "$500" },
    { rank: 2, name: "@dinoQueen", earnings: "$495" },
    { rank: 3, name: "@Mustapha", earnings: "$300" },
    { rank: 4, name: "@Mutantloard", earnings: "$200" },
    { rank: 5, name: "@Thegrudge", earnings: "$100" },
  ];

  return (
    <div className="flex flex-col bg-black gap-5">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          LEADERBOARD AND MILESTONES
        </h1>
      </div>

   

      {/* Top Ranking Affiliates Section */}
      <div
        className="rounded-lg p-6 mb-8"
        style={{ backgroundColor: "#0C0C0C" }}
      >
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            Top Ranking Affiliates
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Sort By:</span>
            <button
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: "#2A2A2A" }}
            >
              <span>Weekly Performance</span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 mb-4 pb-2 border-b border-gray-700">
          <div className="col-span-2 text-sm font-medium text-gray-400">
            Rank
          </div>
          <div className="col-span-8 text-sm font-medium text-gray-400">
            Affiliate Name
          </div>
          <div className="col-span-2 text-sm font-medium text-gray-400 text-right">
            Earnings (This Week)
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-3">
          {leaderboardData.map((affiliate) => (
            <div
              key={affiliate.rank}
              className="grid grid-cols-12 gap-4 items-center p-4 rounded-lg"
              style={{ backgroundColor: "#0C0C0C" }}
            >
              <div className="col-span-2 text-lg font-semibold text-gray-400">
                {affiliate.rank}.
              </div>
              <div className="col-span-8 flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {affiliate.name.charAt(1).toUpperCase()}
                  </span>
                </div>
                <div className="text-white font-medium">{affiliate.name}</div>
              </div>
              <div className="col-span-2 text-white font-semibold text-right">
                {affiliate.earnings}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
