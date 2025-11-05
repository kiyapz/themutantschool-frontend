"use client";
import Image from "next/image";
import SidePanelLayout from "../component/SidePanelLayout";
import Link from "next/link";
import MissionCard from "../(missions)/missions/components/MissionCard";
import MissionCardSkeletonSmall from "../(missions)/missions/components/MissionCardSkeletonSmall";
import WelcomeModal from "../component/WelcomeModal";
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
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    // Check if this is the first visit after registration
    if (typeof window !== "undefined") {
      const isNewStudent = localStorage.getItem("newStudentWelcome");
      if (isNewStudent === "true") {
        setShowWelcomeModal(true);
        // Remove the flag so modal doesn't show again
        localStorage.removeItem("newStudentWelcome");
      }
    }
  }, []);

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

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
          totalQuizzes:
            (Array.isArray(mission.levels)
              ? mission.levels.reduce(
                  (sum, lvl) => sum + (lvl?.quizzes?.length || lvl?.quizCount || 0),
                  0
                )
              : 0) || mission.totalQuizzes || (Array.isArray(mission.quizzes) ? mission.quizzes.length : 0) || 0,
          shortDescription: mission.shortDescription,
          createdAt: mission.createdAt,
          updatedAt: mission.updatedAt,
          bg: "bg-[#000000]",
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
    <>
      {/* Welcome Modal */}
      {showWelcomeModal && <WelcomeModal onClose={handleCloseWelcomeModal} />}

      <div className="flex flex-col justify-between h-full w-full overflow-auto scrollbar-hide">
        {/* Show loading state, first mission, or empty state */}
        {loading ? (
          <div className="relative w-full mb-6">
            <MissionCardSkeletonSmall />
          </div>
        ) : firstMission ? (
          <div className="relative w-full mb-6 sm:mb-8 xl:mb-12 px-4 sm:px-6 md:px-8">
            <MissionCard
              image={
                firstMission.thumbnail?.url ||
                "https://files.ably.io/ghost/prod/2023/12/choosing-the-best-javascript-frameworks-for-your-next-project.png"
              }
              text1={firstMission.missionTitle || "Available Mission"}
              text2={firstMission.estimatedDuration || "Duration not specified"}
              text3={firstMission.levels?.length || 0}
              bg={firstMission.bg}
              missionId={firstMission.missionId}
              isAvailable={true}
              instructor={firstMission.instructor}
              levels={firstMission.levels}
              shortDescription={firstMission.shortDescription}
              price={firstMission.price}
              isFree={firstMission.isFree}
              category={firstMission.category}
              averageRating={firstMission.averageRating}
              totalQuizzes={firstMission.totalQuizzes}
              showLevelsInsteadOfPrice={true}
              isDashboardView={true}
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

        <div className="w-full mt-6 sm:mt-8 xl:mt-12 pl-4 sm:pl-6 md:pl-8">
          <p className="text-[#909090] font-[800] text-[20px] sm:text-[27px] leading-[40px] sm:leading-[60px] mb-4">
            Let&apos;s Get You Started
          </p>

          <div className="flex flex-col gap-4 sm:gap-5">
            <div>
              <SidePanelLayout
                text1={"Create your mutant account"}
                index={1}
                completed={true}
                text2={"Welcome to Mutant School!"}
                text3={"+15 XP"}
                style={
                  "text-[#25AF35] font-[700] text-[14px] sm:text-[20px] xl:text-[30px] leading-[40px] sm:leading-[60px] "
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
                link={"/student/dashboard/missions"}
                style={
                  "text-[#AF2BC6] font-[700] text-[12px] sm:text-[15px] xl:text-[17px] leading-[24px] sm:leading-[30px] bg-[#1F0D1F] "
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
                link={"/student/dashboard/profile"}
                style={
                  "text-[#2B61C6] font-[700] text-[12px] sm:text-[15px] xl:text-[17px] leading-[24px] sm:leading-[30px] bg-[#0D141F] "
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
