"use client";
import axios from "axios";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { StudentContext } from "./Context/StudentContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import { generateCourseGuideSlug } from "@/lib/studentMissionUtils";

export default function LevelsPath({
  level: levelProp,
  missionTitle,
  missionData,
}) {
  const [currentCapsule, setCurrentCapsule] = useState(null);
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizStates, setQuizStates] = useState({});
  const [curentcapselID, setCurentcapselID] = useState(0);
  const [watchedData, setWatchedData] = useState(null);
  const [levelState, setLevelState] = useState({
    container: null,
    level: null,
    id: null,
  });

  const level = Array.isArray(levelProp)
    ? levelProp
    : levelProp
    ? [levelProp]
    : [];

  const { missionsCapsels, setMissionsCapsels } = useContext(StudentContext);

  console.log("Levels Path:", levelState.id);
  console.log(level, "------------------------------------------------------");

  const positions = [
    { top: "0px", left: "50%" },
    { top: "90px", left: "20%" },
    { top: "240px", left: "15%" },
    { top: "360px", left: "25%" },
    { top: "480px", left: "40%" },
    { top: "600px", left: "55%" },
  ];

  // Load level state from localStorage on component mount
  useEffect(() => {
    const savedLevelState = localStorage.getItem("currentLevelState");
    if (savedLevelState) {
      try {
        const parsedState = JSON.parse(savedLevelState);
        setLevelState(parsedState);
      } catch (error) {
        console.error("Error parsing saved level state:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchMissionData = async () => {
      const token = localStorage.getItem("login-accessToken");

      try {
        const response = await axios.get(
          `https://themutantschool-backend.onrender.com/api/mission-capsule/level/${levelState.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response, "all response");
        console.log(levelState.id);
      } catch (error) {
        console.log(
          "Error fetching missions:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    if (levelState.id) {
      fetchMissionData();
    } else {
      setLoading(false);
    }
  }, [levelState.id]);

  useEffect(() => {
    const fetchWatchedVideo = async () => {
      const token = localStorage.getItem("login-accessToken");
      const missionId = localStorage.getItem("currentMissionId");

      if (!missionId) {
        console.error("No mission ID found in localStorage");
        return;
      }

      // Make sure we have a valid MongoDB ID
      if (!missionId.match(/^[0-9a-f]{24}$/)) {
        console.error("Invalid mission ID format:", missionId);
        return;
      }

      console.log("Fetching watched capsules for mission ID:", missionId);

      try {
        const response = await axios.get(
          `https://themutantschool-backend.onrender.com/api/mission/${missionId}/watched-capsule`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            timeout: 15000, // 15 second timeout
          }
        );

        console.log(
          "Fetched Watched all mission Video Data everything:----------",
          response.data
        );

        setWatchedData(response.data?.data);
      } catch (error) {
        console.log(
          "Error fetching missions:",
          error.response?.data || error.message
        );

        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);

          if (error.response.status === 401) {
            console.error("Authentication error - token may be invalid");
          } else if (error.response.status === 500) {
            console.error("Server error - check mission ID format");
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error setting up request:", error.message);
        }
      }
    };

    fetchWatchedVideo();
  }, []);

  // Helper function to get completed capsules for a specific level
  const getCompletedCapsulesForLevel = (levelId) => {
    if (!watchedData || !watchedData.levels) return [];

    const levelData = watchedData.levels.find(
      (level) => level.levelId === levelId
    );
    return levelData
      ? levelData.completedCapsules || levelData.viewedCapsules || []
      : [];
  };

  // Helper function to check if a capsule is completed
  const isCapsuleCompleted = (capsuleId, levelId) => {
    const completedCapsules = getCompletedCapsulesForLevel(levelId);
    return completedCapsules.some(
      (completed) => completed.capsuleId === capsuleId
    );
  };

  // Function to check if capsule should be enabled
  const isCapsuleEnabled = (containerIndex, levelIndex, capsuleId) => {
    if (containerIndex === 0 && levelIndex === 0) {
      return true;
    }

    const currentLevel = level[containerIndex];
    if (!currentLevel) return false;

    if (levelIndex > 0) {
      const prevCapsule = currentLevel.capsules[levelIndex - 1];
      return isCapsuleCompleted(prevCapsule._id, currentLevel._id);
    }

    if (containerIndex > 0) {
      const prevLevel = level[containerIndex - 1];
      if (!prevLevel || !prevLevel.capsules) return false;

      const allPrevCapsulesDone = prevLevel.capsules.every((capsule) =>
        isCapsuleCompleted(capsule._id, prevLevel._id)
      );
      return allPrevCapsulesDone;
    }

    return false;
  };

  // Updated function to check if quiz should be enabled
  const isQuizEnabled = (containerIndex) => {
    const currentLevel = level[containerIndex];
    if (!currentLevel || !currentLevel.capsules) return false;

    const completedCapsules = getCompletedCapsulesForLevel(currentLevel._id);
    const totalCapsules = currentLevel.capsules.length;
    const completedCount = completedCapsules.length;

    console.log(
      `Level ${
        containerIndex + 1
      }: ${completedCount}/${totalCapsules} capsules completed`
    );

    return completedCount === totalCapsules && totalCapsules > 0;
  };

  // Function to handle capsule click
  const handleCapsuleClick = (
    containerIndex,
    levelIndex,
    currentlevelId,
    capsuleId
  ) => {
    if (isCapsuleEnabled(containerIndex, levelIndex, capsuleId)) {
      const newLevelState = {
        container: containerIndex,
        level: levelIndex,
        id: currentlevelId,
      };

      setLevelState(newLevelState);
      localStorage.setItem("currentLevelState", JSON.stringify(newLevelState));
      localStorage.setItem("currentLevelId", currentlevelId);
      localStorage.setItem("currentCapsuleId", capsuleId);
    }
  };

  // Function to handle quiz click
  const handleQuizClick = (containerIndex) => {
    if (isQuizEnabled(containerIndex)) {
      const currentLevel = level[containerIndex];
      if (currentLevel && currentLevel._id) {
        // Navigate to the course guide page for this level
        window.location.href = `/student/student-dashboard/student-course-guilde/${generateCourseGuideSlug(
          currentLevel._id,
          currentLevel.title,
          null
        )}?startQuiz=true`;
      }
    }
  };

  // Function to check if quiz is selected for a specific level
  const isQuizSelected = (containerIndex) => {
    return quizStates[containerIndex] || false;
  };

  if (loading)
    return (
      <div className="p-4">
        <LoadingSpinner size="large" color="mutant" />
      </div>
    );

  return (
    <div className="h-fit flex flex-col gap-5 max-w-[800px] w-full ">
      {/* Mission Title Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/student/student-dashboard"
          className="text-white hover:text-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {missionTitle || "Mission"}
          </h1>
          <p className="text-gray-400 text-sm">{level?.length || 0} Levels</p>
        </div>
      </div>
      {level?.map((currentlevel, containerIndex) => {
        // Calculate quiz enabled state for this level
        const quizEnabled = isQuizEnabled(containerIndex);
        const quizSelected = isQuizSelected(containerIndex);

        return (
          <div key={containerIndex}>
            <div className="relative w-full flex flex-col gap-3 h-[1100px] sm:h-[1050px] bg-black">
              <div>
                <div
                  style={{ padding: "30px" }}
                  className=" bg-gradient-to-r from-[#231926] to-[#5D1D49] rounded-[20px] h-[233.0986328125px] w-full grid gap-5 sm:grid-cols-2"
                >
                  <div className="flex flex-col gap-5 sm:gap-0 justify-between order-2 sm:order-1">
                    <div className="flex flex-col gap-10">
                      <div>
                        <p className="font-[800] text-[21px] leading-[39px] xl:text-[38px] leading-[39px]">
                          {currentlevel.title}
                        </p>
                        <p className="font-[400] text-[15px] leading-[18px] xl:text-[18px] leading-[18px]">
                          {currentlevel.summary}
                        </p>
                      </div>

                      <p className="font-[300] text-[15px] xl:text-[23px] leading-[20px]">
                        {currentlevel.capsules?.length} Capsules • 1 Quiz
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundImage: `url(${"/images/students-images/Group (15).png"})`,
                    }}
                    className="bg-center bg-cover h-[20vh] order-1 w-full sm:h-full"
                  ></div>
                </div>
              </div>

              {/* Label before levels */}
              <p style={{ margin: "10px 0px" }}></p>

              {/* Render capsules */}
              {currentlevel.capsules &&
                currentlevel.capsules.map((capsule, levelIndex) => {
                  const isEnabled = isCapsuleEnabled(
                    containerIndex,
                    levelIndex,
                    capsule._id
                  );
                  const isCompleted = isCapsuleCompleted(
                    capsule._id,
                    currentlevel._id
                  );
                  const isSelected =
                    levelState.container === containerIndex &&
                    levelState.level === levelIndex;

                  const CapsuleContent = (
                    <div
                      style={{
                        top: positions[levelIndex]?.top || "0px",
                        left: positions[levelIndex]?.left || "50%",
                        transform: "translateX(-50%)",
                      }}
                      className="absolute h-fit"
                    >
                      {/* shadow layer */}
                      <div
                        className={`${
                          isSelected && isEnabled
                            ? "bg-[#231926]"
                            : isEnabled
                            ? "bg-[#4f4f4e]"
                            : "bg-[#2a2a2a]"
                        } absolute w-full h-[15px] bottom-[-10px] rounded-b-lg`}
                      ></div>

                      <div
                        style={{ padding: "35px" }}
                        className={`${
                          isSelected && isEnabled
                            ? "border border-[#840B94] rounded-[20px] border-[7px] shadow-[0_0_20px_rgba(132,11,148,0.6)] hover:shadow-[0_0_30px_rgba(132,11,148,0.8)] transition-all duration-300"
                            : ""
                        } absolute w-fit h-fit top-[-20px] left-[-18px]`}
                      ></div>

                      {/* capsule */}
                      <div
                        onClick={() =>
                          handleCapsuleClick(
                            containerIndex,
                            levelIndex,
                            currentlevel._id,
                            capsule._id
                          )
                        }
                        style={{ padding: "0 20px" }}
                        className={`${
                          isSelected && isEnabled
                            ? "bg-[#840B94] text-white hover:shadow-[0_0_15px_rgba(132,11,148,0.7)] hover:scale-105"
                            : isCompleted
                            ? "bg-[#840B94] text-white hover:shadow-[0_0_15px_rgba(132,11,148,0.7)] hover:scale-105"
                            : isEnabled
                            ? "bg-[#9E9E9E] text-black cursor-pointer hover:bg-[#ABABAB] hover:scale-105"
                            : "bg-[#5A5A5A] text-[#8A8A8A] cursor-not-allowed"
                        } relative z-10 w-fit h-[37.91px] flex items-center justify-center rounded-lg font-bold px-5 transition-all duration-300 group`}
                      >
                        {levelIndex + 1}
                        {isCompleted && <span className="ml-2 text-xs">✓</span>}
                        {!isEnabled && <span className="ml-2 text-xs">🔒</span>}

                        {/* Hover Tooltip */}
                        <div
                          style={{ padding: "20px" }}
                          className="absolute top-0 left-full transform ml-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 w-[300px]"
                        >
                          <div
                            style={{ padding: "10px" }}
                            className="relative bg-[#0E0E0E] flex flex-col gap-3 border-[7px] border-[#840B94] border-solid rounded-[20px] shadow-[0_0_15px_rgba(132,11,148,0.6)]"
                          >
                            {/* TRIANGLE POINTER */}
                            <div className="absolute top-3 -left-3 w-0 h-0 border-t-[10px] border-b-[10px] border-r-[10px] border-t-transparent border-b-transparent border-r-[#840B94]"></div>
                            <div className="absolute top-3 -left-2 w-0 h-0 border-t-[9px] border-b-[9px] border-r-[9px] border-t-transparent border-b-transparent border-r-[#0E0E0E]"></div>

                            {/* Step indicator */}
                            <div className="flex items-center gap-2 p-2">
                              <span className="text-gray-400 text-xs">
                                Enter the lab
                              </span>
                            </div>

                            <div className="px-4 pb-4 flex flex-col gap-2">
                              <h3 className="font-bold text-[#840B94] text-lg mb-1">
                                {capsule.title || "Untitled"}
                              </h3>
                              <p className="text-gray-400 text-xs mb-2">
                                {capsule.duration || "15 mins"}
                              </p>
                              <p className="text-gray-300 text-xs mb-3 leading-relaxed">
                                {capsule.description ||
                                  "No description available"}
                              </p>

                              <div className="flex items-center justify-between">
                                <button
                                  style={{ padding: "5px 10px" }}
                                  className="bg-[#840B94] hover:bg-[#9A0DAF] text-white px-4 py-2 rounded-md font-semibold text-xs transition-colors duration-200"
                                >
                                  Start Mission
                                </button>
                                <span className="text-[#840B94] text-xs font-bold">
                                  5XP
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );

                  return isEnabled ? (
                    <Link
                      href={`/student/student-dashboard/student-course-guilde/${generateCourseGuideSlug(
                        currentlevel._id,
                        currentlevel.title,
                        capsule._id
                      )}`}
                      key={capsule._id || levelIndex}
                      className="relative"
                    >
                      {CapsuleContent}
                    </Link>
                  ) : (
                    <div key={capsule._id || levelIndex} className="relative">
                      {CapsuleContent}
                    </div>
                  );
                })}

              {/* quiz btn */}
              <div
                style={{
                  bottom: 0,
                  left: "55%",
                  transform: "translateX(-50%)",
                }}
                className="absolute h-fit"
              >
                {/* shadow layer */}
                <div
                  className={`${
                    quizEnabled ? "bg-[#4f4f4e]" : "bg-[#2a2a2a]"
                  } absolute w-full h-[15px] bottom-[-10px] rounded-b-lg`}
                ></div>

                <div
                  style={{ padding: "35px" }}
                  className={`${
                    quizSelected && quizEnabled
                      ? "border border-[#5D5D5D] rounded-[20px] border-[7px] w-[90px]"
                      : ""
                  } absolute w-fit h-fit top-[-20px] left-[-18px]`}
                ></div>

                {/* Quiz */}
                <div
                  onClick={() => handleQuizClick(containerIndex)}
                  style={{ padding: "0 20px" }}
                  className={`${
                    quizSelected && quizEnabled
                      ? "bg-[#840B94] text-white"
                      : quizEnabled
                      ? "bg-[#840B94] text-white cursor-pointer "
                      : "bg-[#5A5A5A] text-[#8A8A8A] cursor-not-allowed"
                  } relative z-10 w-fit h-[37.91px] flex items-center justify-center rounded-lg font-bold px-5 transition-colors duration-200`}
                >
                  Quiz
                  {!quizEnabled && <span className="ml-2 text-xs">🔒</span>}
                  {quizEnabled && <span className="ml-2 text-xs">🔓</span>}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
