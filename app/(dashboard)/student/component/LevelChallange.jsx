"use client";
import Image from "next/image";
import Changebtn from "./btn/Changebtn";
import { useContext, useEffect, useState } from "react";
import { StudentContext } from "./Context/StudentContext";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LevelChallange() {
  const [studentData, setStudentData] = useState({
    xp: 0,
    level: 1,
    avatarStage: "Newbie",
    progressToNextLevel: {
      currentXpInLevel: 0,
      xpToNextLevel: 100,
      percent: 0,
    },
  });
  const [totalProgress, setTotalProgress] = useState(0);
  const [totalQuizzesPassed, setTotalQuizzesPassed] = useState(0);
  const [loading, setLoading] = useState(true);
  const { showLevelCkallenge, setShowLevelCkallenge } =
    useContext(StudentContext);
  const [isAnimated, setIsAnimated] = useState(false);
  const router = useRouter();

  const [showElements, setShowElements] = useState({
    topIcons: false,
    character: false,
    newbieText: false,
    progressBar: false,
    button: false,
    bottomText: false,
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("login-accessToken");

        // Fetch dashboard data
        const dashboardResponse = await axios.get(
          "https://themutantschool-backend.onrender.com/api/student/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Dashboard API Response:", dashboardResponse.data);
        const apiData = dashboardResponse.data.data;

        // Calculate percentage if not provided or if API returns 0 incorrectly
        const currentXpInLevel =
          apiData.progressToNextLevel?.currentXpInLevel || 0;
        const xpToNextLevel = apiData.progressToNextLevel?.xpToNextLevel || 100;
        const apiPercent = apiData.progressToNextLevel?.percent;

        // Fallback calculation if API percent is not available
        const calculatedPercent =
          xpToNextLevel > 0
            ? Math.round(
                (currentXpInLevel / (currentXpInLevel + xpToNextLevel)) * 100
              )
            : 0;

        const finalPercent =
          apiPercent !== undefined && apiPercent !== null
            ? apiPercent
            : calculatedPercent;

        console.log("XP Data:", {
          currentXpInLevel,
          xpToNextLevel,
          apiPercent,
          calculatedPercent,
          finalPercent,
        });

        setStudentData({
          xp: apiData.xp || 0,
          level: apiData.level || 1,
          avatarStage: apiData.avatarStage || "Newbie",
          progressToNextLevel: {
            currentXpInLevel,
            xpToNextLevel,
            percent: finalPercent,
          },
        });

        // Fetch breakdown data
        const breakdownResponse = await axios.get(
          "https://themutantschool-backend.onrender.com/api/student/breakdown/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Breakdown API Response:", breakdownResponse.data);
        const missions = breakdownResponse.data.data || [];

        // Sum all progressPercentage values
        const totalProgressSum = missions.reduce(
          (sum, mission) => sum + (mission.progressPercentage || 0),
          0
        );

        // Count total quizzes passed across all missions
        const totalQuizzesPassed = missions.reduce((total, mission) => {
          const missionQuizzesPassed = (mission.progress || []).filter(
            (level) => level.quizPassed === true
          ).length;
          return total + missionQuizzesPassed;
        }, 0);

        setTotalProgress(totalProgressSum);
        setTotalQuizzesPassed(totalQuizzesPassed);
      } catch (error) {
        console.error(
          "Error fetching student data:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  useEffect(() => {
    // Staggered animation sequence
    const timers = [
      setTimeout(
        () => setShowElements((prev) => ({ ...prev, topIcons: true })),
        200
      ),
      setTimeout(
        () => setShowElements((prev) => ({ ...prev, character: true })),
        500
      ),
      setTimeout(
        () => setShowElements((prev) => ({ ...prev, newbieText: true })),
        800
      ),
      setTimeout(
        () => setShowElements((prev) => ({ ...prev, progressBar: true })),
        1100
      ),
      setTimeout(() => setIsAnimated(true), 1200), // Progress bar fill
      setTimeout(
        () => setShowElements((prev) => ({ ...prev, button: true })),
        1400
      ),
      setTimeout(
        () => setShowElements((prev) => ({ ...prev, bottomText: true })),
        1700
      ),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  return (
    <>
      {showLevelCkallenge && (
        <div
          style={{ padding: "0 0 20px 0" }}
          className="w-full max-w-full lg:w-full h-full grid grid-cols-1 gap-4 justify-items-center items-start px-4"
        >
          <div className="grid grid-cols-1 gap-4 w-full max-w-full items-center justify-items-center">
            {/* Top Icons with staggered knockout animation */}
            <div className="flex items-center h-[10vh] justify-between w-full">
              {/* First Icon - Total Progress */}
              <div
                className={`Xirod flex items-center gap-1 font-[400] xl:text-[18px] leading-[20px] transition-all duration-700 ease-out ${
                  showElements.topIcons
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-[-20px] scale-95"
                }`}
              >
                <span
                  className={`transition-all duration-500 delay-100 ${
                    showElements.topIcons ? "rotate-0" : "rotate-180"
                  }`}
                >
                  <Image
                    src={"/images/students-images/Layer 2 (1).png"}
                    width={25.76}
                    height={32.24}
                    alt="mutantrobot"
                  />
                </span>
                <span
                  className={`transition-all duration-500 delay-200 ${
                    showElements.topIcons
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-[-10px]"
                  }`}
                >
                  {totalProgress}
                </span>
              </div>

              {/* Second Icon */}
              <div
                className={`Xirod font-[400] flex items-center gap-1 xl:text-[18px] leading-[20px] transition-all duration-700 delay-150 ease-out ${
                  showElements.topIcons
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-[-20px] scale-95"
                }`}
              >
                <span
                  className={`transition-all duration-500 delay-250 ${
                    showElements.topIcons
                      ? "rotate-0 scale-100"
                      : "rotate-[-180deg] scale-75"
                  }`}
                >
                  <Image
                    src={"/images/students-images/Group (17).png"}
                    width={25.76}
                    height={32.24}
                    alt="mutantrobot"
                  />
                </span>
                <span
                  className={`transition-all duration-500 delay-300 ${
                    showElements.topIcons
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-[-10px]"
                  }`}
                >
                  {studentData.xp}xp
                </span>
              </div>

              {/* Third Icon - Total Quizzes Passed */}
              <div
                className={`Xirod font-[400] flex items-center gap-1 xl:text-[18px] leading-[20px] transition-all duration-700 delay-300 ease-out ${
                  showElements.topIcons
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-[-20px] scale-95"
                }`}
              >
                <span
                  className={`transition-all duration-500 delay-350 ${
                    showElements.topIcons
                      ? "rotate-0 scale-100"
                      : "rotate-180 scale-75"
                  }`}
                >
                  <Image
                    src={"/images/students-images/Layer 3.png"}
                    width={25.76}
                    height={32.24}
                    alt="mutantrobot"
                  />
                </span>
                <span
                  className={`transition-all duration-500 delay-400 ${
                    showElements.topIcons
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-[-10px]"
                  }`}
                >
                  {totalQuizzesPassed}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-10 items-center justify-center w-full">
              {/* Character Image with dramatic entrance */}
              <div className="flex flex-col items-center justify-center">
                <div
                  className={`transition-all duration-1000 ease-out ${
                    showElements.character
                      ? "opacity-100 translate-y-0 scale-100 rotate-0"
                      : "opacity-0 translate-y-[30px] scale-75 rotate-[-5deg]"
                  }`}
                >
                  <Image
                    src={"/images/students-images/Layer 2.png"}
                    width={224.59}
                    height={274.17}
                    alt="mutant-robot"
                  />
                </div>

                {/* Avatar Stage text with typewriter effect */}
                <p
                  className={`text-center Xirod text-[#FDDD3F] font-[500] text-[19px] leading-[40px] transition-all duration-800 ease-out ${
                    showElements.newbieText
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-[10px] scale-95"
                  }`}
                >
                  <span
                    className={`inline-block transition-all duration-300 ${
                      showElements.newbieText ? "animate-pulse" : ""
                    }`}
                  >
                    {studentData.avatarStage}
                  </span>
                </p>
              </div>

              {/* Progress section with smooth reveal */}
              <div
                className={`w-full max-w-full lg:max-w-[363px] mx-auto transition-all duration-800 ease-out ${
                  showElements.progressBar
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-[20px]"
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <p className="text-[#BF8BDB] font-[400] text-[14px] leading-[40px]">
                    XP Progress
                  </p>
                  <p className="text-[#505BAA] font-[800] text-[14px] leading-[40px]">
                    {studentData.progressToNextLevel.currentXpInLevel}/
                    {studentData.progressToNextLevel.currentXpInLevel +
                      studentData.progressToNextLevel.xpToNextLevel}
                    <span className="text-xs ml-1">
                      ({studentData.progressToNextLevel.percent}%)
                    </span>
                  </p>
                </div>
                <div className="w-full h-[15px] bg-[#3b435c] rounded-[10px] z-20 relative mb-4 overflow-hidden">
                  <div
                    className="h-[15px] rounded-full relative z-30 bg-gradient-to-r from-[#2b70bb] to-[#4a8de8] transition-all duration-1500 ease-out shadow-lg"
                    style={{
                      width: isAnimated
                        ? `${Math.max(
                            studentData.progressToNextLevel.percent,
                            studentData.progressToNextLevel.currentXpInLevel > 0
                              ? 2
                              : 0
                          )}%`
                        : "0%",
                      boxShadow: isAnimated
                        ? "0 0 10px rgba(43, 112, 187, 0.5)"
                        : "none",
                    }}
                  ></div>
                </div>
                <p className="text-center font-[400] text-[14px] text-[#957AA3] leading-[40px]">
                  {studentData.progressToNextLevel.xpToNextLevel} XP to next
                  level
                </p>
              </div>

              {/* Button with bounce effect */}
              <div
                className={`w-full max-w-full lg:max-w-[363px] mx-auto transition-all duration-700 ease-out ${
                  showElements.button
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-[20px] scale-95"
                }`}
              >
                <Changebtn
                  sm="sm:text-[7px] xl:text-[10px]"
                  text={"VIEW ACHIEVEMENTS"}
                  onclick={() => router.push("/student/dashboard/achievements")}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div
            className={`w-full max-w-full lg:max-w-[296.89px] mx-auto mt-20 sm:mt-24 transition-all duration-900 ease-out ${
              showElements.bottomText
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[30px]"
            }`}
          >
            <p
              className={`font-[800] xl:text-[24px] text-center leading-[60px] text-[#EBB607] transition-all duration-500 delay-200 ${
                showElements.bottomText ? "text-shadow-lg" : ""
              }`}
            >
              Unlock Hall of Mutants
            </p>
            <p
              className={`font-[300] xl:text-[23px] leading-[30px] text-center transition-all duration-500 delay-400 ${
                showElements.bottomText ? "opacity-100" : "opacity-70"
              }`}
            >
              Complete 2 missions to join the leaderboard
            </p>
          </div>
        </div>
      )}
    </>
  );
}
