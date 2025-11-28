"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function LeaderboardPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/user-profile");
      console.log("Full API Response:", response);
      console.log("Response Data:", response.data);
      
      // Handle different response structures
      let usersData = [];
      if (response.data?.success && Array.isArray(response.data?.data)) {
        usersData = response.data.data;
      } else if (Array.isArray(response.data?.data)) {
        usersData = response.data.data;
      } else if (Array.isArray(response.data)) {
        usersData = response.data;
      }

      console.log("Users Data Extracted:", usersData);
      console.log("Number of users:", usersData.length);

      // Filter for affiliates and sort by earnings
      const affiliates = usersData
        .filter((user) => user.role === "affiliate")
        .map((user) => ({
          id: user._id,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          username: user.username || "",
          email: user.email || "",
          affiliateEarnings: user.affiliateEarnings || 0,
          referralCode: user.referralCode || "",
          avatar: user.profile?.avatar?.url || "",
        }))
        .sort((a, b) => b.affiliateEarnings - a.affiliateEarnings)
        .slice(0, 10); // Limit to top 10

      console.log("Filtered Affiliates (Top 10):", affiliates);
      setUsers(affiliates);
    } catch (error) {
      console.error("Error fetching users:", error);
      console.error("Error details:", error.response?.data || error.message);
      setError("Failed to load leaderboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Format leaderboard data with ranks
  const leaderboardData = users.map((user, index) => ({
    rank: index + 1,
    name: user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.username || user.email || "Unknown",
    username: user.username,
    earnings: `$${user.affiliateEarnings || 0}`,
    avatar: user.avatar,
    referralCode: user.referralCode,
  }));

  const getUserInitials = (user) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    const name = user.firstName || user.username || user.email || "U";
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex flex-col bg-black gap-5">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            LEADERBOARD AND MILESTONES
          </h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-t-transparent border-[#7343B3] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col bg-black gap-5">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            LEADERBOARD AND MILESTONES
          </h1>
        </div>
        <div
          className="rounded-lg p-6 mb-8 text-red-400"
          style={{ backgroundColor: "#0C0C0C" }}
        >
          {error}
        </div>
      </div>
    );
  }

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
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">
            Top Ranking Affiliates
          </h2>
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
            Total Earnings
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-3">
          {leaderboardData.length > 0 ? (
            leaderboardData.map((affiliate) => {
              const user = users.find((u) => u.referralCode === affiliate.referralCode) || {};
              return (
                <div
                  key={affiliate.rank}
                  className="grid grid-cols-12 gap-4 items-center p-4 rounded-lg"
                  style={{ backgroundColor: "#0C0C0C" }}
                >
                  <div className="col-span-2 text-lg font-semibold text-gray-400">
                    {affiliate.rank}.
                  </div>
                  <div className="col-span-8 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                      {affiliate.avatar ? (
                        <img
                          src={affiliate.avatar}
                          alt={affiliate.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <span
                        className="text-xs font-medium text-white"
                        style={{ display: affiliate.avatar ? "none" : "flex" }}
                      >
                        {getUserInitials(user)}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{affiliate.name}</div>
                      {affiliate.username && (
                        <div className="text-xs text-gray-400">@{affiliate.username}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2 text-white font-semibold text-right">
                    {affiliate.earnings}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-400">
              No affiliates found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
