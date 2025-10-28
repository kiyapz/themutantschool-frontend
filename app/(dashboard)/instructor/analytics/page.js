"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import profilebase from "../profile/_components/profilebase";

export default function MissionAnalytics() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [missions, setMissions] = useState([]);
  const [selectedMission, setSelectedMission] = useState("all");
  const [error, setError] = useState(null);

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

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
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

      const response = await makeAuthenticatedRequest(
        `instructor/report/${instructorId}`
      );

      console.log("Fetched analytics data:", response.data);

      if (response.data.missions) {
        setMissions(response.data.missions);
      }

      if (response.data.studentProgress) {
        setAnalyticsData(response.data.studentProgress);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError("Failed to load analytics data");

      if (error.response?.status === 401 || error.response?.status === 403) {
        router.push("/auth/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [makeAuthenticatedRequest, router]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Filter mission stats based on selection
  // Use missions array if available, otherwise fall back to missionStats
  const missionStats =
    analyticsData?.missions || analyticsData?.missionStats || [];

  const filteredMissionStats =
    selectedMission === "all"
      ? missionStats
      : missionStats.filter((m) => m.missionId === selectedMission);

  // Calculate totals for filtered data
  const totalStudents = filteredMissionStats.reduce(
    (sum, m) => sum + (m.totalStudents || 0),
    0
  );

  // Use the global average from studentProgress if available, otherwise calculate from individual missions
  const avgEngagement =
    analyticsData?.missions?.length > 0
      ? (
          analyticsData.missions.reduce(
            (sum, m) => sum + parseFloat(m.engagementRate || 0),
            0
          ) / analyticsData.missions.length
        ).toFixed(1)
      : "0.0";

  // Use the global averageScore from studentProgress (49.38%)
  const avgScore = analyticsData?.averageScore || "0.0";

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
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[var(--background)] font-[600] text-[24px] sm:text-[32px] md:text-[42px] leading-[30px] sm:leading-[40px]">
            Mission Analytics
          </h1>
          <p className="text-[var(--text)] text-[13px] sm:text-[14px] md:text-[15px] mt-2">
            Track performance and insights across your missions
          </p>
        </div>

        {/* Mission Filter */}
        <div className="w-full sm:w-[250px]">
          <select
            value={selectedMission}
            onChange={(e) => setSelectedMission(e.target.value)}
            className="w-full bg-[#1A1A1A] text-[var(--background)] px-3 sm:px-4 py-2 sm:py-3 text-[13px] sm:text-[14px] rounded-[10px] border border-[#3C3C3C] focus:outline-none focus:border-[#604196] transition-colors cursor-pointer h-[40px] sm:h-auto"
          >
            <option value="all">All Missions</option>
            {missions.map((mission) => (
              <option key={mission._id} value={mission._id}>
                {mission.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-[10px]">
          {error}
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Students */}
        <div className="bg-[#0F0F0F] rounded-[15px] p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-[10px] flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-[#C7C7C7] text-[12px] sm:text-[14px] mb-1">
            Total Students
          </p>
          <p className="text-[var(--background)] font-[600] text-[24px] sm:text-[32px]">
            {totalStudents}
          </p>
        </div>

        {/* Total Missions */}
        <div className="bg-[#0F0F0F] rounded-[15px] p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-[10px] flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>
          <p className="text-[#C7C7C7] text-[12px] sm:text-[14px] mb-1">
            Total Missions
          </p>
          <p className="text-[var(--background)] font-[600] text-[24px] sm:text-[32px]">
            {selectedMission === "all" ? missions.length : 1}
          </p>
        </div>

        {/* Avg Engagement */}
        <div className="bg-[#0F0F0F] rounded-[15px] p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-[10px] flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
          <p className="text-[#C7C7C7] text-[12px] sm:text-[14px] mb-1">
            Avg Engagement
          </p>
          <p className="text-[var(--background)] font-[600] text-[24px] sm:text-[32px]">
            {avgEngagement}%
          </p>
        </div>

        {/* Avg Score */}
        <div className="bg-[#0F0F0F] rounded-[15px] p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-[10px] flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
          </div>
          <p className="text-[#C7C7C7] text-[12px] sm:text-[14px] mb-1">
            Avg Score
          </p>
          <p className="text-[var(--background)] font-[600] text-[24px] sm:text-[32px]">
            {avgScore}%
          </p>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Completion Rate */}
        <div className="bg-[#0F0F0F] rounded-[15px] p-4 sm:p-6">
          <p className="text-[#C7C7C7] text-[14px] sm:text-[16px] mb-4">
            Completion Rate
          </p>
          <div className="flex items-end gap-2">
            <p className="text-[var(--background)] font-[600] text-[32px] sm:text-[42px]">
              {analyticsData?.capsuleCompletionRate || "0"}%
            </p>
            <p className="text-[#66CB9F] text-[14px] mb-2 flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              Good
            </p>
          </div>
          <div className="w-full bg-[#000000] rounded-full h-2 mt-4">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${analyticsData?.capsuleCompletionRate || 0}%` }}
            />
          </div>
        </div>

        {/* Total Levels */}
        <div className="bg-[#0F0F0F] rounded-[15px] p-4 sm:p-6">
          <p className="text-[#C7C7C7] text-[14px] sm:text-[16px] mb-4">
            Total Levels
          </p>
          <p className="text-[var(--background)] font-[600] text-[32px] sm:text-[42px]">
            {analyticsData?.totalLevels || 0}
          </p>
          <p className="text-[#ABABAB] text-[12px] mt-2">Across all missions</p>
        </div>

        {/* Total Quizzes */}
        <div className="bg-[#0F0F0F] rounded-[15px] p-4 sm:p-6">
          <p className="text-[#C7C7C7] text-[14px] sm:text-[16px] mb-4">
            Total Quizzes
          </p>
          <p className="text-[var(--background)] font-[600] text-[32px] sm:text-[42px]">
            {analyticsData?.totalQuizzes || 0}
          </p>
          <p className="text-[#ABABAB] text-[12px] mt-2">
            Assessment activities
          </p>
        </div>
      </div>

      {/* Mission Performance Table */}
      <div className="bg-[#0F0F0F] rounded-[20px] overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-[#3C3C3C]">
          <h2 className="text-[var(--background)] font-[600] text-[18px] sm:text-[20px]">
            Mission Performance
          </h2>
        </div>

        {filteredMissionStats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] px-4">
            <p className="text-[var(--text)] text-center">
              No analytics data available
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1A1A1A] border-b border-[#3C3C3C]">
                  <tr>
                    <th className="text-left px-6 py-4 text-[#7C7C7C] font-[600] text-[13px]">
                      Mission
                    </th>
                    <th className="text-left px-6 py-4 text-[#7C7C7C] font-[600] text-[13px]">
                      Students
                    </th>
                    <th className="text-left px-6 py-4 text-[#7C7C7C] font-[600] text-[13px]">
                      Engagement
                    </th>
                    <th className="text-left px-6 py-4 text-[#7C7C7C] font-[600] text-[13px]">
                      Avg Score
                    </th>
                    <th className="text-left px-6 py-4 text-[#7C7C7C] font-[600] text-[13px]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMissionStats.map((mission, index) => {
                    const missionData = missions.find(
                      (m) => m._id === mission.missionId
                    );
                    const thumbnailUrl = missionData?.thumbnail?.url || null;

                    return (
                      <tr
                        key={mission.missionId || index}
                        className="border-b border-[#3C3C3C] hover:bg-[#1A1A1A] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
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
                            <div>
                              <p className="font-[600] text-[14px] text-[var(--background)]">
                                {mission.missionTitle}
                              </p>
                              <p className="text-[12px] text-[#ABABAB]">
                                {mission.totalStudents || 0} enrolled
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[16px] font-[600] text-[var(--background)]">
                          {mission.totalStudents || 0}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-[#000000] rounded-full h-2">
                              <div
                                className="h-full bg-[#66CB9F] rounded-full"
                                style={{
                                  width: `${mission.engagementRate || 0}%`,
                                }}
                              />
                            </div>
                            <span className="text-[14px] font-[600] text-[#66CB9F]">
                              {mission.engagementRate || "0.0"}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[14px] font-[600] text-[var(--background)]">
                          {mission.avgScore || "0.0"}%
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[12px] font-[500] ${
                              parseFloat(mission.engagementRate || 0) > 50
                                ? "bg-green-500/20 text-green-400"
                                : parseFloat(mission.engagementRate || 0) > 20
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {parseFloat(mission.engagementRate || 0) > 50
                              ? "Active"
                              : parseFloat(mission.engagementRate || 0) > 20
                              ? "Moderate"
                              : "Low"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div
              className="md:hidden divide-y divide-[#3C3C3C] max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-hide"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {filteredMissionStats.map((mission, index) => {
                const missionData = missions.find(
                  (m) => m._id === mission.missionId
                );
                const thumbnailUrl = missionData?.thumbnail?.url || null;

                return (
                  <div key={mission.missionId || index} className="p-4">
                    <div className="flex items-center gap-3 mb-3">
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
                          {mission.missionTitle}
                        </p>
                        <span
                          className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-[500] ${
                            parseFloat(mission.engagementRate || 0) > 50
                              ? "bg-green-500/20 text-green-400"
                              : parseFloat(mission.engagementRate || 0) > 20
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {parseFloat(mission.engagementRate || 0) > 50
                            ? "Active"
                            : parseFloat(mission.engagementRate || 0) > 20
                            ? "Moderate"
                            : "Low"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-[#1A1A1A] p-3 rounded-[8px]">
                        <p className="text-[10px] text-[#7C7C7C] mb-1">
                          Students
                        </p>
                        <p className="text-[16px] font-[600] text-[var(--background)]">
                          {mission.totalStudents || 0}
                        </p>
                      </div>
                      <div className="bg-[#1A1A1A] p-3 rounded-[8px]">
                        <p className="text-[10px] text-[#7C7C7C] mb-1">
                          Engagement
                        </p>
                        <p className="text-[16px] font-[600] text-[#66CB9F]">
                          {mission.engagementRate || "0.0"}%
                        </p>
                      </div>
                      <div className="bg-[#1A1A1A] p-3 rounded-[8px]">
                        <p className="text-[10px] text-[#7C7C7C] mb-1">
                          Avg Score
                        </p>
                        <p className="text-[16px] font-[600] text-[var(--background)]">
                          {mission.avgScore || "0.0"}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
