"use client";
import Image from "next/image";
import { FaArrowUp } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";

import SingleValueChart from "./_components/InstructorgraphSingleValueChart";
import Link from "next/link";
import { useContext, useEffect, useCallback } from "react";
import { InstructorContext } from "./_components/context/InstructorContex";
import profilebase from "./profile/_components/profilebase";

const Mission = [
  {
    id: 1,
    purpose: "Design Principles: Beginners",
    type: "course",
    recruits: 500,
    revenue: "$2500",
    rating: 4.5,
  },
  {
    id: 2,
    purpose: "Design Principles: Beginners",
    type: "",
    recruits: 900,
    revenue: "$2500",
    rating: 5,
  },
  {
    id: 3,
    purpose: "Design Principles: Beginners",
    type: "course",
    recruits: 800,
    revenue: "$2500",
    rating: 3.5,
  },
  {
    id: 4,
    purpose: "Design Principles: Beginners",
    type: "",
    recruits: 100,
    revenue: "$2500",
    rating: 1.5,
  },
];

export default function InstructorDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [studentProgress, setStudentProgress] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [showAllMissions, setShowAllMissions] = useState(false);
  const [showAllActive, setShowAllActive] = useState(false);

  const {
    setUserProfile,
    userProfile,
    setUserUpdatedValue,
    userUpdatedValue,
    setMission,
    courses,
  } = useContext(InstructorContext);

  // Helper function to format relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const data = [
    {
      id: 1,
      sub: "Total Students",
      qunatity: studentProgress?.totalStudents || 0,
    },
    {
      id: 2,
      sub: "Completion Rate",
      qunatity: studentProgress?.capsuleCompletionRate
        ? `${studentProgress.capsuleCompletionRate}%`
        : "0%",
    },
    {
      id: 3,
      sub: "Average Score",
      qunatity: studentProgress?.averageScore
        ? `${studentProgress.averageScore}%`
        : "N/A",
    },
    {
      id: 4,
      sub: "Total Missions",
      qunatity: studentProgress?.totalMissions || courses?.length || 0,
    },
  ];

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
      // Clear storage and redirect to login
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
        // If unauthorized, try to refresh token and retry
        if (error.response?.status === 401) {
          console.log("Access token expired, attempting to refresh...");
          try {
            const newToken = await refreshAccessToken();

            // Retry the original request with new token
            const retryResponse = await profilebase.get(url, {
              ...options,
              headers: {
                Authorization: `Bearer ${newToken}`,
                ...options.headers,
              },
            });

            return retryResponse;
          } catch (refreshError) {
            console.error(
              "Failed to refresh token and retry request:",
              refreshError
            );
            throw refreshError;
          }
        }
        throw error;
      }
    },
    [refreshAccessToken]
  );

  // Authentication and profile fetching
  const checkAuthAndFetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);

      const storedUser = localStorage.getItem("USER");
      const accessToken = localStorage.getItem("login-accessToken");

      if (!storedUser || !accessToken) {
        console.log("No authentication found, redirecting to login");
        router.push("/auth/login");
        return;
      }

      let parsedUser;
      try {
        parsedUser = JSON.parse(storedUser);
      } catch (parseError) {
        console.log("Invalid user data in localStorage, redirecting to login");
        localStorage.removeItem("USER");
        localStorage.removeItem("login-accessToken");
        router.push("/auth/login");
        return;
      }

      if (!parsedUser._id) {
        console.log("Invalid user data structure, redirecting to login");
        localStorage.removeItem("USER");
        localStorage.removeItem("login-accessToken");
        router.push("/auth/login");
        return;
      }

      const response = await makeAuthenticatedRequest(
        `/user-profile/${parsedUser._id}`
      );

      console.log("User profile fetched successfully:", response.data.data);
      setUserProfile(response.data.data);
      setAuthChecked(true);
    } catch (error) {
      console.error("Failed to load user profile:", error);

      // If it's a 401 or 403 error, redirect to login
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("Authentication failed, redirecting to login");
        localStorage.removeItem("USER");
        localStorage.removeItem("login-accessToken");
        router.push("/auth/login");
        return;
      }

      // For other errors, still set auth as checked but show error
      setAuthChecked(true);
    } finally {
      setIsLoading(false);
    }
  }, [router, makeAuthenticatedRequest, setUserProfile]);

  // Fetch missions function
  const fetchMissions = useCallback(async () => {
    try {
      console.log("Fetching missions...");

      const storedUser = localStorage.getItem("USER");
      if (!storedUser) {
        console.log("No user found in localStorage");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const id = parsedUser._id;

      if (!id) {
        console.log("No user ID found");
        return;
      }

      const response = await makeAuthenticatedRequest(
        `instructor/report/${id}`
      );

      console.log("Fetched instructor report:", response.data);

      // Store missions data
      if (response.data.missions) {
        setMission(response.data.missions);
        console.log(
          "Total missions from backend:",
          response.data.missions.length
        );
      }

      // Store student progress data
      if (response.data.studentProgress) {
        setStudentProgress(response.data.studentProgress);

        // Log topPerformingMissions count
        if (response.data.studentProgress.topPerformingMissions) {
          console.log(
            "Top Performing Missions count from backend:",
            response.data.studentProgress.topPerformingMissions.length
          );
          console.log(
            "Top Performing Missions data:",
            response.data.studentProgress.topPerformingMissions
          );
        }

        // Set recent activities
        if (response.data.studentProgress.recentActivities) {
          setRecentActivities(response.data.studentProgress.recentActivities);
        }
      }
    } catch (error) {
      console.error("Error fetching missions:", error);

      // Handle 403 Forbidden - Access denied
      if (error.response?.status === 403) {
        console.log("Access denied, redirecting to login");
        localStorage.removeItem("USER");
        localStorage.removeItem("login-accessToken");
        localStorage.removeItem("login-refreshToken");
        router.push("/auth/login");
      }
    }
  }, [makeAuthenticatedRequest, setMission, router]);

  // Note: userUpdatedValue is now managed only in the profile page to avoid conflicts

  // Check auth and fetch profile on component mount
  useEffect(() => {
    checkAuthAndFetchProfile();
  }, [checkAuthAndFetchProfile]);

  // Fetch missions after authentication is confirmed
  useEffect(() => {
    if (authChecked && userProfile) {
      fetchMissions();
    }
  }, [authChecked, userProfile, fetchMissions]);

  if (isLoading || !authChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#604196] mx-auto mb-4"></div>
          <p className="text-[var(--text)]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-10 w-full ">
      <div className="h-fit w-full">
        <div className="hidden sm:flex h-fit justify-between w-full">
          <div>
            <p className="text-[var(--background)] font-[600] leading-[40px] text-[42px] ">
              Dashboard
            </p>
            <p className="text-[var(--text)] text-[12px] xl:text-[15px] leading-[40px] ">
              Welcome to your management dashboard
            </p>
          </div>
          <div>
            <Link href="/instructor/missions/createnewmission">
              <button className="bg-[#604196] flex items-center justify-center gap-1 font-[700] text-[15px] leading-[30px] h-[57.02px] rounded-[10px] w-[216.75px] ">
                <span>
                  <Image
                    src={"/images/instructordasbord/Vector (13).png"}
                    alt="save icon"
                    width={13.64}
                    height={17.73}
                  />
                </span>
                Launch New Mission
              </button>
            </Link>
          </div>
        </div>

        <div className="h-fit grid gap-5 xl:grid-cols-2">
          <div className="grid grid-cols-2 gap-3 h-full">
            {data.map((items) => (
              <div
                key={items.id}
                className="py px bg-[#0F0F0F] gap-5 flex flex-col justify-center rounded-[17px]"
              >
                <p className="text-[14px] leading-[150%] sm:text-[20px] text-[#C7C7C7] sm:leading-[40px] ">
                  {items.sub}
                </p>
                <p className="font-[600] text-[41px] leaning-[150%] sm:text-[66px] text-[var(--background)] sm:leading-[40px] ">
                  {items.qunatity}
                </p>
              </div>
            ))}
          </div>
          <div className="hidden sm:flex flex-col gap-3 ">
            <div className="w-full py bg-[#0F0F0F] rounded-[16px] flexcenter h-[288px]">
              <SingleValueChart />
            </div>
            <div className="w-full grid grid-cols-2 gap-3">
              <div className="py px bg-[#0F0F0F] gap-3 flex flex-col justify-center rounded-[17px]">
                <p className="text-[14px] leading-[150%] text-[#C7C7C7] ">
                  Total Levels
                </p>
                <p className="font-[600] text-[35px] leaning-[150%] text-[var(--background)] ">
                  {studentProgress?.totalLevels || 0}
                </p>
              </div>
              <div className="py px bg-[#0F0F0F] gap-3 flex flex-col justify-center rounded-[17px]">
                <p className="text-[14px] leading-[150%] text-[#C7C7C7] ">
                  Total Quizzes
                </p>
                <p className="font-[600] text-[35px] leaning-[150%] text-[var(--background)] ">
                  {studentProgress?.totalQuizzes || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t-[1px] border-[#4B4B4B]"></div>

      <div className="h-fit gap-5 w-full grid xl:grid-cols-5">
        <div
          style={{ padding: "10px" }}
          className="xl:col-span-2 px py bg-[#0F0F0F] rounded-[20px] w-full h-full"
        >
          <div
            style={{ marginBottom: "25px" }}
            className="h-[40px] w-full flex items-center justify-between "
          >
            <p className="font-[700] text-[20px] leading-[40px] text-[var(--background)] ">
              Recent Activities
            </p>
            <button
              onClick={() => setShowAllActivities(!showAllActivities)}
              className="text-[#208045] hover:text-[#2aa057] transition-colors font-[500] text-[15px] leading-[40px] cursor-pointer "
            >
              {showAllActivities ? "Show Less" : "View All"}
            </button>
          </div>

          <div
            className={`w-full ${
              showAllActivities ? "max-h-[650px]" : "h-[450px]"
            } flex flex-col gap-10 overflow-y-auto scrollbar-hide pb-6`}
          >
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities
                .slice(0, showAllActivities ? recentActivities.length : 7)
                .map((activity, i) => (
                  <div
                    key={i}
                    className="h-fit min-h-[112px] flex items-center gap-5 w-full rounded-[15px] bg-[#0F0F0F] p-3"
                  >
                    <div className="h-[63px] w-[63px] rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {activity.studentName
                        ? activity.studentName.charAt(0).toUpperCase()
                        : "S"}
                    </div>
                    <div className="flex-1">
                      <p className="font-[500] text-[16px] leading-[24px] text-[var(--background)]">
                        {activity.message}
                      </p>
                      <p className="text-[#774A82] text-[14px] leading-[24px] font-[500] mt-1">
                        {formatRelativeTime(activity.time)}
                      </p>
                    </div>
                  </div>
                ))
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-[var(--text)] text-center">
                  No recent activities yet
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-3 h-fit bg-[#0F0F0F] rounded-[20px] ">
          <div
            style={{ marginBottom: "25px" }}
            className="xl:col-span-2 px py w-full h-fit"
          >
            <div className="h-[40px] w-full flex items-center justify-between ">
              <p className="font-[700] text-[20px] leading-[40px] text-[var(--background)] ">
                Top Performing Missions
              </p>
              <button
                onClick={() => setShowAllMissions(!showAllMissions)}
                className="text-[#208045] hover:text-[#2aa057] transition-colors font-[500] text-[15px] leading-[40px] cursor-pointer "
              >
                {showAllMissions ? "Show Less" : "View All"}
              </button>
            </div>

            <div
              className={`w-full ${
                showAllMissions ? "max-h-[650px]" : "h-[450px]"
              } flex flex-col overflow-y-auto scrollbar-hide`}
            >
              <div className="grid grid-cols-5 sticky top-0 bg-[#0F0F0F] z-10 pb-2">
                <div className="col-span-2 text-[#7C7C7C] font-[600] text-[11px] sm:text-[13px] leading-[40px] ">
                  Mission
                </div>
                <div className="col-span-1 text-[#7C7C7C] font-[600] text-[11px] sm:text-[13px] leading-[40px] ">
                  Recruits
                </div>
                <div className="col-span-1 text-[#7C7C7C] font-[600] text-[11px] sm:text-[13px] leading-[40px] ">
                  Engagement
                </div>
                <div className="col-span-1 text-[#7C7C7C] font-[600] text-[11px] sm:text-[13px] leading-[40px] ">
                  Avg Score
                </div>
              </div>

              <div className="flex flex-col gap-1 pb-6">
                {studentProgress?.topPerformingMissions &&
                studentProgress.topPerformingMissions.length > 0 ? (
                  studentProgress.topPerformingMissions
                    .slice(
                      0,
                      showAllMissions
                        ? studentProgress.topPerformingMissions.length
                        : 4
                    )
                    .map((el, i) => {
                      // Find the matching mission from courses array to get the thumbnail
                      const mission = courses?.find(
                        (course) => course._id === el.missionId
                      );
                      const thumbnailUrl = mission?.thumbnail?.url || null;

                      return (
                        <div
                          key={el.missionId || i}
                          className="border-t-[1px] h-fit min-h-[90px] border-[#3C3C3C]"
                        >
                          <div className="grid py-3 h-fit rounded-[15px] bg-[#0F0F0F] grid-cols-5">
                            <div className="col-span-2 overflow-hidden">
                              <div className="flex items-center gap-2">
                                {thumbnailUrl ? (
                                  <div
                                    style={{
                                      backgroundImage: `url(${thumbnailUrl})`,
                                      backgroundSize: "cover",
                                      backgroundPosition: "center",
                                    }}
                                    className="h-[45.59px] sm:h-[62px] w-[45.59px] sm:w-[62px] rounded-[10px] flex-shrink-0"
                                  ></div>
                                ) : (
                                  <div className="h-[45.59px] sm:h-[62px] w-[45.59px] sm:w-[62px] bg-gradient-to-br from-purple-500 to-pink-500 rounded-[10px] flex-shrink-0"></div>
                                )}
                                <div className="min-w-0 flex-1 overflow-hidden">
                                  <p className="font-[700] text-[12px] leading-[20px] sm:text-[14px] sm:leadig-[20px] truncate max-w-[150px] sm:max-w-[200px]">
                                    {el.missionTitle}
                                  </p>
                                  <p className="font-[500] text-[11px] leading-[20px] sm:text-[12px] text-[#ABABAB] sm:leadig-[20px] truncate max-w-[150px] sm:max-w-[200px]">
                                    Engagement: {el.engagementRate}%
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-1 self-center text-[#7C7C7C] font-[600] text-[11px] sm:text-[13px] leading-[40px] ">
                              {el.totalStudents}
                            </div>
                            <div className="col-span-1 self-center text-[#66CB9F] font-[600] text-[11px] sm:text-[13px] leading-[40px] ">
                              {el.engagementRate}%
                            </div>
                            <div className="col-span-1 self-center text-[#7C7C7C] font-[600] text-[11px] sm:text-[13px] leading-[40px] ">
                              {el.avgScore}%
                            </div>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="w-full h-full flex items-center justify-center py-10">
                    <p className="text-[var(--text)] text-center">
                      No mission data available yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{ marginBottom: "20px" }}
        className="h-fit w-full flex flex-col gap-3 "
      >
        <div
          style={{ marginBottom: "25px" }}
          className="h-[40px] w-full flex items-center justify-between "
        >
          <p className="font-[700] text-[20px] leading-[40px] text-[var(--background)] ">
            Active Missions
          </p>
          <button
            onClick={() => setShowAllActive(!showAllActive)}
            className="text-[#208045] hover:text-[#2aa057] transition-colors font-[500] text-[15px] leading-[40px] cursor-pointer "
          >
            {showAllActive ? "Show Less" : "View All"}
          </button>
        </div>

        <div className="w-full flexcenter h-fit">
          <div className="flex scrollbar-hide py w-[350px] sm:w-[500px] xl:w-[1000px] overflow-auto gap-4 pb-2">
            {courses
              ?.slice(0, showAllActive ? courses.length : 4)
              .map((el, i) => (
                <div
                  key={i}
                  className="max-w-[300px] flex flex-col w-full sm:max-w-[410.14px] h-[447.91px] bg-[#1C1124] rounded-[20px] p-4 shrink-0"
                >
                  <div
                    style={{ backgroundImage: `url(${el.thumbnail.url})` }}
                    className="h-[173.34px] bg-cover bg-center rounded-t-[20px] w-full "
                  ></div>
                  <div className="px w-full flex-1 flex flex-col justify-between py">
                    <div className="flex flex-col gap-3">
                      <div className="w-full flex items-center justify-between">
                        <button className="bg-[#393D4E] rounded-[5px] px text-[#ABABAB] font-[500] text-[13px] leading-[25px] ">
                          {el.category}
                        </button>

                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              size={10}
                              color={
                                star <= el.averageRating ? "#EFDB3F" : "#E5E7EB"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[#E8EDF6] font-[600] text-[15px] sm:text-[27px] leading-[35px] ">
                          {el.title}:
                        </p>
                        <p className="text-[#E8EDF6] h-[50px] font-[600] text-[27px] leading-[35px] overflow-y-auto scrollbar-hide">
                          {el.shortDescription}
                        </p>
                        <p className="text-[#ABABAB] text-[12px] mt-1">
                          {el.estimatedDuration} • {el.skillLevel} •{" "}
                          {el.isFree ? "Free" : `$${el.price}`}
                        </p>
                      </div>
                    </div>

                    <div className="w-full self-end ">
                      <div className="w-full flex items-center justify-between">
                        <p className="text-[#767E8F] font-[400] text-[10px] leading-[20px] ">
                          Recruit Progress
                        </p>
                        <p className="text-[10px] text-right mt-1 text-[#767E8F]">
                          {el.__v}%
                        </p>
                      </div>

                      <div>
                        <div className="w-full max-w-md">
                          <div className="w-full bg-[#000000] rounded-full h-[8px] overflow-hidden">
                            <div
                              className="h-full bg-[#4F3457] transition-all duration-200"
                              style={{ width: `${el.__v}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center w-full justify-between">
                        <div>
                          <p>
                            <span>24 </span>Recruits
                          </p>
                        </div>
                        <p>{`>`}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
