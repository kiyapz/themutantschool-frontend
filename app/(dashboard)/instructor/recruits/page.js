"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import profilebase from "../profile/_components/profilebase";

export default function MyRecruits() {
  const router = useRouter();
  const [recruits, setRecruits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMission, setFilterMission] = useState("all");
  const [missions, setMissions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Enhanced token refresh function
  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("login-refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await profilebase.post(
        "auth/refresh-token",
        { refreshToken },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "login-accessToken"
            )}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.setItem("login-accessToken", response.data.accessToken);
        return response.data.accessToken;
      }
      throw new Error("Failed to refresh token");
    } catch (error) {
      console.error("Token refresh failed:", error);
      localStorage.removeItem("USER");
      localStorage.removeItem("login-accessToken");
      localStorage.removeItem("login-refreshToken");
      router.push("/auth/login");
      throw error;
    }
  }, [router]);

  // Generic authenticated request function
  const makeAuthenticatedRequest = useCallback(
    async (url, options = {}) => {
      try {
        let accessToken = localStorage.getItem("login-accessToken");

        const response = await profilebase.get(url, {
          ...options,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            ...options.headers,
          },
        });

        return response;
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            const newToken = await refreshAccessToken();
            const retryResponse = await profilebase.get(url, {
              ...options,
              headers: {
                Authorization: `Bearer ${newToken}`,
                ...options.headers,
              },
            });
            return retryResponse;
          } catch (refreshError) {
            throw refreshError;
          }
        }
        throw error;
      }
    },
    [refreshAccessToken]
  );

  // Fetch recruits data
  const fetchRecruits = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const storedUser = localStorage.getItem("USER");
      if (!storedUser) {
        router.push("/auth/login");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const instructorId = parsedUser._id;

      // Fetch instructor report which contains student progress and missions
      const response = await makeAuthenticatedRequest(
        `instructor/report/${instructorId}`
      );

      console.log("Fetched recruits data:", response.data);

      if (response.data.missions) {
        setMissions(response.data.missions);
      }

      // Extract mission stats which contains student counts per mission
      if (response.data.studentProgress?.missionStats) {
        setRecruits(response.data.studentProgress.missionStats);
      } else {
        setRecruits([]);
      }
    } catch (error) {
      console.error("Error fetching recruits:", error);
      setError("Failed to load recruits data");

      if (error.response?.status === 401 || error.response?.status === 403) {
        router.push("/auth/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [makeAuthenticatedRequest, router]);

  useEffect(() => {
    fetchRecruits();
  }, [fetchRecruits]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter recruits based on search and mission filter
  const filteredRecruits = recruits.filter((recruit) => {
    const matchesSearch = recruit.missionTitle
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesMission =
      filterMission === "all" || recruit.missionId === filterMission;

    return matchesSearch && matchesMission;
  });

  // Calculate total students across all missions
  const totalStudents = recruits.reduce(
    (sum, recruit) => sum + (recruit.totalStudents || 0),
    0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#604196] mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6 w-full p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[var(--background)] font-[600] text-[24px] sm:text-[32px] md:text-[42px] leading-[30px] sm:leading-[40px]">
            My Recruits
          </h1>
          <p className="text-[var(--text)] text-[13px] sm:text-[14px] md:text-[15px] mt-2">
            View and manage all students enrolled in your missions
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#0F0F0F] px-4 py-2 rounded-[10px]">
          <span className="text-[var(--background)] font-[600] text-[20px] sm:text-[24px]">
            {totalStudents}
          </span>
          <span className="text-[var(--text)] text-[13px] sm:text-[14px]">
            Total Students
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 bg-[#0F0F0F] p-3 sm:p-4 rounded-[15px]">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by mission name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1A1A1A] text-[var(--background)] px-3 sm:px-4 py-2 sm:py-3 text-[13px] sm:text-[14px] rounded-[10px] border border-[#3C3C3C] focus:outline-none focus:border-[#604196] transition-colors h-[40px] sm:h-auto"
          />
        </div>

        {/* Mission Filter - Custom Dropdown */}
        <div className="w-full sm:w-[250px] relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-[#1A1A1A] text-[var(--background)] px-3 sm:px-4 py-2 sm:py-3 text-[13px] sm:text-[14px] rounded-[10px] border border-[#3C3C3C] hover:border-[#604196] focus:outline-none focus:border-[#604196] transition-colors cursor-pointer h-[40px] sm:h-auto flex items-center justify-between"
          >
            <span className="truncate">
              {filterMission === "all"
                ? "All Missions"
                : missions.find((m) => m._id === filterMission)?.title ||
                  "Select Mission"}
            </span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ml-2 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute z-50 w-full mt-2 bg-[#1A1A1A] border border-[#3C3C3C] rounded-[10px] shadow-xl max-h-[250px] overflow-y-auto scrollbar-hide">
              <button
                onClick={() => {
                  setFilterMission("all");
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-[13px] sm:text-[14px] hover:bg-[#2A2A2A] transition-colors ${
                  filterMission === "all"
                    ? "bg-[#604196] text-white"
                    : "text-[var(--background)]"
                }`}
              >
                All Missions
              </button>
              {missions.map((mission) => (
                <button
                  key={mission._id}
                  onClick={() => {
                    setFilterMission(mission._id);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-[13px] sm:text-[14px] hover:bg-[#2A2A2A] transition-colors border-t border-[#3C3C3C] ${
                    filterMission === mission._id
                      ? "bg-[#604196] text-white"
                      : "text-[var(--background)]"
                  }`}
                >
                  {mission.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-[10px]">
          {error}
        </div>
      )}

      {/* Recruits List */}
      {filteredRecruits.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[300px] sm:h-[400px] bg-[#0F0F0F] rounded-[20px] px-4">
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="text-[var(--background)] font-[600] text-[16px] sm:text-[20px] mb-2">
              No Recruits Yet
            </p>
            <p className="text-[var(--text)] text-[13px] sm:text-[14px] px-4">
              {searchTerm || filterMission !== "all"
                ? "No recruits match your search criteria"
                : "Students who enroll in your missions will appear here"}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#0F0F0F] rounded-[20px] overflow-hidden">
          {/* Table Header - Hidden on mobile */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-[#1A1A1A] border-b border-[#3C3C3C]">
            <div className="col-span-5 text-[#7C7C7C] font-[600] text-[13px]">
              Mission
            </div>
            <div className="col-span-2 text-[#7C7C7C] font-[600] text-[13px]">
              Total Students
            </div>
            <div className="col-span-2 text-[#7C7C7C] font-[600] text-[13px]">
              Engagement
            </div>
            <div className="col-span-3 text-[#7C7C7C] font-[600] text-[13px] text-right">
              Avg Score
            </div>
          </div>

          {/* List/Table Body */}
          <div className="max-h-[600px] overflow-y-auto scrollbar-hide">
            {filteredRecruits.map((recruit, index) => {
              const mission = missions.find((m) => m._id === recruit.missionId);
              const thumbnailUrl = mission?.thumbnail?.url || null;

              return (
                <div
                  key={recruit.missionId || index}
                  className="md:grid md:grid-cols-12 gap-4 px-4 sm:px-6 py-4 border-b border-[#3C3C3C] hover:bg-[#1A1A1A] transition-colors"
                >
                  {/* Mobile Card Layout */}
                  <div className="md:hidden flex flex-col gap-3">
                    {/* Mission Info */}
                    <div className="flex items-center gap-3">
                      {thumbnailUrl ? (
                        <div
                          style={{
                            backgroundImage: `url(${thumbnailUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                          className="h-[60px] w-[60px] rounded-[10px] flex-shrink-0"
                        ></div>
                      ) : (
                        <div className="h-[60px] w-[60px] rounded-[10px] bg-gradient-to-br from-purple-400 to-pink-500 flex-shrink-0"></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-[600] text-[15px] text-[var(--background)] truncate">
                          {recruit.missionTitle || "Unknown Mission"}
                        </p>
                        <p className="text-[12px] text-[#ABABAB] mt-1">
                          {recruit.totalStudents || 0} student
                          {recruit.totalStudents !== 1 ? "s" : ""} enrolled
                        </p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-[#1A1A1A] p-3 rounded-[8px]">
                        <p className="text-[10px] text-[#7C7C7C] mb-1">
                          Students
                        </p>
                        <p className="text-[16px] font-[600] text-[var(--background)]">
                          {recruit.totalStudents || 0}
                        </p>
                      </div>
                      <div className="bg-[#1A1A1A] p-3 rounded-[8px]">
                        <p className="text-[10px] text-[#7C7C7C] mb-1">
                          Engagement
                        </p>
                        <p className="text-[16px] font-[600] text-[#66CB9F]">
                          {recruit.engagementRate || "0.0"}%
                        </p>
                      </div>
                      <div className="bg-[#1A1A1A] p-3 rounded-[8px]">
                        <p className="text-[10px] text-[#7C7C7C] mb-1">
                          Avg Score
                        </p>
                        <p className="text-[16px] font-[600] text-[var(--background)]">
                          {recruit.avgScore || "0.0"}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Table Layout */}
                  <>
                    {/* Mission Info */}
                    <div className="hidden md:flex md:col-span-5 items-center gap-3">
                      {thumbnailUrl ? (
                        <div
                          style={{
                            backgroundImage: `url(${thumbnailUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                          className="h-[48px] w-[48px] rounded-[10px] flex-shrink-0"
                        ></div>
                      ) : (
                        <div className="h-[48px] w-[48px] rounded-[10px] bg-gradient-to-br from-purple-400 to-pink-500 flex-shrink-0"></div>
                      )}
                      <div className="min-w-0">
                        <p className="font-[600] text-[14px] text-[var(--background)] truncate">
                          {recruit.missionTitle || "Unknown Mission"}
                        </p>
                        <p className="text-[12px] text-[#ABABAB]">
                          {recruit.totalStudents || 0} student
                          {recruit.totalStudents !== 1 ? "s" : ""} enrolled
                        </p>
                      </div>
                    </div>

                    {/* Total Students */}
                    <div className="hidden md:flex md:col-span-2 items-center">
                      <span className="text-[16px] font-[600] text-[var(--background)]">
                        {recruit.totalStudents || 0}
                      </span>
                    </div>

                    {/* Engagement Rate */}
                    <div className="hidden md:flex md:col-span-2 items-center">
                      <span className="text-[14px] font-[600] text-[#66CB9F]">
                        {recruit.engagementRate || "0.0"}%
                      </span>
                    </div>

                    {/* Average Score */}
                    <div className="hidden md:flex md:col-span-3 items-center justify-end">
                      <span className="text-[14px] font-[600] text-[var(--background)]">
                        {recruit.avgScore || "0.0"}%
                      </span>
                    </div>
                  </>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
