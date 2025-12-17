"use client";
import Image from "next/image";
import SidePanelLayout from "../component/SidePanelLayout";
import Link from "next/link";
import MissionCard from "../(missions)/missions/components/MissionCard";
import MissionCardSkeletonSmall from "../(missions)/missions/components/MissionCardSkeletonSmall";
import WelcomeModal from "../component/WelcomeModal";
import axios from "axios";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Move this outside so it doesn't need to be in the useEffect deps
const missioncard = [
  { bg: "bg-gradient-to-r from-[#0E0E0E] to-[#0F060F]" },
  { bg: "bg-gradient-to-r from-[#231926] to-[#194034]" },
  { bg: "bg-gradient-to-r from-[#0E0E0E] to-[#0F060F]" },
  { bg: "bg-gradient-to-r from-[#231926] to-[#5D1D49]" },
];

function StudentDashboardContent() {
  const searchParams = useSearchParams();
  const [availableMissions, setAvailableMissions] = useState([]);
  const [enrolledMissions, setEnrolledMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasCompletedMission, setHasCompletedMission] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [oauthProcessing, setOauthProcessing] = useState(false);

  // Handle Google OAuth callback params if backend redirects directly to this page
  // This MUST run first before any other checks
  useEffect(() => {
    const handleOAuthParams = async () => {
      const accessToken = searchParams.get("accessToken");
      
      if (!accessToken) {
        setOauthProcessing(false);
        return;
      }
      
      setOauthProcessing(true);
      console.log("=== Google OAuth params detected on student dashboard ===");
      console.log("AccessToken found in URL params");
      
      // Extract user details from URL params
      const firstName = searchParams.get("firstName");
      const lastName = searchParams.get("lastName");
      const email = searchParams.get("email");
      const role = searchParams.get("role");
      const refreshToken = searchParams.get("refreshToken");

      console.log("User params:", { firstName, lastName, email, role });

      // Store access token first
      try {
        localStorage.setItem("login-accessToken", accessToken);
        console.log("✓ Access token stored in localStorage");
        
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
          console.log("✓ Refresh token stored in localStorage");
        }

        // Try to fetch full user profile from backend using the token
        try {
          const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
          const userId = tokenPayload.id;

          console.log("Fetching full user profile for ID:", userId);

          const profileResponse = await fetch(
            `https://themutantschool-backend.onrender.com/api/user-profile/${userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              credentials: "include",
            }
          );

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            const fullUser = profileData.data || profileData;

            console.log("Full user profile fetched:", fullUser);
            
            // Ensure isVerified is set for Google OAuth users
            if (!fullUser.isVerified && !fullUser.emailVerified && !fullUser.verified) {
              fullUser.isVerified = true;
              fullUser.emailVerified = true;
              fullUser.verified = true;
            }
            
            localStorage.setItem("USER", JSON.stringify(fullUser));
            console.log("✓ Full user data stored in localStorage with key 'USER'");
            console.log("User data:", JSON.stringify(fullUser, null, 2));
            
            // Clean up URL params by replacing current URL without params
            window.history.replaceState({}, "", "/student/dashboard");
            setOauthProcessing(false);
            return;
          } else {
            console.warn("Failed to fetch user profile, using URL params");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }

        // Fallback: Build minimal user object from URL params
        const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
        const user = {
          _id: tokenPayload.id,
          firstName: firstName || "",
          lastName: lastName || "",
          email: email || tokenPayload.email || "",
          role: role || tokenPayload.role || "",
          isVerified: true, // Google OAuth users are verified
          emailVerified: true, // Also set emailVerified for compatibility
          verified: true, // Also set verified for compatibility
        };

        localStorage.setItem("USER", JSON.stringify(user));
        console.log("✓ Minimal user data stored in localStorage with key 'USER'");
        console.log("Stored user:", user);
        console.log("User data:", JSON.stringify(user, null, 2));
        
        // Clean up URL params
        window.history.replaceState({}, "", "/student/dashboard");
        setOauthProcessing(false);
      } catch (storageError) {
        console.error("Error storing auth data in localStorage:", storageError);
        setOauthProcessing(false);
      }
    };

    handleOAuthParams();
  }, [searchParams]);

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

  // Wait for OAuth processing to complete before fetching missions
  useEffect(() => {
    if (oauthProcessing) {
      return; // Don't fetch missions while OAuth is processing
    }

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
        const enrolledCourses =
          studentResponse?.data?.data?.enrolledCourses ?? [];
        const enrolledMissionIds = new Set(
          enrolledCourses
            .filter((course) => course?.mission?._id)
            .map((course) => course.mission._id)
        );

        const enrolledMissionsDataRaw = enrolledCourses
          .map((course, index) => {
            const mission = course?.mission ?? {};
            const progressInfo = course?.progress ?? {};
            const progressToNextLevel = course?.progressToNextLevel ?? {};

            const completedLevels = Array.isArray(progressInfo?.completedLevels)
              ? progressInfo.completedLevels
              : [];
            const completedCount = completedLevels.length;

            const missionLevels = Array.isArray(mission?.levels)
              ? mission.levels
              : [];

            const candidateTotals = [
              missionLevels.length,
              progressInfo?.totalLevels,
              progressInfo?.total,
              progressInfo?.levelCount,
              progressInfo?.levels?.length,
              progressToNextLevel?.totalLevels,
              completedCount,
            ]
              .map((value) =>
                typeof value === "number" && value > 0 ? value : 0
              )
              .filter((value) => value > 0);

            const totalLevelsCount =
              candidateTotals.length > 0 ? Math.max(...candidateTotals) : 0;

            let derivedProgress =
              totalLevelsCount > 0
                ? (completedCount / totalLevelsCount) * 100
                : progressToNextLevel?.percent ?? 0;

            if (
              typeof progressToNextLevel?.percent === "number" &&
              progressToNextLevel.percent > derivedProgress
            ) {
              derivedProgress = progressToNextLevel.percent;
            }

            if (totalLevelsCount > 0 && completedCount >= totalLevelsCount) {
              derivedProgress = 100;
            }

            derivedProgress = Math.min(
              100,
              Math.max(
                0,
                Number.isFinite(derivedProgress) ? derivedProgress : 0
              )
            );

            const isCompleted =
              progressInfo?.isCompleted === true ||
              derivedProgress >= 99.9 ||
              (totalLevelsCount > 0 && completedCount >= totalLevelsCount);

            return {
              missionId: mission._id,
              missionTitle: mission.title,
              thumbnail: mission.thumbnail,
              progress: completedLevels,
              progressPercentage: derivedProgress,
              category: mission.category || "Course",
              price: mission.price || course?.paymentInfo?.amount || 0,
              isFree:
                mission.isFree || course?.paymentInfo?.amount === 0 || false,
              estimatedDuration:
                mission.estimatedDuration || "Duration not specified",
              averageRating: mission.averageRating || 0,
              instructor: mission.instructor,
              levels: missionLevels,
              totalLevels: totalLevelsCount,
              shortDescription:
                mission.shortDescription ||
                mission.description ||
                "No description available",
              difficulty: mission.difficulty || mission.level || "Beginner",
              enrolledAt: course.enrolledAt,
              paymentStatus: course.paymentStatus,
              paymentInfo: course.paymentInfo,
              bg: missioncard[index % missioncard.length]?.bg,
              isCompleted,
              completedLevelsCount: completedCount,
            };
          })
          .filter((course) => course.missionId);
        const enrolledMissionsData = enrolledMissionsDataRaw
          .filter((mission) => !mission.isCompleted)
          .sort((a, b) => {
            if (a.progressPercentage !== b.progressPercentage) {
              return b.progressPercentage - a.progressPercentage;
            }
            if (a.enrolledAt && b.enrolledAt) {
              return new Date(b.enrolledAt) - new Date(a.enrolledAt);
            }
            return 0;
          });

        setEnrolledMissions(enrolledMissionsData);

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
                  (sum, lvl) =>
                    sum + (lvl?.quizzes?.length || lvl?.quizCount || 0),
                  0
                )
              : 0) ||
            mission.totalQuizzes ||
            (Array.isArray(mission.quizzes) ? mission.quizzes.length : 0) ||
            0,
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
        const avatarUrl =
          studentProfileData?.profile?.avatar?.url ||
          studentProfileData?.profile?.avatar?.secure_url ||
          studentProfileData?.profile?.avatarUrl ||
          studentProfileData?.avatar?.url ||
          studentProfileData?.avatar?.secure_url ||
          studentProfileData?.avatarUrl ||
          studentProfileData?.avatar ||
          "";
        const basicFieldsComplete = Boolean(
          studentProfileData?.firstName &&
            studentProfileData?.lastName &&
            studentProfileData?.email
        );

        let profileComplete = basicFieldsComplete && Boolean(avatarUrl);

        if (typeof studentProfileData?.profileCompleted === "boolean") {
          profileComplete = studentProfileData.profileCompleted;
        } else if (
          typeof studentProfileData?.profileCompletion?.isComplete === "boolean"
        ) {
          profileComplete = studentProfileData.profileCompletion.isComplete;
        } else if (
          typeof studentProfileData?.profileCompletionPercentage === "number"
        ) {
          profileComplete = studentProfileData.profileCompletionPercentage >= 100;
        } else if (
          typeof studentProfileData?.profileCompletion?.percentage === "number"
        ) {
          profileComplete =
            studentProfileData.profileCompletion.percentage >= 100;
        } else if (
          typeof studentProfileData?.profileCompletion === "number"
        ) {
          profileComplete = studentProfileData.profileCompletion >= 100;
        }

        setIsProfileComplete(profileComplete);
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
  }, [oauthProcessing]); // Wait for OAuth processing to complete

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
