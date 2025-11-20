"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { 
  UserIcon, 
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/user-profile");
      const usersData = response.data?.data || response.data || [];
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single user
  const fetchUser = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/user-profile/${userId}`);
      const userData = response.data?.data || response.data;
      setSelectedUser(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to fetch user details. Please try again.");
      setSelectedUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    const firstName = user.firstName?.toLowerCase() || "";
    const lastName = user.lastName?.toLowerCase() || "";
    const email = user.email?.toLowerCase() || "";
    const fullName = `${firstName} ${lastName}`.trim();
    
    return (
      fullName.includes(query) ||
      email.includes(query) ||
      user._id?.toLowerCase().includes(query)
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

  const getUserInitials = (user) => {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    if (firstName || lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return user.email?.charAt(0).toUpperCase() || "U";
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
          <span>Back to Users</span>
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
                {selectedUser.firstName && selectedUser.lastName
                  ? `${selectedUser.firstName} ${selectedUser.lastName}`
                  : selectedUser.email || "User"}
              </h1>
              <p className="text-gray-400 text-sm mb-4">
                User ID: {selectedUser._id}
              </p>
              {selectedUser.role && (
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: "#1A1A1A", color: "#7343B3" }}
                >
                  {selectedUser.role}
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

            {/* Phone */}
            {selectedUser.phone && (
              <div className="flex items-start gap-3">
                <PhoneIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Phone</p>
                  <p className="text-white">{selectedUser.phone}</p>
                </div>
              </div>
            )}

            {/* Created At */}
            <div className="flex items-start gap-3">
              <CalendarIcon className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-400 mb-1">Joined</p>
                <p className="text-white">
                  {formatDate(selectedUser.createdAt)}
                </p>
              </div>
            </div>

            {/* Updated At */}
            {selectedUser.updatedAt && (
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Last Updated</p>
                  <p className="text-white">
                    {formatDate(selectedUser.updatedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          {selectedUser.profile && (
            <div className="mt-6 pt-6 border-t" style={{ borderColor: "#1A1A1A" }}>
              <h3 className="text-lg font-semibold text-white mb-4">
                Profile Information
              </h3>
              <div className="space-y-3">
                {selectedUser.profile.bio && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Bio</p>
                    <p className="text-white">{selectedUser.profile.bio}</p>
                  </div>
                )}
                {selectedUser.profile.location && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Location</p>
                    <p className="text-white">{selectedUser.profile.location}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">USER PROFILE</h1>
        <p className="text-gray-400 text-sm">
          View and manage all users in the system
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name, email, or ID..."
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

      {/* Users List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-2 border-t-transparent border-[#7343B3] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div
          className="text-center py-12 rounded-lg"
          style={{ backgroundColor: "#0F0F0F" }}
        >
          <UserIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">
            {searchQuery ? "No users found" : "No users available"}
          </p>
          {searchQuery && (
            <p className="text-gray-500 text-sm">
              Try adjusting your search query
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => fetchUser(user._id)}
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
                  {getUserInitials(user)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-1 truncate">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.email || "User"}
                  </h3>
                  <p className="text-gray-400 text-sm truncate mb-2">
                    {user.email}
                  </p>
                  {user.role && (
                    <span
                      className="inline-block px-2 py-1 rounded text-xs font-medium"
                      style={{ backgroundColor: "#1A1A1A", color: "#7343B3" }}
                    >
                      {user.role}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t" style={{ borderColor: "#1A1A1A" }}>
                <p className="text-xs text-gray-500">
                  Joined: {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users Count */}
      {!loading && users.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      )}
    </div>
  );
}

