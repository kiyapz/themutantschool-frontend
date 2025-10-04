"use client";
import axios from "axios";
import MissionCard from "./components/MissionCard";
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

        const response = await axios.get(
          "https://themutantschool-backend.onrender.com/api/student/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response:pppppppppp", response.data);

        const missionsWithBg = response.data.data.enrolledCourses.map(
          (course, index) => ({
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
      } finally {
        setLoading(false);
      }
    };

    fetchStudentBreakdown();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner size="large" color="primary" />
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
              text2={item.estimatedDuration}
              text3={`${item.progressPercentage || 0}% Complete`}
              bg={item.bg}
              isAvailable={false}
              instructor={item.instructor}
              levels={item.levels}
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
