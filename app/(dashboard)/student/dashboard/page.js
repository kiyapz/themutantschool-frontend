"use client";
import Image from "next/image";
import SidePanelLayout from "../component/SidePanelLayout";
import Link from "next/link";
import MissionCard from "../(missions)/missions/components/MissionCard";
import MissionCardSkeletonSmall from "../(missions)/missions/components/MissionCardSkeletonSmall";
import WelcomeModal from "../component/WelcomeModal";
import axios from "axios";
import { useEffect, useState, Suspense } from "react";

// Move this outside so it doesn't need to be in the useEffect deps
const missioncard = [
  { bg: "bg-gradient-to-r from-[#0E0E0E] to-[#0F060F]" },
  { bg: "bg-gradient-to-r from-[#231926] to-[#194034]" },
  { bg: "bg-gradient-to-r from-[#0E0E0E] to-[#0F060F]" },
  { bg: "bg-gradient-to-r from-[#231926] to-[#5D1D49]" },
];

function StudentDashboardContent() {
  const [availableMissions, setAvailableMissions] = useState([]);
  const [enrolledMissions, setEnrolledMissions] = useState([]);
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

  // Get the first available mission
  const firstAvailableMission = availableMissions[0];
  const firstEnrolledMission = enrolledMissions[0];
  const hasEnrolledMissions = Boolean(firstEnrolledMission);

  return (
    <>
      {/* Welcome Modal */}
      {showWelcomeModal && <WelcomeModal onClose={handleCloseWelcomeModal} />}

      <div className="flex flex-col justify-between h-full w-full overflow-y-auto  scrollbar-hide">
        {/* Show loading state, first mission, or empty state */}
        {loading ? (
          <div className="relative w-full mb-6">
            <MissionCardSkeletonSmall />
          </div>
        ) : hasEnrolledMissions ? (
          <div className="relative w-full mb-6 sm:mb-8 xl:mb-12 px-4 sm:px-6 md:px-8">
            <MissionCard
              key={firstEnrolledMission.missionId}
              image={
                firstEnrolledMission.thumbnail?.url ||
                "/images/students-images/Group (18).png"
              }
              text1={firstEnrolledMission.missionTitle || "Your Mission"}
              text3={`${
                firstEnrolledMission.progressPercentage || 0
              }% Complete`}
              bg={firstEnrolledMission.bg}
              missionId={firstEnrolledMission.missionId}
              isAvailable={false}
              instructor={firstEnrolledMission.instructor}
              levels={firstEnrolledMission.levels}
              totalLevels={firstEnrolledMission.totalLevels}
              shortDescription={firstEnrolledMission.shortDescription}
              price={firstEnrolledMission.price}
              isFree={firstEnrolledMission.isFree}
              category={firstEnrolledMission.category}
              averageRating={firstEnrolledMission.averageRating}
              difficulty={firstEnrolledMission.difficulty}
              progress={firstEnrolledMission.progress}
              progressPercentage={firstEnrolledMission.progressPercentage}
              paymentStatus={firstEnrolledMission.paymentStatus}
              paymentInfo={firstEnrolledMission.paymentInfo}
              showProgressOnDashboard={true}
            />
          </div>
        ) : firstAvailableMission ? (
          <div className="relative w-full mb-6 sm:mb-8 xl:mb-12 px-4 sm:px-6 md:px-8">
            <MissionCard
              image={
                firstAvailableMission.thumbnail?.url ||
                "https://files.ably.io/ghost/prod/2023/12/choosing-the-best-javascript-frameworks-for-your-next-project.png"
              }
              text1={firstAvailableMission.missionTitle || "Available Mission"}
              text2={
                firstAvailableMission.estimatedDuration ||
                "Duration not specified"
              }
              text3={firstAvailableMission.levels?.length || 0}
              bg={firstAvailableMission.bg}
              missionId={firstAvailableMission.missionId}
              isAvailable={true}
              instructor={firstAvailableMission.instructor}
              levels={firstAvailableMission.levels}
              shortDescription={firstAvailableMission.shortDescription}
              price={firstAvailableMission.price}
              isFree={firstAvailableMission.isFree}
              category={firstAvailableMission.category}
              averageRating={firstAvailableMission.averageRating}
              totalQuizzes={firstAvailableMission.totalQuizzes}
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
                link={"/student/missions"}
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
                link={"/student/profile"}
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

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-t-[var(--secondary)] border-gray-700 rounded-full animate-spin"></div>
        </div>
      }
    >
      <StudentDashboardContent />
    </Suspense>
  );
}
