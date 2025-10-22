"use client";
import Image from "next/image";
import SidePanelLayout from "../../component/SidePanelLayout";
import Link from "next/link";
import MissionCard from "./student-mission/components/MissionCard";
import axios from "axios";
import { useEffect, useState } from "react";

// Move this outside so it doesn't need to be in the useEffect deps
const missioncard = [
  { bg: "bg-gradient-to-r from-[#0E0E0E] to-[#0F060F]" },
  { bg: "bg-gradient-to-r from-[#231926] to-[#194034]" },
  { bg: "bg-gradient-to-r from-[#0E0E0E] to-[#0F060F]" },
  { bg: "bg-gradient-to-r from-[#231926] to-[#5D1D49]" },
];

export default function Page() {
  const [availableMissions, setAvailableMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasCompletedMission, setHasCompletedMission] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    const fetchAvailableMissions = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("login-accessToken")
            : null;

        // Fetch all missions
        const missionsResponse = await axios.get(
          "https://themutantschool-backend.onrender.com/api/mission",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Fetch student's enrolled courses
        const studentResponse = await axios.get(
          "https://themutantschool-backend.onrender.com/api/student/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("All missions:", missionsResponse.data);
        console.log("Student enrolled courses:", studentResponse.data);

        // Get enrolled mission IDs
        const enrolledMissionIds = new Set(
          (studentResponse?.data?.data?.enrolledCourses ?? []).map(
            (course) => course.mission._id
          )
        );

        // Filter out enrolled missions to get available ones
        const availableMissionsData = missionsResponse.data.data.filter(
          (mission) => !enrolledMissionIds.has(mission._id)
        );

        const missionsWithBg = availableMissionsData.map((mission, index) => ({
          missionId: mission._id,
          missionTitle: mission.title,
          thumbnail: mission.thumbnail,
          category: mission.category,
          price: mission.price,
          isFree: mission.isFree,
          estimatedDuration: mission.estimatedDuration,
          averageRating: mission.averageRating,
          instructor: mission.instructor,
          levels: mission.levels,
          shortDescription: mission.shortDescription,
          createdAt: mission.createdAt,
          updatedAt: mission.updatedAt,
          bg: missioncard[index % missioncard.length].bg,
        }));

        // Sort missions by creation date (most recent first)
        missionsWithBg.sort((a, b) => {
          // First try to sort by createdAt date
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          // If createdAt is not available, try updatedAt
          if (a.updatedAt && b.updatedAt) {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          }
          // Fallback to missionId (MongoDB ObjectIDs contain timestamp)
          return a.missionId > b.missionId ? -1 : 1;
        });

        setAvailableMissions(missionsWithBg);
        console.log("Available Missions:", missionsWithBg);

        // Check if student has completed any mission
        const breakdownResponse = await axios.get(
          "https://themutantschool-backend.onrender.com/api/student/breakdown/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const missions = breakdownResponse.data.data || [];
        const hasCompleted = missions.some(
          (mission) => mission.progressPercentage === 100
        );
        setHasCompletedMission(hasCompleted);
        console.log("Has completed mission:", hasCompleted);

        // Check if profile is complete
        const studentProfileData = studentResponse.data.data;
        const profileComplete = !!(
          studentProfileData?.firstName &&
          studentProfileData?.lastName &&
          studentProfileData?.email &&
          studentProfileData?.avatar
        );
        setIsProfileComplete(profileComplete);
        console.log("Profile complete:", profileComplete);
      } catch (error) {
        console.error(
          "Error fetching available missions:",
          error?.response?.data || error?.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableMissions();
  }, []); // safe, missioncard is module-scoped

  // Get the first available mission
  const firstMission = availableMissions[0];

  return (
    <div className="flex flex-col justify-between h-full">
      {/* Show loading state, first mission, or empty state */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300 mx-auto mb-2"></div>
            Loading missions...
          </div>
        </div>
      ) : firstMission ? (
        <div className="relative">
          <MissionCard
            image={
              firstMission.thumbnail?.url ||
              "https://files.ably.io/ghost/prod/2023/12/choosing-the-best-javascript-frameworks-for-your-next-project.png"
            }
            text1={firstMission.missionTitle || "Available Mission"}
            text2={firstMission.estimatedDuration || "Duration not specified"}
            text3={`${firstMission.isFree ? "Free" : `$${firstMission.price}`}`}
            className={firstMission.bg}
            missionId={firstMission.missionId}
            isAvailable={true}
            instructor={firstMission.instructor}
            levels={firstMission.levels}
            shortDescription={firstMission.shortDescription}
            price={firstMission.price}
            isFree={firstMission.isFree}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-gray-400 text-lg mb-2">
              No available missions found.
            </div>
            <Link
              href="/missions"
              className="text-blue-500 hover:text-blue-400 underline"
            >
              Browse all missions
            </Link>
          </div>
        </div>
      )}

      <div className="w-full">
        <p className="text-[#909090] px font-[800] text-[27px] leading-[60px] ">
          Let&apos;s Get You Started
        </p>

        <div className="flex flex-col padding-left gap-5">
          <div>
            <SidePanelLayout
              text1={"Create your mutant account"}
              index={1}
              completed={true}
              text2={"Welcome to Mutant School!"}
              text3={"+15 XP"}
              style={
                "text-[#25AF35] font-[700] text-[20px] xl:text-[30px] leading-[60px] "
              }
            />
          </div>

          <div>
            <SidePanelLayout
              text1={"Complete your first mission"}
              index={2}
              completed={hasCompletedMission}
              text2={"Pick a beginner-friendly course to start for 20XP"}
              text3={"Start now"}
              link={"/student/student-dashboard/student-mission"}
              style={
                "text-[#AF2BC6] font-[700] xl:text-[17px] leading-[30px] bg-[#1F0D1F] "
              }
            />
          </div>

          <div>
            <SidePanelLayout
              text1={"Complete your profile"}
              text2={"Finish your profile setup to get 5XP"}
              text3={"Start now"}
              index={3}
              completed={isProfileComplete}
              link={"/student/student-dashboard/student-profile"}
              style={
                "text-[#2B61C6] font-[700] xl:text-[17px] leading-[30px] bg-[#0D141F] "
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
