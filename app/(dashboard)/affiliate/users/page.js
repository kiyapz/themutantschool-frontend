"use client";

import { useState, useEffect } from "react";
import { 
  UserIcon, 
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import api from "@/lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  // Fetch all referrals (users who registered using affiliate's referral code)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/affiliate/referrals");
      
      if (response.data?.success) {
        const referralsData = response.data.data || [];
        setUsers(referralsData);
      } else {
        setError(response.data?.message || "Failed to fetch referrals.");
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching referrals:", error);
      if (error.response?.status === 429) {
        const message = error.response?.data?.message || "Too many requests. Please wait a few minutes and try again.";
        setError(message);
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        setError("Authentication required. Please login.");
      } else {
        const message = error.response?.data?.message || "Failed to fetch referrals. Please try again.";
        setError(message);
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Show referral details (no need to fetch, data is already available)
  const showReferralDetails = (referral) => {
    setSelectedUser(referral);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter referrals based on search query
  const filteredUsers = users.filter((referral) => {
    const query = searchQuery.toLowerCase();
    const userName = referral.user?.toLowerCase() || "";
    const email = referral.email?.toLowerCase() || "";
    const missionTitle = referral.missionTitle?.toLowerCase() || "";
    
    return (
      userName.includes(query) ||
      email.includes(query) ||
      missionTitle.includes(query)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const getUserInitials = (referral) => {
    // For referral data, use the user name or email
    if (referral.user) {
      const nameParts = referral.user.trim().split(" ");
      if (nameParts.length >= 2) {
        return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
      }
      return referral.user.charAt(0).toUpperCase();
    }
    return referral.email?.charAt(0).toUpperCase() || "U";
  };

  if (selectedUser) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Referrals</span>
        </button>

        {/* User Details Card */}
        <div className="rounded-lg p-6" style={{ backgroundColor: "#0F0F0F" }}>
          <div className="flex items-start gap-6 mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
              style={{ backgroundColor: "#7343B3" }}
            >
              {getUserInitials(selectedUser)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-2">
                {selectedUser.user || selectedUser.email || "Referral User"}
              </h1>
              <p className="text-gray-400 text-sm mb-4">
                Referred User
              </p>
              {selectedUser.missionTitle && (
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: "#1A1A1A", color: "#7343B3" }}
                >
                  {selectedUser.missionTitle}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-start gap-3">
              <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-400 mb-1">Email</p>
                <p className="text-white">{selectedUser.email || "N/A"}</p>
              </div>
            </div>

            {/* Mission Title */}
            {selectedUser.missionTitle && (
              <div className="flex items-start gap-3">
                <UserIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Mission</p>
                  <p className="text-white">{selectedUser.missionTitle}</p>
                </div>
              </div>
            )}

            {/* Commission */}
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 text-gray-400 mt-1 flex items-center justify-center">
                <span className="text-lg">$</span>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Commission Earned</p>
                <p className="text-white font-semibold text-lg">
                  ${selectedUser.commission || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">REFERRALS</h1>
        <p className="text-gray-400 text-sm">
          View users who registered using your referral code
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search referrals by name, email, or mission..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg text-white placeholder-gray-500"
            style={{ backgroundColor: "#0F0F0F" }}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="mb-6 p-4 rounded-lg text-red-400"
          style={{ backgroundColor: "#301B19" }}
        >
          {error}
        </div>
      )}

      {/* Referrals List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-t-transparent border-[#7343B3] rounded-full animate-spin"></div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div
          className="text-center py-12 rounded-lg"
          style={{ backgroundColor: "#0F0F0F" }}
        >
          <UserIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">
            {searchQuery ? "No referrals found" : "No referrals yet"}
          </p>
          {searchQuery && (
            <p className="text-gray-500 text-sm">
              Try adjusting your search query
            </p>
          )}
          {!searchQuery && (
            <p className="text-gray-500 text-sm">
              Start sharing your referral link to earn commissions
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((referral, index) => (
            <div
              key={referral.email || index}
              onClick={() => showReferralDetails(referral)}
              className="rounded-lg p-6 cursor-pointer transition-all hover:scale-105"
              style={{ backgroundColor: "#0F0F0F" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1A1A1A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#0F0F0F";
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                  style={{ backgroundColor: "#7343B3" }}
                >
                  {getUserInitials(referral)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-1 truncate">
                    {referral.user || referral.email || "Referral User"}
                  </h3>
                  <p className="text-gray-400 text-sm truncate mb-2">
                    {referral.email}
                  </p>
                  {referral.missionTitle && (
                    <span
                      className="inline-block px-2 py-1 rounded text-xs font-medium mb-2"
                      style={{ backgroundColor: "#1A1A1A", color: "#7343B3" }}
                    >
                      {referral.missionTitle}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t" style={{ borderColor: "#1A1A1A" }}>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">Commission</p>
                  <p className="text-sm font-semibold text-green-400">
                    ${referral.commission || 0}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Referrals Count */}
      {!loading && users.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Showing {filteredUsers.length} of {users.length} referral{users.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}

