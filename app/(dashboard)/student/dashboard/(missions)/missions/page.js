"use client";
import axios from "axios";
import MissionCard from "./components/MissionCard";
import MissionCardSkeleton from "./components/MissionCardSkeleton";
import LoadingSpinner from "./components/LoadingSpinner";
import { useEffect, useState } from "react";
import Link from "next/link";

const missioncard = [
  {
    bg: "bg-gradient-to-r from-[#0E0E0E] to-[#0F060F]",
  },
  {
    bg: "bg-gradient-to-r from-[#231926] to-[#194034]",
  },
  {
    bg: "bg-gradient-to-r from-[#0E0E0E] to-[#0F060F]",
  },
  {
    bg: "bg-gradient-to-r from-[#231926] to-[#5D1D49]",
  },
];

export default function Page() {
  const [missionPurchases, setMissionPurchases] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    const fetchStudentBreakdown = async () => {
      try {
        const token = localStorage.getItem("login-accessToken");

        if (!token) {
          console.error("No authentication token found");
          window.location.href = "/auth/login";
          return;
        }

        console.log(
          "Fetching student dashboard data with token:",
          token.substring(0, 10) + "..."
        );

        const response = await axios.get(
          "https://themutantschool-backend.onrender.com/api/student/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            timeout: 30000, // 30 second timeout
          }
        );

        console.log("API Response:pppppppppp", response.data);

        // Check if the response has the expected format
        if (
          !response.data ||
          !response.data.data ||
          !response.data.data.enrolledCourses
        ) {
          console.error("Unexpected API response format:", response.data);
          setMissionPurchases([]);
          return;
        }

        // Check if there are any enrolled courses
        if (
          !Array.isArray(response.data.data.enrolledCourses) ||
          response.data.data.enrolledCourses.length === 0
        ) {
          console.log("No enrolled courses found");
          setMissionPurchases([]);
          return;
        }

        const missionsWithBg = await Promise.all(
          response.data.data.enrolledCourses.map(async (course, index) => {
            // Fetch full mission data to get accurate level count
            let totalLevels = 0;
            try {
              const missionResponse = await axios.get(
                `https://themutantschool-backend.onrender.com/api/mission/${course.mission._id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              totalLevels = missionResponse.data.data.levels?.length || 0;
              console.log(
                `✅ Mission "${course.mission.title}" has ${totalLevels} levels`
              );
            } catch (error) {
              console.warn(
                `⚠️ Could not fetch level count for mission ${course.mission.title}:`,
                error.message
              );
              // Fallback to existing data if API call fails
              totalLevels = course.mission.levels?.length || 0;
            }

            return {
              missionId: course.mission._id,
              missionTitle: course.mission.title,
              thumbnail: course.mission.thumbnail,
              progress: course.progress.completedLevels || [],
              progressPercentage: course.progressToNextLevel?.percent || 0,
              category: course.mission.category || "Course",
              price: course.mission.price || course.paymentInfo?.amount || 0,
              isFree: course.mission.isFree || course.paymentInfo?.amount === 0,
              estimatedDuration:
                course.mission.estimatedDuration || "Duration not specified",
              averageRating: course.mission.averageRating || 0,
              instructor: course.mission.instructor || {
                name: "Unknown Instructor",
              },
              levels: course.mission.levels || [],
              totalLevels: totalLevels,
              shortDescription:
                course.mission.shortDescription ||
                course.mission.description ||
                "No description available",
              description:
                course.mission.description || "No description available",
              difficulty:
                course.mission.difficulty || course.mission.level || "Beginner",
              enrolledAt: course.enrolledAt,
              paymentStatus: course.paymentStatus,
              paymentInfo: course.paymentInfo,
              bg: missioncard[index % missioncard.length].bg,
            };
          })
        );

        // Sort missions by the most recent purchase date
        missionsWithBg.sort(
          (a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt)
        );

        setMissionPurchases(missionsWithBg);
        console.log("Mission Purchases:", missionsWithBg);
      } catch (error) {
        console.error(
          "Error fetching student breakdown:",
          error.response?.data || error.message
        );

        // Check for specific error types
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);

          if (error.response.status === 401) {
            console.error("Authentication error - redirecting to login");
            // Redirect to login page if token is invalid
            window.location.href = "/auth/login";
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
        } else if (error.code === "ECONNABORTED") {
          // Timeout error
          console.error("Request timeout - server took too long to respond");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error setting up request:", error.message);
        }

        // Set empty array on error to show "no missions" message
        setMissionPurchases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentBreakdown();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex flex-col gap-5">
          {/* Show 3 skeleton cards while loading */}
          <MissionCardSkeleton />
          <MissionCardSkeleton />
          <MissionCardSkeleton />
        </div>
      ) : missionPurchases.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-lg mb-2" style={{ color: "var(--text)" }}>
              No recent mission recorded.
            </div>
            <Link
              href="/missions"
              className="underline transition-colors"
              style={{
                color: "var(--primary)",
              }}
              onMouseEnter={(e) =>
                (e.target.style.color = "var(--primary-light)")
              }
              onMouseLeave={(e) => (e.target.style.color = "var(--primary)")}
            >
              Buy a mission now
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {missionPurchases.map((item) => (
            <MissionCard
              key={item.missionId}
              missionId={item.missionId}
              image={item.thumbnail?.url}
              text1={item.missionTitle}
              text3={`${item.progressPercentage || 0}% Complete`}
              bg={item.bg}
              isAvailable={false}
              instructor={item.instructor}
              levels={item.levels}
              totalLevels={item.totalLevels}
              shortDescription={item.shortDescription}
              price={item.price}
              isFree={item.isFree}
              category={item.category}
              averageRating={item.averageRating}
              difficulty={item.difficulty}
              progress={item.progress}
              progressPercentage={item.progressPercentage}
              paymentStatus={item.paymentStatus}
              paymentInfo={item.paymentInfo}
              enrolledAt={item.enrolledAt}
            />
          ))}
        </div>
      )}
    </>
  );
}
